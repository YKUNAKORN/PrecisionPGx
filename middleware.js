import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const response = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ request, response })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  return response
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    '/api/user/:path*'
  ]
}