import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password, ...otherData } = await request.json()
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
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }
  }

  return NextResponse.json({ data, error })
}