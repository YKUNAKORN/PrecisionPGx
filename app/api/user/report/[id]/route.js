import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../lib/model/Response'
import { GetReportById } from '../../service/report_service';

/**
 * @swagger
 * /api/user/report/{id}:
 *   get:
 *     summary: Read Report by ID
 *     description: Retrieve a specific report from the database by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the report to retrieve
 *         example: 60b3d5cb-0c24-4bc4-95c2-a733c2b65175
 *     tags:
 *       - Report
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
 */

export async function GET(req, { params }) {
    const { id } = params;
    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID parameter is required';
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 });
    }
    console.log(id)
    const { data, error } = await GetReportById(id);
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Report Not Found with ID: ' + id
        ResponseModel.data = null;
        console.error("Reports Not Found with ID: " + id) //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Error retrieving note: ' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful'
        ResponseModel.data = data
        console.error("Query Successful") //for Debug
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}