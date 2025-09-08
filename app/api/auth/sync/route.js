import { syncAuthUserToPublicUser } from '@/lib/user'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return NextResponse.json(
          { error: 'User not authenticated and no userId provided' }, 
          { status: 401 }
        )
      }
      
      const result = await syncAuthUserToPublicUser(user.id)
      
      if (result.success) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json(
          { error: result.error }, 
          { status: 500 }
        )
      }
    }

    const result = await syncAuthUserToPublicUser(userId)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }
  } 
  
  catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
