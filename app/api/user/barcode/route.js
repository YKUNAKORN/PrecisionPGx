import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GenerateBarcode } from '@/app/api/user/service/barcode_service'
import { GetPatientById } from '@/app/api/user/service/patient_service'

/**
 * @swagger
 * /api/barcode:
 *   get:
 *     summary: Get Barcode by Patient ID
 *     description: Generate and retrieve a barcode image for a specific patient
 *     tags:
 *       - Barcode
 *     parameters:
 *       - in: query
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Patient ID from database
 *         example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *     responses:
 *       200:
 *         description: Barcode generated successfully
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
 *                   example: Barcode generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     patientId:
 *                       type: string
 *                       format: uuid
 *                       example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *                     base64:
 *                       type: string
 *                       description: Base64 encoded barcode image
 *                       example: iVBORw0KGgoAAAANSUhEUgAA...
 */

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const patientId = searchParams.get('patientId')

        if (!patientId) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Patient ID is required'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        // Verify patient exists in database
        const patient = await GetPatientById(patientId)
        
        if (!patient || patient.length === 0) {
            ResponseModel.status = '404'
            ResponseModel.message = 'Patient not found with ID: ' + patientId
            ResponseModel.data = null
            console.error('Patient not found with ID: ' + patientId)
            return NextResponse.json(ResponseModel, { status: 404 })
        }

        // Generate barcode using patient ID
        const options = {
            text: patientId,
            bcid: 'code128',
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
            textsize: 10,
        }

        const { data, error } = await GenerateBarcode(options)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message || 'Failed to generate barcode'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Barcode generated successfully'
        ResponseModel.data = { 
            patientId: patientId,
            base64: data 
        }

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error generating barcode:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}
