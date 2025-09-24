import { createBrowserClient } from '@supabase/ssr'

export function CreateClientPublic() {
  return createBrowserClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )
}

export function CreateClientSecret() {
  return createBrowserClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )
}