import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth/jwt'
import { checkPermission } from './lib/auth/permission'

export async function middleware(request) {
  const { pathname, search } = request.nextUrl
  const method = request.method

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('supabase-auth-token')?.value
  console.log('Environment JWT_SECRET exists:', !!process.env.JWT_SECRET)
  console.log('Raw token from cookie:', token?.substring(0, 50) + '...')

  if (!token) {
    return NextResponse.json(
      { 
        status: '401',
        message: 'Authentication required',
        data: null 
      }, { status: 401 }
    )
  }

  // Use async verifyToken
  const decoded = await verifyToken(token)
  console.log('Decoded token:', decoded)
  
  if (!decoded) {
    return NextResponse.json(
      { 
        status: '401',
        message: 'Invalid or expired token',
        data: null 
      }, { status: 401 }
    )
  }

  const { userId, role } = decoded

  if (!userId || !role) {
    return NextResponse.json(
      { 
        status: '401',
        message: 'Invalid token claims',
        data: null 
      }, { status: 401 }
    )
  }

  const hasPermission = checkPermission(role, method, pathname)
  
  if (!hasPermission) {
    return NextResponse.json(
      { 
        status: '403',
        message: 'Insufficient permissions',
        data: null 
      }, { status: 403 }
    )
  }

  const response = NextResponse.next()
  response.headers.set('x-user-id', userId)
  response.headers.set('x-user-role', role)

  return response
}

export const config = {
  matcher: [
    '/api/user/:path*'
  ]
}