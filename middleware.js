import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { checkPermission } from '@/lib/auth/permission'
import { ResponseModel } from '@/lib/model/Response'

export async function middleware(request) {
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
    ResponseModel.status = '401'
    ResponseModel.message = 'Authentication required'
    ResponseModel.data = null
    console.error("Authentication required") //for Debug
    return NextResponse.json(ResponseModel, { status: 401 }) //for User
  }
  const decoded = await verifyToken(token) 
  if (!decoded) {
    ResponseModel.status = '401'
    ResponseModel.message = 'Invalid or expired token'
    ResponseModel.data = null
    console.error("Invalid or expired token") //for Debug
    return NextResponse.json(ResponseModel, { status: 401 }) //for User
  }
  const { userId, position } = decoded
  if (!userId || !position) {
    ResponseModel.status = '401'
    ResponseModel.message = 'Invalid token claims'
    ResponseModel.data = null
    console.error("Invalid token claims") //for Debug
    return NextResponse.json(ResponseModel, { status: 401 }) //for User
  }
  const hasPermission = checkPermission(position, method, pathname)
  if (!hasPermission) {
    ResponseModel.status = '403'
    ResponseModel.message = 'Insufficient permissions'
    ResponseModel.data = null
    console.error("Insufficient permissions") //for Debug
    return NextResponse.json(ResponseModel, { status: 403 }) //for User
  }
  const response = NextResponse.next()
  response.headers.set('x-user-id', userId)
  response.headers.set('x-user-role', position)
  return response
}

export const config = { matcher: ['/api/user/:path*'] }




  // import { NextResponse } from "next/server";

  // export function middleware(request) {
  //   const token = request.cookies.get("token")?.value;
  //   const pathname = request.nextUrl.pathname;

  //   // ยังไม่ล็อกอิน → แต่จะเข้าเพจอื่นที่ไม่ใช่ /login → เตะไป /login
  //   if (!token && !pathname.startsWith("/login")) {
  //     const loginUrl = new URL("/login", request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }

  //   // ล็อกอินแล้ว → แต่ยังอยู่ /login → ส่งไปหน้าแรก
  //   if (token && pathname.startsWith("/login")) {
  //     const homeUrl = new URL("/", request.url);
  //     return NextResponse.redirect(homeUrl);
  //   }

  //   return NextResponse.next();
  // }

  // export const config = {
  //   matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
  // };
