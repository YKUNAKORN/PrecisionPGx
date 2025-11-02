import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllPatient, CreatePatient } from '@/app/api/user/service//patient_service'

/**
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

export async function GET() {
    try {
        const patients = await GetAllPatient()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = patients

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching patients:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { phone, age, gender, Ethnicity, Eng_name, Thai_name, dob, email, address } = body
        
        if (!phone || !age || !gender || !Ethnicity || !Eng_name || !Thai_name || !dob || !email || !address) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Missing required fields'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        const { data, error } = await CreatePatient(body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '201'
        ResponseModel.message = 'Patient created successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 201 })
    } catch (error) {
        console.error('Error creating patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}