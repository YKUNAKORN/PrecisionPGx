import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'

import { ResetPassword } from '@/app/api/auth/service/password'

/**
 * @swagger
 * /api/auth/resetpassword:
 *   post:
 *     summary: Reset User Password
 *     description: Reset the password of a user using a reset token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully 
 *                data:
 *                  type: object
 */

export async function POST(request) {
    const { email } = await request.json()

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    try {
        const { data, error } = await ResetPassword(email)
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Password reset failed: ' + error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        ResponseModel.status = '200'
        ResponseModel.message = 'Password reset successfully'
        ResponseModel.data = data
        return NextResponse.json(ResponseModel)
    } catch (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Password reset failed: Internal server error: ' + error.message
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}