import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter(line => line.trim() && !line.trim().startsWith('#'))
    .map(line => {
      const index = line.indexOf('=')
      return [line.slice(0, index), line.slice(index + 1)]
    })
)

const password = 'Demo123456'

const candidates = [
  ['Emily Chen', 'candidate01@talentmatch.demo', '0401 234 101', 'Bachelor', 'Marketing', 2, ['Marketing', 'Social Media', 'Content Writing', 'Campaign Planning', 'Communication'], 'Worked as a marketing assistant for a retail brand, supporting social media calendars, campaign reporting, and email promotions.', 'Hybrid', 'Sydney', true],
  ['Oliver Smith', 'candidate02@talentmatch.demo', '0401 234 102', 'Diploma', 'Business Administration', 3, ['Customer Service', 'Retail Sales', 'Team Leadership', 'Stock Management', 'Problem Solving'], 'Supervised retail floor operations, trained new staff, handled customer concerns, and supported weekly stock control.', 'On-site', 'Melbourne', false],
  ['Ava Johnson', 'candidate03@talentmatch.demo', '0401 234 103', 'High School', 'Office Administration', 1, ['Administration', 'Data Entry', 'Microsoft Office', 'Scheduling', 'Communication'], 'Completed office administration work placement involving reception, document preparation, calendar updates, and data entry.', 'On-site', 'Wollongong', false],
  ['Noah Williams', 'candidate04@talentmatch.demo', '0401 234 104', 'Bachelor', 'Human Resources', 2, ['Human Resources', 'Recruitment', 'Onboarding', 'Employee Relations', 'Documentation'], 'Supported recruitment coordination, interview scheduling, onboarding checklists, and employee record maintenance.', 'Hybrid', 'Sydney', true],
  ['Mia Brown', 'candidate05@talentmatch.demo', '0401 234 105', 'Diploma', 'Education Support', 1, ['Education Support', 'Child Development', 'Classroom Support', 'Patience', 'Communication'], 'Assisted primary school teachers with reading groups, classroom resources, student supervision, and learning activities.', 'On-site', 'Newcastle', false],
  ['Lucas Wilson', 'candidate06@talentmatch.demo', '0401 234 106', 'Diploma', 'Early Childhood Education', 2, ['Early Childhood Education', 'Child Safety', 'Learning Activities', 'Family Communication', 'Observation'], 'Worked in an early learning centre planning activities, documenting child development, and communicating with families.', 'On-site', 'Brisbane', true],
  ['Grace Lee', 'candidate07@talentmatch.demo', '0401 234 107', 'Bachelor', 'Nursing', 4, ['Nursing', 'Patient Care', 'Clinical Documentation', 'Medication Administration', 'Teamwork'], 'Registered nurse with experience in patient monitoring, care planning, medication rounds, and multidisciplinary teamwork.', 'On-site', 'Perth', true],
  ['Ethan Martin', 'candidate08@talentmatch.demo', '0401 234 108', 'High School', 'Health Administration', 1, ['Reception', 'Patient Service', 'Appointment Scheduling', 'Data Entry', 'Confidentiality'], 'Medical reception experience including appointment booking, patient records, phone enquiries, and front desk support.', 'On-site', 'Adelaide', false],
  ['Chloe Anderson', 'candidate09@talentmatch.demo', '0401 234 109', 'Certificate', 'Dental Assisting', 1, ['Dental Assisting', 'Sterilisation', 'Patient Care', 'Clinical Support', 'Organisation'], 'Completed dental assisting certificate and supported room preparation, instrument sterilisation, and chairside assistance.', 'On-site', 'Sydney', false],
  ['Liam Thompson', 'candidate10@talentmatch.demo', '0401 234 110', 'Certificate', 'Community Services', 2, ['Disability Support', 'Personal Care', 'Community Access', 'Care Notes', 'Empathy'], 'Supported clients with daily activities, transport, personal goals, and care documentation in community support settings.', 'On-site', 'Canberra', true],
  ['Sophie Garcia', 'candidate11@talentmatch.demo', '0401 234 111', 'Bachelor', 'Accounting', 3, ['Accounting', 'Financial Reporting', 'Reconciliation', 'Excel', 'Budgeting'], 'Prepared monthly reconciliations, assisted budget tracking, processed invoices, and supported financial reporting.', 'Hybrid', 'Melbourne', true],
  ['Jack Davis', 'candidate12@talentmatch.demo', '0401 234 112', 'Certificate', 'Bookkeeping', 2, ['Bookkeeping', 'Payroll', 'Invoicing', 'Bank Reconciliation', 'Xero'], 'Maintained bookkeeping records for small businesses using Xero, including payroll entries, invoices, and bank reconciliation.', 'Remote', 'Australia', false],
  ['Isabella Rodriguez', 'candidate13@talentmatch.demo', '0401 234 113', 'High School', 'Customer Service', 1, ['Customer Service', 'Communication', 'Problem Solving', 'CRM', 'Attention to Detail'], 'Handled customer enquiries through phone, email, and live chat while maintaining accurate CRM records.', 'Remote', 'Australia', false],
  ['Henry Miller', 'candidate14@talentmatch.demo', '0401 234 114', 'High School', 'Sales', 3, ['Sales', 'Negotiation', 'Customer Relationship', 'Product Knowledge', 'Communication'], 'Worked in retail and business sales, following up leads, preparing quotes, and maintaining client relationships.', 'Hybrid', 'Sydney', true],
  ['Charlotte Moore', 'candidate15@talentmatch.demo', '0401 234 115', 'Bachelor', 'Graphic Design', 2, ['Graphic Design', 'Adobe Creative Suite', 'Branding', 'Layout Design', 'Creativity'], 'Designed digital campaign assets, social media graphics, brochures, and presentation templates for small business clients.', 'Hybrid', 'Melbourne', false],
  ['Benjamin Taylor', 'candidate16@talentmatch.demo', '0401 234 116', 'Bachelor', 'Communications', 2, ['Content Writing', 'Editing', 'Research', 'SEO', 'Communication'], 'Created blog articles, website copy, newsletters, and SEO content for education and lifestyle brands.', 'Remote', 'Australia', true],
  ['Amelia White', 'candidate17@talentmatch.demo', '0401 234 117', 'Diploma', 'Event Management', 3, ['Event Planning', 'Supplier Coordination', 'Logistics', 'Budget Tracking', 'Communication'], 'Coordinated venues, supplier timelines, run sheets, guest lists, and event-day operations for community events.', 'On-site', 'Brisbane', false],
  ['James Harris', 'candidate18@talentmatch.demo', '0401 234 118', 'High School', 'Hospitality', 1, ['Hospitality', 'Guest Service', 'Reservations', 'Communication', 'Problem Solving'], 'Front desk and guest services experience in a hotel environment, including reservations and check-in support.', 'On-site', 'Sydney', false],
  ['Ella Clark', 'candidate19@talentmatch.demo', '0401 234 119', 'Certificate', 'Commercial Cookery', 4, ['Cooking', 'Food Safety', 'Kitchen Operations', 'Time Management', 'Teamwork'], 'Prepared meals in high-volume kitchens, managed a section during service, and followed food safety procedures.', 'On-site', 'Melbourne', true],
  ['William Lewis', 'candidate20@talentmatch.demo', '0401 234 120', 'High School', 'Warehouse Operations', 2, ['Warehouse Operations', 'Inventory Control', 'Dispatch', 'Forklift', 'Safety'], 'Worked across receiving, picking, packing, forklift operation, stock checks, and dispatch preparation.', 'On-site', 'Perth', false],
  ['Harper Walker', 'candidate21@talentmatch.demo', '0401 234 121', 'Diploma', 'Logistics', 3, ['Logistics', 'Transport Planning', 'Scheduling', 'Problem Solving', 'Excel'], 'Coordinated shipment schedules, delivery tracking, transport provider communication, and logistics reporting.', 'Hybrid', 'Adelaide', true],
  ['Alexander Hall', 'candidate22@talentmatch.demo', '0401 234 122', 'Bachelor', 'Civil Engineering', 1, ['Civil Engineering', 'AutoCAD', 'Project Documentation', 'Site Inspection', 'Problem Solving'], 'Graduate civil engineer with internship experience in site inspections, AutoCAD updates, and infrastructure reports.', 'Hybrid', 'Sydney', false],
  ['Scarlett Young', 'candidate23@talentmatch.demo', '0401 234 123', 'Bachelor', 'Environmental Science', 2, ['Environmental Science', 'Compliance', 'Sustainability', 'Reporting', 'Site Assessment'], 'Supported environmental audits, sustainability reporting, site assessments, and compliance documentation.', 'Hybrid', 'Hobart', true],
  ['Daniel King', 'candidate24@talentmatch.demo', '0401 234 124', 'Diploma', 'Legal Services', 1, ['Legal Administration', 'Document Preparation', 'Research', 'Client Service', 'Confidentiality'], 'Assisted with legal filing, client intake, appointment scheduling, document preparation, and confidential records.', 'On-site', 'Sydney', false],
  ['Lily Wright', 'candidate25@talentmatch.demo', '0401 234 125', 'Bachelor', 'Exercise Science', 2, ['Fitness Training', 'Coaching', 'Program Design', 'Customer Service', 'Motivation'], 'Designed fitness programs, coached clients, tracked progress, and supported member engagement at a local gym.', 'On-site', 'Brisbane', false],
]

let seeded = 0
let failed = 0

for (const candidate of candidates) {
  const [
    fullName,
    email,
    contact,
    education,
    fieldOfStudy,
    yearsExperience,
    skills,
    workExperience,
    preferredWorkMode,
    preferredLocation,
    isMember,
  ] = candidate

  const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  const { data: authData, error: signInError } = await client.auth.signInWithPassword({ email, password })

  if (signInError || !authData.user) {
    failed += 1
    console.log(`FAIL ${email} - sign in failed: ${signInError?.message ?? 'No user returned'}`)
    continue
  }

  const userId = authData.user.id

  const { error: profileError } = await client
    .from('profiles')
    .update({ full_name: fullName, contact, is_member: isMember })
    .eq('id', userId)

  if (profileError) {
    failed += 1
    console.log(`FAIL ${email} - profile update failed: ${profileError.message}`)
    continue
  }

  const { error: candidateError } = await client
    .from('candidates')
    .upsert({
      id: userId,
      education,
      field_of_study: fieldOfStudy,
      years_experience: yearsExperience,
      skills,
      work_experience: workExperience,
      preferred_work_mode: preferredWorkMode,
      preferred_location: preferredLocation,
    })

  if (candidateError) {
    failed += 1
    console.log(`FAIL ${email} - candidate upsert failed: ${candidateError.message}`)
    continue
  }

  seeded += 1
  console.log(`OK   ${email} - ${fullName}`)
}

console.log('')
console.log(`Seeded: ${seeded}`)
console.log(`Failed: ${failed}`)
