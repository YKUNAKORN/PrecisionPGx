import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllReports, CreateReport } from '@/app/api/user/service/report_service'

/**
 * @swagger
 * /api/user/report:
 *   get:
 *     summary: Read All Reports
 *     description: Retrieve all reports from the database
 *     tags:
 *       - Report
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
 * 
 *   post:
 *     summary: Create a new Report
 *     description: Create a new report in the database
 *     tags:
 *       - Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - age
 *               - gender
 *               - Ethnlecity
 *             properties:
 *               specimens_id:
 *                 type: uuid
 *                 example: 4a0b279d-3586-40eb-a94f-187f43bfa3ad
 *               doctor_id:
 *                 type: uuid
 *                 example: e3619073-19b4-41b0-86e1-b8687db24d4b
 *               pharmacist_id:
 *                 type: uuid
 *                 example: 7ced7994-a679-41fa-94ee-244a10813979
 *               patient_id:
 *                 type: uuid
 *                 example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *               note_id:
 *                 type: uuid
 *                 example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *     responses:
 *       201:
 *         description: Report created successfully
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
 *                   example: Report created successfully
 *                 data:
 *                   type: object
 */

export async function GET(): Promise<NextResponse> {
    try {
        const reports = await GetAllReports()

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = reports

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching reports:', error)

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
        const { name, phone, age, gender, Ethnlecity } = body
        
        if (!name || !phone || !age || !gender || !Ethnlecity) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = 'Missing required fields'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const { data, error } = await CreateReport(body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '201'
        successResponse.message = 'Report created successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 201 })
    } catch (error) {
        console.error('Error creating report:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
