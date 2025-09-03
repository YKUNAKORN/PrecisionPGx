import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env for .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

console.log('Supabase URL:', supabaseUrl) // Debug log
console.log('Supabase Key:', supabaseKey ? 'Loaded' : 'Not loaded') // Debug log
 
export const supabase = createClient(supabaseUrl, supabaseKey)

// Check connection
export async function testConnection() {
  try {
    // call auth session
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('Supabase connection successful!')
    return true
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}