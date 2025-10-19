import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllPatient, CreatePatient } from '@/app/api/user/service/patient_service'

/*
 * @swagger
 * /api/user/patient:
 *   get:
 *     summary: Read All Patients
 *     description: Retrieve all patients from the database
 *     tags:
 *       - Patient
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
 *                       phone:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       gender:
 *                         type: string
 *                       Ethnicity:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 * 
 *   post:
 *     summary: Create a new Patient
 *     description: Create a new patient in the database
 *     tags:
 *       - Patient
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
 *               - Ethnicity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sergio Busquets 
 *               phone:
 *                 type: string
 *                 example: 0555555555
 *               age:
 *                 type: integer
 *                 example: 37
 *               gender:
 *                 type: string
 *                 example: Male
 *               Ethnicity:
 *                 type: string
 *                 example: Spanish
 *     responses:
 *       201:
 *         description: Patient created successfully
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
 *                   example: Patient created successfully
 *                 data:
 *                   type: object
 */

export async function GET(): Promise<NextResponse> {
    try {
        const patients = await GetAllPatient()

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = patients

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching patients:', error)

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
        const { name, phone, age, gender, Ethnicity } = body
        
        if (!name || !phone || !age || !gender || !Ethnicity) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = 'Missing required fields'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const { data, error } = await CreatePatient(body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '201'
        successResponse.message = 'Patient created successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 201 })
    } catch (error) {
        console.error('Error creating patient:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
