import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
export async function SignUp() {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (data.user && !error) {
    const { error: insertError } = await supabase
      .from('user')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
        }
      ])
    
    if (insertError) {
      console.error('Error inserting user profile:', insertError)
      ResponseModel.status = '500'
      ResponseModel.message = 'Failed to create user profile' + insertError
      return NextResponse.json(ResponseModel, { status: 500 })
    }
  }
  return { data, error }
}