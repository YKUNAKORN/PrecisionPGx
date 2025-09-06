import { createServerClient } from '@supabase/ssr'
import { getUserProfile, updateUserProfile } from '@/lib/user'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    let accessToken = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7)
    }
    
    const response = NextResponse.next()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
        global: {
          headers: accessToken ? {
            Authorization: `Bearer ${accessToken}`
          } : {}
        }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'User not authenticated',
        code: 'AUTH_REQUIRED',
        details: authError?.message
      }, { status: 401 })
    }

    const { data, error } = await getUserProfile(user.id)
    
    if (error) {
      if (error.message?.includes('not found') || error.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'User profile not found. Please sync your profile first.',
          code: 'PROFILE_NOT_FOUND'
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch profile' 
      }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ 
        error: 'Profile not found',
        code: 'PROFILE_NOT_FOUND'
      }, { status: 404 })
    }

    return NextResponse.json({ data })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, username, fullname, position } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await updateUserProfile(id, {
      username,
      fullname,
      position
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      data 
    })

  } 
  
  catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}