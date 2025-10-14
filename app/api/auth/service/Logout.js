import { createSupabaseServerClient } from '../../../../lib/supabase/server'

export async function Logout() {
    try {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.auth.signOut({ scope: 'global' })
        if (error) {
            console.error('Error during Supabase logout:', error.message)
            return error
        }
        console.log('Supabase logout successful')
        return null
    } catch (error) {
        console.error('Logout error:', error)
        return error
    }
}