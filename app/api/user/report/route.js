import { NextResponse } from 'next/server'
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

export async function GET() {
    try {
        const reports = await GetAllReports()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = reports

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching reports:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { name, phone, age, gender, Ethnlecity } = body
        
        if (!name || !phone || !age || !gender || !Ethnlecity) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Missing required fields'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        const { data, error } = await CreateReport(body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '201'
        ResponseModel.message = 'Report created successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 201 })
    } catch (error) {
        console.error('Error creating report:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}