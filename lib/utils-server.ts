import type { User } from '@supabase/supabase-js'

export interface GetUserResult {
  user: User | null
  error: any
}

export async function getUser(): Promise<GetUserResult> {
  try {
    const { createSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await createSupabaseServerClient()
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
