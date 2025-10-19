import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    if (code){
        const supabase = await createSupabaseServerClient()
        await supabase.auth.exchangeCodeForSession(code)
    }
    return NextResponse.redirect(requestUrl.origin)
}
