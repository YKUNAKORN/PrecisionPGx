import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetWardById } from '../../service/ward_service'

/**
 * @swagger
 * /api/user/ward/{id}:
 *   get:
 *     summary: Read A ward by ID
 *     description: Retrieve a ward by its ID from the database
 *     tags:
 *       - Ward
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ward to retrieve
 *         schema:
 *           type: string
 *           format: uuid
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

export async function GET(req, { params }) {
    const { id } = await params
    try { 
        const ward = await GetWardById(id)

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = ward

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching wards:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

