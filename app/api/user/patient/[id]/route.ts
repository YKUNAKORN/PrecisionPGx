import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetPatientById, UpdatePatient, DeletePatient } from '@/app/api/user/service/patient_service'

/**
 * @swagger
 * /api/user/patient/{id}:
 *   get:
 *     summary: Read Patient by ID
 *     description: Retrieve a specific patient by its ID from the database
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the patient
 *         example: e7cfa90c-bd77-4721-b902-e01c80c86b06
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
 *                   example: Patient updated successfully
 *                 data:
 *                   type: object
 * 
 *   put:
 *     summary: Update a Patient by ID
 *     description: Update an existing patient in the database
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the patient
 *         example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sergio Ramos
 *               phone:
 *                 type: string
 *                 example: "0444444444"
 *               age:
 *                 type: integer
 *                 example: 39
 *               gender:
 *                 type: string
 *                 example: Male
 *               Ethnicity:
 *                 type: string
 *                 example: Spanish
 *     responses:
 *       200:
 *         description: Patient updated successfully
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
 *                   example: Patient updated successfully
 *                 data:
 *                   type: object
 * 
 *   delete:
 *     summary: Delete a Patient by ID
 *     description: Delete an existing patient from the database
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the patient
 *         example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *     responses:
 *       200:
 *         description: Patient deleted successfully
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
 *                   example: Patient deleted successfully
 *                 data:
 *                   type: object
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {  
        const { id } = await params
        const patient = await GetPatientById(id)

        if (!patient) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '404'
            errorResponse.message = 'Patient not found'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 404 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = patient

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching patient:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdatePatient(id, body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Patient updated successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error updating patient:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const { data, error } = await DeletePatient(id)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Patient deleted successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error deleting patient:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
