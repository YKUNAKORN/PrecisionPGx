import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../lib/model/Response'
import { CreateReport, GetAllReports, UpdateReportByID, DeleteReportByID, EditReportByID } from '../service/report_service';
import { ReportModel, ReportUpdate, CreateReportModel } from '../../../../lib/model/Report';

/**
 * @swagger
 * /api/user/report:
 *   get:
 *     summary: Read Report by ID
 *     description: Retrieve a specific report by its ID from the database
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
 *                   type: object
 * 
 * 
 *   delete:
 *     summary: Delete a Report by ID
 *     description: Delete an existing report from the database
 *     tags:
 *       - Report
 *     parameters:
 *       - in: query
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
 *             properties:
 *               specimens:
 *                 type: string
 *               doctor_id:
 *                 type: string
 *               patient_id:
 *                 type: string
 *               priority:
 *                 type: string
 *               ward_id:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               collected_at:
 *                 type: string
 *               fridge_id:
 *                 type: string
 *               medical_technician_id:
 *                 type: string
 *               note:
 *                 type: string
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


export async function POST(req) {
    const body = await req.json()
    if (!body || !body.specimens || !body.patient_id || !body.priority || !body.doctor_id || !body.ward_id || !body.contact_number || !body.collected_at || !body.fridge_id || !body.medical_technician_id ) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    CreateReportModel.specimens = body.specimens;
    CreateReportModel.patient_id = body.patient_id;
    CreateReportModel.priority =  body.priority;
    CreateReportModel.doctor_id = body.doctor_id;
    CreateReportModel.ward_id = body.ward_id;
    CreateReportModel.contact_number = body.contact_number;
    CreateReportModel.note = body.note;
    CreateReportModel.collected_at = body.collected_at;
    CreateReportModel.fridge_id = body.fridge_id;
    CreateReportModel.medical_technician_id = body.medical_technician_id;
    const { data, error } = await CreateReport(CreateReportModel)
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Created Failed' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    ResponseModel.status = '201';
    ResponseModel.message = 'Created Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 201 })
}

export async function GET() {
    const { data, error } = await GetAllReports();
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'not Found Reports'
        ResponseModel.data = null;
        console.error("Reports Not Found") //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to retrieve reports' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '200';
        ResponseModel.message = 'Query Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}

/**
 * 
 * @swagger
 * /api/user/report:
 *   put:
 *     summary: Update an existing Report by ID
 *     description: Update the details of an existing report in the database
 *     tags:
 *       - Report
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the report to be updated
 *         example: 60b3d5cb-0c24-4bc4-95c2-a733c2b65175
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medtech_verify:
 *                 type: boolean
 *               rule_id:
 *                 type: string
 *                 items:
 *                   type: string
 *               index_rule:
 *                 type: integer
 *               more_information:
 *                 type: string
 *               medical_technician_id:
 *                 type: string
 *               status:
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
 */

export async function PUT(req) {
    const { searchParams } = new URL(req.url); //querystring
    const id = searchParams.get('id');
    const body = await req.json()
    if (!body || !body.medtech_verify  || !body.rule_id || !body.index_rule || !body.more_information || !body.medical_technician_id ) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    ReportUpdate.medtech_verify = body.medtech_verify;
    ReportUpdate.rule_id = body.rule_id;
    ReportUpdate.index_rule = body.index_rule;
    ReportUpdate.more_information = body.more_information;
    ReportUpdate.medical_technician_id = body.medical_technician_id;
    ReportUpdate.status = body.status;
    console.log(ReportUpdate)
    try {
        const { data, error } = await EditReportByID(id, ReportUpdate)
        if (!data || data.length === 0) {
            ResponseModel.status = '404'
            ResponseModel.message = 'Report Not Found with ID: ' + id
            ResponseModel.data = null;
            console.error("Note Not Found with ID: " + id) //for Debug
            return NextResponse.json(ResponseModel, { status: 404 }) //for User
        }
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Update Failed' + error
            ResponseModel.data = null;
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        ResponseModel.status = '200';
        ResponseModel.message = 'Update Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (err) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Update Failed' + err
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID is required';
        ResponseModel.data = null;
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const { data, error } = await DeleteReportByID(id);
    if (error) {
        ResponseModel.status = '500';
        ResponseModel.message = 'Delete Failed' + error;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = '200';
    ResponseModel.message = 'Delete Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}
