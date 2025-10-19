import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetReportById, UpdateReport, DeleteReport } from '@/app/api/user/service/report_service'

/**
 * @swagger
 * /api/user/report/{id}:
 *   get:
 *     summary: Read Report by ID
 *     description: Retrieve a specific report by its ID from the database
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the report
 *         example: 60b3d5cb-0c24-4bc4-95c2-a733c2b65175
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
 * 
 *   put:
 *     summary: Update a Report by ID
 *     description: Update an existing report in the database
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the report
 *         example: 60b3d5cb-0c24-4bc4-95c2-a733c2b65175
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               Ethnlecity:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
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
 *                   example: Report updated successfully
 *                 data:
 *                   type: object
 * 
 *   delete:
 *     summary: Delete a Report by ID
 *     description: Delete an existing report from the database
 *     tags:
 *       - Report
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the report
 *         example: 60b3d5cb-0c24-4bc4-95c2-a733c2b65175
 *     responses:
 *       200:
 *         description: Report deleted successfully
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
 *                   example: Report deleted successfully
 *                 data:
 *                   type: object
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {  
        const { id } = await params
        const report = await GetReportById(id)

        if (!report) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '404'
            errorResponse.message = 'Report not found'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 404 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = report

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching report:', error)

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
        const { data, error } = await UpdateReport(id, body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Report updated successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error updating report:', error)

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
        const { data, error } = await DeleteReport(id)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Report deleted successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error deleting report:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
