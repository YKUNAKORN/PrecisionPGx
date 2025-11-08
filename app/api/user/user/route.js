import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllUsers } from '@/app/api/user/service/user_service'

/**
 * @swagger
 * /api/user/user:
 *   get:
 *     summary: Read All users
 *     description: Retrieve all users from the database
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Query Successful
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
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                       position:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

export async function GET() {
    try {
        const users = await GetAllUsers()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = users

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching users:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}