import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { createSupabaseServerClientForAuth } from '@/lib/supabase/server'
import { generateToken } from '@/lib/auth/jwt'
import { GetById } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'

export async function Login(email, password) {
  try {
    const supabase = await createSupabaseServerClientForAuth()
    const db = CreateClientSecret()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      const errorResponse = { ...ResponseModel }
      errorResponse.status = '500'
      errorResponse.message = 'Login failed: ' + error.message
      errorResponse.data = null
      return NextResponse.json(errorResponse, { status: 500 })
    }
    if (data.session) {
      const successResponse = { ...ResponseModel }
      successResponse.status = '200'
      successResponse.message = 'Login successful'
      successResponse.data = data.user
      const userProfile = await GetById(db, 'user', data.user.id)      
      const jwtToken = await generateToken({
        userId: data.user.id,
        position: userProfile.data[0].position,
        email: data.user.email
      })
      const response = NextResponse.json(successResponse)
      response.cookies.set('supabase-auth-token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 
      })
      response.cookies.set('supabase-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 
      })
      return response
    }
    return NextResponse.json({ data, error })
  } catch (error) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '500'
    errorResponse.message = 'Login failed: Internal server error: ' + error.message
    errorResponse.data = null
    console.error(process.env.NODE_ENV === 'development' ? error.message : undefined, error)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}