import { createClient } from './supabase/server'

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, error }
    }
    
    return { user, error: null }
  } 
  
  catch (error) {
    return { user: null, error }
  }
}

export async function requireAuth() {
  const { user, error } = await getUser()
  
  if (!user || error) {
    throw new Error('Authentication required')
  }
  
  return user
}