import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import { createSupabaseServerClientForAuth } from '../../../../lib/supabase/server'
import { generateToken } from '../../../../lib/auth/jwt'

export async function Login(email, password) {
  try {
    const supabase = await createSupabaseServerClientForAuth()
    
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
      
      // Generate JWT token with claims (async)
      const jwtToken = await generateToken({
        userId: data.user.id,
        position: data.user.user_metadata?.position || 'user',
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