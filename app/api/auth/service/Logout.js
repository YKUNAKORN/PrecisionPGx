import { createSupabaseServerClient } from '../../../../lib/supabase/server'

export async function Logout() {
    try {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Error during logout:', error.message)
            return error
        }
        return null
    } catch (error) {
        console.error('Logout error:', error)
        return error
    }
}