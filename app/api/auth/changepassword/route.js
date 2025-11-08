import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'

import { ChangePassword } from '@/app/api/auth/service/password'

/**
 * @swagger
 * /api/auth/changepassword:
 *   post:
 *     summary: Change User Password
 *     description: Change the password of the authenticated user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 data:
 *                   type: object
 */

export async function POST(request) {
    const { newPassword, confirmPassword } = await request.json()

    if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: 'New password and confirm password are required' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    try {
        const { data, error } = await ChangePassword(newPassword)
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Password change failed: ' + error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        ResponseModel.status = '200'
        ResponseModel.message = 'Password changed successfully'
        ResponseModel.data = data
        return NextResponse.json(ResponseModel)
    } catch (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Password change failed: Internal server error: ' + error.message
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}