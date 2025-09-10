import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export async function Logout() {
    try {
        const supabase = createRouteHandlerClient({ cookies })
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