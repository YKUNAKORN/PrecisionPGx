import { NextRequest, NextResponse } from 'next/server';
import { ResponseModel } from '@/lib/model/Response'
import { UpdateStatusReportById } from '../../service/report_service';

/**
 * @swagger
 * /api/user/report/finish:
 *   put:
 *     summary: Update report status to completed
 *     description: Update the status of a specific report to completed in the database
 *     tags: [Report]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the report to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the report
 *     responses:
 *       200:
 *         description: Report status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */

export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url); //querystring
    const id = searchParams.get('id');
    const body = await req.json();
    const { data, error } = await UpdateStatusReportById(id, body);

    if (data.length === 0) {
        (ResponseModel as any).status = '404';
        (ResponseModel as any).message = 'Report Not Found';
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    if (error) {
        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = error.message;
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    (ResponseModel as any).status = '200';
    (ResponseModel as any).message = 'Report Status Updated Successfully';
    (ResponseModel as any).data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}