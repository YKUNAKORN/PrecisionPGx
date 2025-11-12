import { createClient } from '@/lib/supabase/server'

interface UserData {
  email?: string
  username?: string | null
  fullname?: string | null
  position?: string | null
}

interface UserProfileResult {
  data: any | null
  error: any | null
}

interface UserProfileExistsResult {
  exists: boolean
  error: any | null
}

interface SyncResult {
  success: boolean
  action?: string
  data?: any
  error?: string
}

export async function createUserProfile(authUserId: string, userData: UserData = {}): Promise<UserProfileResult> {
  const supabase = await createClient()
  try {
    if (!userData.email) {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(authUserId)
      if (authError) throw authError
      userData.email = authUser.user.email
    }
    const { data, error } = await supabase
      .from('user')
      .insert({
        id: authUserId, 
        username: userData.username || null,
        fullname: userData.fullname || null,
        position: userData.position || null, 
        created_at: new Date().toISOString() 
      })
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserProfile(id: string): Promise<UserProfileResult> {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateUserProfile(id: string, updates: Partial<UserData>): Promise<UserProfileResult> {
  const supabase = await createClient()
  try {
    const allowedFields: Partial<UserData> = {
      username: updates.username,
      fullname: updates.fullname,
      position: updates.position
    }
    const updateData: any = {}
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key as keyof UserData] !== undefined) {
        updateData[key] = allowedFields[key as keyof UserData]
      }
    })
    const { data, error } = await supabase
      .from('user')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getCurrentUserProfile(): Promise<UserProfileResult> {
  const supabase = await createClient()
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { 
        data: null, 
        error: authError || new Error('User not authenticated') 
      }
    }
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', user.id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') {
        const syncResult = await syncAuthUserToPublicUser(user.id)
        if (syncResult.success) {
          return await getUserProfile(user.id)
        }
        return { 
          data: null, 
          error: new Error('Profile not found and sync failed') 
        }
      }
      throw error
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function checkUserProfileExists(userId: string): Promise<UserProfileExistsResult> {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('user')
      .select('id')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') { 
      throw error
    }
    return { exists: !!data, error: null }
  } catch (error) {
    return { exists: false, error }
  }
}

export async function syncAuthUserToPublicUser(id: string): Promise<SyncResult> {
  const supabase = await createClient()
  try {
    const { exists } = await checkUserProfileExists(id)
    if (exists) {
      return { success: true, action: 'already_exists' }
    }
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(id)
    if (authError) {
      throw new Error(`Failed to get auth user: ${authError.message}`)
    }
    if (!authUser.user) {
      throw new Error('Auth user not found')
    }
    const userMetaData = authUser.user.raw_user_meta_data || {}
    const appMetaData = authUser.user.raw_app_meta_data || {}
    const { data, error } = await createUserProfile(id, {
      username: userMetaData.username || userMetaData.user_name || null,
      fullname: userMetaData.fullname || userMetaData.full_name || `${userMetaData.first_name || ''} ${userMetaData.last_name || ''}`.trim() || null,
      position: userMetaData.position || appMetaData.role || null
    })
    if (error) {
      throw error
    }
    return { success: true, action: 'created', data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
