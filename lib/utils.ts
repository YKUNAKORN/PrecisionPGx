import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export { cn } from '@/lib/utils/cn'

export async function getUser(): Promise<{ user: User | null; error: any }> {
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

export async function requireAuth(): Promise<User> {
  const { user, error } = await getUser()
  
  if (!user || error) {
    throw new Error('Authentication required')
  }
  
  return user
}
