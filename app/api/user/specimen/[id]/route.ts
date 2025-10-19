import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetSpecimenById, UpdateSpecimen, DeleteSpecimen } from '@/app/api/user/service/specimen_service'

/**
 * @swagger
 * /api/user/specimen/{id}:
 *   get:
 *     summary: Read Specimen by ID
 *     description: Retrieve a specific specimen by its ID from the database
 *     tags:
 *       - Specimen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the specimen
 *         example: 4a0b279d-3586-40eb-a94f-187f43bfa3ad
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     expire_in:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 * 
 *   put:
 *     summary: Update a Specimen by ID
 *     description: Update an existing specimen in the database
 *     tags:
 *       - Specimen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the specimen
 *         example: 4a0b279d-3586-40eb-a94f-187f43bfa3ad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Barcelona Blood
 *               expire_in:
 *                 type: string
 *                 example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Specimen updated successfully
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
 *                   example: Specimen updated successfully
 *                 data:
 *                   type: object
 * 
 *   delete:
 *     summary: Delete a Specimen by ID
 *     description: Delete an existing specimen from the database
 *     tags:
 *       - Specimen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the specimen
 *         example: 4a0b279d-3586-40eb-a94f-187f43bfa3ad
 *     responses:
 *       200:
 *         description: Specimen deleted successfully
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
 *                   example: Specimen deleted successfully
 *                 data:
 *                   type: object
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {  
        const { id } = await params
        const specimen = await GetSpecimenById(id)

        if (!specimen) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '404'
            errorResponse.message = 'Specimen not found'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 404 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = specimen

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdateSpecimen(id, body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Specimen updated successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error updating specimen:', error)

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
        const { data, error } = await DeleteSpecimen(id)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Specimen deleted successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error deleting specimen:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
