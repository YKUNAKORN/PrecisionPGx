import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  const cookieStore = await cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          // Only return our custom auth token, not Supabase's auto-generated ones
          const customToken = cookieStore.get('supabase-auth-token')
          return customToken ? [customToken] : []
        },
        setAll(cookiesToSet) {
          // Prevent Supabase from setting its own cookies
          // Only allow our custom cookies to be set
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Only set cookies that we explicitly want
              if (name === 'supabase-auth-token' || name === 'supabase-refresh-token') {
                cookieStore.set(name, value, options)
              }
              // Ignore Supabase's auto-generated cookies
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Alternative function for auth operations that bypasses cookie handling
export async function createSupabaseServerClientForAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Do nothing - prevent any cookie setting
        },
      },
    }
  )
}