alter table public.candidates
  add column if not exists expected_salary_min int check (expected_salary_min is null or expected_salary_min >= 0),
  add column if not exists expected_salary_max int check (expected_salary_max is null or expected_salary_max >= 0);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'candidates_expected_salary_range_check'
  ) then
    alter table public.candidates
      add constraint candidates_expected_salary_range_check
      check (
        expected_salary_min is null
        or expected_salary_max is null
        or expected_salary_min <= expected_salary_max
      );
  end if;
end $$;

drop function if exists public.recommend_jobs_for_candidate(uuid, int);

create or replace function recommend_jobs_for_candidate(candidate_id uuid, p_limit int default 10)
returns table (
  id uuid,
  employer_id uuid,
  title text,
  description text,
  required_education text,
  required_skills text[],
  required_experience int,
  work_mode text,
  location text,
  created_at timestamptz,
  job_type text,
  salary_min int,
  salary_max int,
  score int
)
language sql
as $$
  with scored_jobs as (
    select
      j.id,
      j.employer_id,
      j.title,
      j.description,
      j.required_education,
      j.required_skills,
      j.required_experience,
      j.work_mode,
      j.location,
      j.created_at,
      j.job_type,
      j.salary_min,
      j.salary_max,
      (
        coalesce(
          array_length(
            array(
              select lower(job_skill.skill)
              from unnest(j.required_skills) as job_skill(skill)
              intersect
              select lower(candidate_skill.skill)
              from unnest(c.skills) as candidate_skill(skill)
            ),
            1
          ),
          0
        ) * 4
        + case when c.years_experience >= j.required_experience then 3 else 0 end
        + case when lower(c.education) = lower(j.required_education) then 2 else 0 end
        + case when c.preferred_work_mode = j.work_mode then 3 else 0 end
        + case
            when c.preferred_location = '' then 0
            when lower(c.preferred_location) = 'australia' then 1
            when lower(j.location) = 'australia' then 2
            when j.location ilike '%' || c.preferred_location || '%' then 4
            when c.preferred_location ilike '%' || j.location || '%' then 4
            else 0
          end
        + case
            when c.expected_salary_min is null and c.expected_salary_max is null then 0
            when c.expected_salary_min is not null and j.salary_max is not null and j.salary_max < c.expected_salary_min then -4
            when c.expected_salary_max is not null and j.salary_min is not null and j.salary_min > c.expected_salary_max then -4
            when (c.expected_salary_min is null or j.salary_max is null or j.salary_max >= c.expected_salary_min)
             and (c.expected_salary_max is null or j.salary_min is null or j.salary_min <= c.expected_salary_max) then 3
            else 0
          end
      )::int as score
    from public.jobs j
    cross join public.candidates c
    where c.id = candidate_id
  )
  select
    scored_jobs.id,
    scored_jobs.employer_id,
    scored_jobs.title,
    scored_jobs.description,
    scored_jobs.required_education,
    scored_jobs.required_skills,
    scored_jobs.required_experience,
    scored_jobs.work_mode,
    scored_jobs.location,
    scored_jobs.created_at,
    scored_jobs.job_type,
    scored_jobs.salary_min,
    scored_jobs.salary_max,
    scored_jobs.score
  from scored_jobs
  where scored_jobs.score > 0
  order by scored_jobs.score desc, scored_jobs.created_at desc
  limit least(greatest(p_limit, 1), 10);
$$;
