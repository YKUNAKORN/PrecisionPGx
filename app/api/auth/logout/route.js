import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import { Logout } from '../service/Logout'
import { deleteToken } from '../../../../lib/auth/jwt'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout User
 *     description: Logout a user and invalidate their session
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Successful login
 *                 data:
 *                   type: object
 */

export async function POST(request) {
    try {
        const tokenCookie = request.cookies.get('token')
        const supabaseAuthToken = request.cookies.get('supabase-auth-token')
        const supabaseRefreshToken = request.cookies.get('supabase-refresh-token')
        const hasTokenBefore = !!tokenCookie?.value
        const hasSupabaseTokens = !!(supabaseAuthToken?.value || supabaseRefreshToken?.value)
        const response = NextResponse.json({ 
            status: '200', 
            message: 'Logout successful',
            data: {
                jwtTokenExistedBefore: hasTokenBefore,
                supabaseTokensExistedBefore: hasSupabaseTokens,
                allTokensDeleted: true,
                timestamp: new Date().toISOString()
            }
        })
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        })
        response.cookies.set('supabase-auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        })
        response.cookies.set('supabase-refresh-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        })
        const logoutResult = await Logout()
        if (logoutResult) {
            console.error("Supabase logout error:", logoutResult)
        }
        deleteToken()
        console.log("Logout completed successfully") // for debug
        console.log("JWT Token existed before logout:", hasTokenBefore) // for debug
        console.log("Supabase tokens existed before logout:", hasSupabaseTokens) // for debug
        console.log("All cookies deleted") // for debug
        return response
    } catch (error) {
        console.error('Logout process failed:', error)
        ResponseModel.status = '500'
        ResponseModel.message = 'Logout failed'
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}
