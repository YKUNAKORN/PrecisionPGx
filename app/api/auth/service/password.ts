import { CreateClientSecret } from '@/lib/supabase/client'

const supabase = CreateClientSecret()

export async function ResetPassword(email: string): Promise<void> {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
    })
}
export async function ChangePassword(newPassword: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.auth.updateUser({password: newPassword})
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}