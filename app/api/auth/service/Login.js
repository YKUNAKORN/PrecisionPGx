import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export async function Login(email, password) {
  const supabase = createRouteHandlerClient({ cookies })
  try {
    let response = NextResponse.json(ResponseModel)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      ResponseModel.status = '500'
      ResponseModel.message = 'Login failed: ' + error.message
      ResponseModel.data = null
      return NextResponse.json(ResponseModel, { status: 500 })
    }

    if (data.session) {
      ResponseModel.status = '200'
      ResponseModel.message = 'Login successful'
      ResponseModel.data = data.user
      response = NextResponse.json(ResponseModel)

      response.cookies.set('supabase-auth-token', data.session.access_token, {
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

  }

  catch (error) {
    ResponseModel.status = '500'
    ResponseModel.message = 'Login failed: Internal server error:  ' + error.message
    ResponseModel.data = null
    console.error(process.env.NODE_ENV === 'development' ? error.message : undefined ,error)
    return NextResponse.json(ResponseModel, { status: 500 })
  }
}