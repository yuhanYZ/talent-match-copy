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

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
const password = 'Demo123456'

const candidates = [
  ['Emily Chen', 'candidate01@talentmatch.demo', '0401 234 101'],
  ['Oliver Smith', 'candidate02@talentmatch.demo', '0401 234 102'],
  ['Ava Johnson', 'candidate03@talentmatch.demo', '0401 234 103'],
  ['Noah Williams', 'candidate04@talentmatch.demo', '0401 234 104'],
  ['Mia Brown', 'candidate05@talentmatch.demo', '0401 234 105'],
  ['Lucas Wilson', 'candidate06@talentmatch.demo', '0401 234 106'],
  ['Grace Lee', 'candidate07@talentmatch.demo', '0401 234 107'],
  ['Ethan Martin', 'candidate08@talentmatch.demo', '0401 234 108'],
  ['Chloe Anderson', 'candidate09@talentmatch.demo', '0401 234 109'],
  ['Liam Thompson', 'candidate10@talentmatch.demo', '0401 234 110'],
  ['Sophie Garcia', 'candidate11@talentmatch.demo', '0401 234 111'],
  ['Jack Davis', 'candidate12@talentmatch.demo', '0401 234 112'],
  ['Isabella Rodriguez', 'candidate13@talentmatch.demo', '0401 234 113'],
  ['Henry Miller', 'candidate14@talentmatch.demo', '0401 234 114'],
  ['Charlotte Moore', 'candidate15@talentmatch.demo', '0401 234 115'],
  ['Benjamin Taylor', 'candidate16@talentmatch.demo', '0401 234 116'],
  ['Amelia White', 'candidate17@talentmatch.demo', '0401 234 117'],
  ['James Harris', 'candidate18@talentmatch.demo', '0401 234 118'],
  ['Ella Clark', 'candidate19@talentmatch.demo', '0401 234 119'],
  ['William Lewis', 'candidate20@talentmatch.demo', '0401 234 120'],
  ['Harper Walker', 'candidate21@talentmatch.demo', '0401 234 121'],
  ['Alexander Hall', 'candidate22@talentmatch.demo', '0401 234 122'],
  ['Scarlett Young', 'candidate23@talentmatch.demo', '0401 234 123'],
  ['Daniel King', 'candidate24@talentmatch.demo', '0401 234 124'],
  ['Lily Wright', 'candidate25@talentmatch.demo', '0401 234 125'],
]

let created = 0
let skipped = 0
let failed = 0

for (const [fullName, email, contact] of candidates) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'candidate',
        full_name: fullName,
        contact,
      },
    },
  })

  if (error) {
    const message = error.message || String(error)
    if (message.toLowerCase().includes('registered') || message.toLowerCase().includes('already')) {
      skipped += 1
      console.log(`SKIP ${email} - already registered`)
    } else {
      failed += 1
      console.log(`FAIL ${email} - ${message}`)
    }
    continue
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    skipped += 1
    console.log(`SKIP ${email} - already registered`)
  } else {
    created += 1
    console.log(`OK   ${email} - ${fullName}`)
  }
}

console.log('')
console.log(`Created: ${created}`)
console.log(`Skipped: ${skipped}`)
console.log(`Failed: ${failed}`)
console.log(`Password for demo accounts: ${password}`)
