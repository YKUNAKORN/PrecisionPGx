import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllSpecimens, CreateSpecimen } from '@/app/api/user/service/specimen_service'

/**
 * @swagger
 * /api/user/specimen:
 *   get:
 *     summary: Read All Specimens
 *     description: Retrieve all specimens from the database
 *     tags:
 *       - Specimen
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
 *                       expire_in:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 * 
 *   post:
 *     summary: Create a new Specimen
 *     description: Create a new specimen in the database
 *     tags:
 *       - Specimen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expire_in
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kevin De Bruyne
 *               expire_in:
 *                 type: string
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Specimen created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "201"
 *                 message:
 *                   type: string
 *                   example: Specimen created successfully
 *                 data:
 *                   type: object
 */

export async function GET(): Promise<NextResponse> {
    try {
        const Specimens = await GetAllSpecimens()

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = Specimens

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching specimen:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const { name, expire_in } = body
        
        if (!name || !expire_in) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = 'Missing required fields'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }
        const { data, error } = await CreateSpecimen(body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '201'
        successResponse.message = 'Specimen created successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 201 })
    } catch (error) {
        console.error('Error creating specimen:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
