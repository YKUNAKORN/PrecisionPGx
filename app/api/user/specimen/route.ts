import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllSpecimens, CreateSpecimen } from '@/app/api/user/service/specimen_service'

/**
 * @swagger
 * /api/user/specimen:
 *   get:
 *     summary: Read All Specimens
 *     description: Retrieve all specimens from the database
 *     tags:
 *       - Specimen
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
 *                       expire_in:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 * 
 *   post:
 *     summary: Create a new Specimen
 *     description: Create a new specimen in the database
 *     tags:
 *       - Specimen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expire_in
 *               - patient_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: blood
 *               expire_in:
 *                 type: integer
 *                 example: 9
 *               patient_id:
 *                 type: string
 *                 format: uuid
 *                 example: "2a4c77f1-c6e8-4b85-bd7e-152d88666b63"
 *     responses:
 *       201:
 *         description: Specimen created successfully
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
 *                   example: Specimen created successfully
 *                 data:
 *                   type: object
 */

export async function GET() {
    try {
        const Specimens = await GetAllSpecimens();

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Success';
        (ResponseModel as any).data = Specimens;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching specimen:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, expire_in, patient_id} = body
        if (!name || !expire_in || !patient_id) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = 'Missing required fields';
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }
        const { data, error } = await CreateSpecimen(body);

        if (error) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = error.message;
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }

        (ResponseModel as any).status = '201';
        (ResponseModel as any).message = 'Specimen created successfully';
        (ResponseModel as any).data = data;

        return NextResponse.json(ResponseModel, { status: 201 });
    } catch (error: any) {
        console.error('Error creating specimen:', error);
        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}