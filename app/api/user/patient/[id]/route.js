import { NextResponse } from 'next/server'
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

export async function GET(req, { params }) {
    try {  
        const { id } = await params
        const patient = await GetPatientById(id)

        if (!patient) {
            ResponseModel.status = '404'
            ResponseModel.message = 'Patient not found'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 404 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = patient

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdatePatient(id, body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Patient updated successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error updating patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params
        const { data, error } = await DeletePatient(id)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Patient deleted successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error deleting patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}