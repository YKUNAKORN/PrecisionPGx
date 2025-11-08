import { NextResponse } from 'next/server'
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
 *               - patient_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kevin De Bruyne
 *               expire_in:
 *                 type: integer
 *                 example: 7
 *               patient_id:
 *                 type: string
 *                 format: uuid
 *                 example: "60b3d5cb-0c24-4bc4-95c2-a733c2b65175"
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

export async function GET() {
    try {
        const Specimens = await GetAllSpecimens()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = Specimens

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching specimen:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function POST(req) {
    const body = await req.json()
    try {
        
        if (!body.name || !body.patient_id) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Missing required fields'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }
        const { data, error } = await CreateSpecimen(body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '201'
        ResponseModel.message = 'Specimen created successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 201 })
    } catch (error) {
        console.error('Error creating specimen:', error)
        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}