import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { checkPermission } from '@/lib/auth/permission'
import { ResponseModel } from '@/lib/model/Response'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const method = request.method
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  const token = request.cookies.get('supabase-auth-token')?.value
  if (!token) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '401'
    errorResponse.message = 'Authentication required'
    errorResponse.data = null
    console.error("Authentication required") //for Debug
    return NextResponse.json(errorResponse, { status: 401 }) //for User
  }
  const decoded = await verifyToken(token) 
  if (!decoded) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '401'
    errorResponse.message = 'Invalid or expired token'
    errorResponse.data = null
    console.error("Invalid or expired token") //for Debug
    return NextResponse.json(errorResponse, { status: 401 }) //for User
  }
  const { userId, position } = decoded
  if (!userId || !position) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '401'
    errorResponse.message = 'Invalid token claims'
    errorResponse.data = null
    console.error("Invalid token claims") //for Debug
    return NextResponse.json(errorResponse, { status: 401 }) //for User
  }
  const hasPermission = checkPermission(position, method, pathname)
  if (!hasPermission) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '403'
    errorResponse.message = 'Insufficient permissions'
    errorResponse.data = null
    console.error("Insufficient permissions") //for Debug
    return NextResponse.json(errorResponse, { status: 403 }) //for User
  }
  const response = NextResponse.next()
  response.headers.set('x-user-id', userId)
  response.headers.set('x-user-role', position)
  return response
}

export const config = { matcher: ['/api/user/:path*'] }
