import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetStorageById, UpdateStorage, DeleteStorage } from '@/app/api/user/service/storage_service'

/**
 * @swagger
 * /api/user/storage/{id}:
 *   get:
 *     summary: Read Storage by ID
 *     description: Retrieve a specific storage entry by its ID from the database
 *     tags:
 *       - Storage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the storage
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
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
 *                     patient_id:
 *                       type: string
 *                       format: uuid
 *                     location:
 *                       type: string
 *                     specimen_id:
 *                       type: string
 *                       format: uuid
 *                     collected_at:
 *                       type: string
 *                       format: date-time
 *                     expire_at:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 * 
 *   put:
 *     summary: Update a Storage by ID
 *     description: Update an existing storage entry in the database
 *     tags:
 *       - Storage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the storage
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: string
 *                 format: uuid
 *                 example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *               location:
 *                 type: string
 *                 example: Brighton
 *               specimen_id:
 *                 type: string
 *                 format: uuid
 *                 example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *               status:
 *                 type: string
 *                 example: Premire League
 *     responses:
 *       200:
 *         description: Storage updated successfully
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
 *                   example: Storage updated successfully
 *                 data:
 *                   type: object
 * 
 *   delete:
 *     summary: Delete a Storage by ID
 *     description: Delete an existing storage entry from the database
 *     tags:
 *       - Storage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the storage
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
 *     responses:
 *       200:
 *         description: Storage deleted successfully
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
 *                   example: Storage deleted successfully
 *                 data:
 *                   type: object
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {  
        const { id } = await params
        const storaged = await GetStorageById(id)

        if (!storaged) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '404'
            errorResponse.message = 'Storaged not found'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 404 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = storaged

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching storaged:', error)

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
        const { data, error } = await UpdateStorage(id, body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Storage updated successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error updating storage:', error)

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
        const { data, error } = await DeleteStorage(id)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Storage deleted successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error deleting storage:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
