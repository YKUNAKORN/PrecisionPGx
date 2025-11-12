import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(req, { params }) {
    try {  
        const { id } = await params
        const specimen = await GetSpecimenById(id);

        if (!specimen) {
            (ResponseModel as any).status = '404';
            (ResponseModel as any).message = 'Specimen not found';
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 404 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Success';
        (ResponseModel as any).data = specimen;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching specimen:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdateSpecimen(id, body);

        if (error) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = error.message;
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Specimen updated successfully';
        (ResponseModel as any).data = data;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error updating specimen:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params
        const { data, error } = await DeleteSpecimen(id);

        if (error) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = error.message;
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Specimen deleted successfully';
        (ResponseModel as any).data = data;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting specimen:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}