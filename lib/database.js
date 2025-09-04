import { createClient } from '@/lib/supabase/client'

export const supabase = createClient()

export async function testConnection() {
  try {
    const { error } = await supabase.auth.getSession()
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('Supabase connection successful!')
    return true
  } 
  catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}