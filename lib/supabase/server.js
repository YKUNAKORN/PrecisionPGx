import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function CreateClientServer() {
  const store = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY,
    {
      cookies: {
        get(name) {
          return store.get(name)?.value
        },
        set(name, value, options) {
          try {
            store.set({name, value, ...options})
          } 
          catch (error) {
          }
        },
        remove(name, options) {
          try {
            store.set({name, value: '', ...options})
          } 
          catch (error) {
          }
        },
      },
    }
  )
}