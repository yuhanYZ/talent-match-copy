-- Run this after applying 20260523000000_candidate_salary_recommendations.sql
-- if you already created/seeded the 25 demo candidate accounts.

update public.candidates c
set
  expected_salary_min = v.expected_salary_min,
  expected_salary_max = v.expected_salary_max
from public.profiles p
join (
  values
    ('Emily Chen', 58000, 80000),
    ('Oliver Smith', 55000, 76000),
    ('Ava Johnson', 48000, 65000),
    ('Noah Williams', 65000, 90000),
    ('Mia Brown', 40000, 58000),
    ('Lucas Wilson', 50000, 70000),
    ('Grace Lee', 75000, 105000),
    ('Ethan Martin', 42000, 60000),
    ('Chloe Anderson', 45000, 65000),
    ('Liam Thompson', 50000, 72000),
    ('Sophie Garcia', 70000, 100000),
    ('Jack Davis', 48000, 68000),
    ('Isabella Rodriguez', 48000, 65000),
    ('Henry Miller', 58000, 95000),
    ('Charlotte Moore', 55000, 85000),
    ('Benjamin Taylor', 52000, 78000),
    ('Amelia White', 60000, 82000),
    ('James Harris', 45000, 62000),
    ('Ella Clark', 60000, 82000),
    ('William Lewis', 54000, 72000),
    ('Harper Walker', 65000, 90000),
    ('Alexander Hall', 65000, 85000),
    ('Scarlett Young', 63000, 88000),
    ('Daniel King', 55000, 78000),
    ('Lily Wright', 42000, 72000)
) as v(full_name, expected_salary_min, expected_salary_max)
on p.full_name = v.full_name
where c.id = p.id;
