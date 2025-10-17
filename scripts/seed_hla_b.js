import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SECRET_KEY in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  const filePath = path.resolve(process.cwd(), 'supabase/seed/hla_b_rules.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const rows = JSON.parse(raw)

  console.log(`Upserting ${rows.length} rows into hla_b_rules...`)

  const { data, error } = await supabase.from('hla_b_rules').upsert(rows, { onConflict: 'id' }).select()

  if (error) {
    console.error('Upsert error:', error)
    process.exit(1)
  }

  console.log('Upsert OK. Rows returned:', data.length)
  console.log(JSON.stringify(data, null, 2))
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
