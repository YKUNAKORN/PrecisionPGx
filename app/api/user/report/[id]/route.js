import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../lib/model/Response'
import { GetReportById } from '../../service/report_service';

/**
 * @swagger
 * /api/user/report:
 *   get:
 *     summary: Read All Reports
 *     description: Retrieve all reports from the database
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
 * 
 *   post:
 *     summary: Create a new Report
 *     description: Create a new report in the database
 *     tags:
 *       - Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - age
 *               - gender
 *               - Ethnlecity
 *             properties:
 *               specimens_id:
 *                 type: uuid
 *                 example: 4a0b279d-3586-40eb-a94f-187f43bfa3ad
 *               doctor_id:
 *                 type: uuid
 *                 example: e3619073-19b4-41b0-86e1-b8687db24d4b
 *               pharmacist_id:
 *                 type: uuid
 *                 example: 7ced7994-a679-41fa-94ee-244a10813979
 *               patient_id:
 *                 type: uuid
 *                 example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *               note_id:
 *                 type: uuid
 *                 example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *     responses:
 *       201:
 *         description: Report created successfully
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
 *                   example: Report created successfully
 *                 data:
 *                   type: object
 */

export async function GET(req, { params }) {
    const { id } = await params;
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
        ResponseModel.message = 'Note Not Found with ID: ' + id
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