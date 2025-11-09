import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllWards } from '../service/ward_service'

/**
 * @swagger
 * /api/user/ward:
 *   get:
 *     summary: Read All wards
 *     description: Retrieve all wards from the database
 *     tags:
 *       - Ward
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
 *                       name:
 *                         type: string
 *                       number:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

export async function GET() {
    try {
        const wards = await GetAllWards()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = wards

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching wards:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}
