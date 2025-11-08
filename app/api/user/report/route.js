import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../lib/model/Response'
import { CreateReport, GetAllReports, UpdateReportByID, DeleteReportByID } from '../service/report_service';
import { ReportModel, ReportUpdate } from '../../../../lib/model/Report';

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
 *   put:
 *     summary: Update a Report by ID
 *     description: Update an existing report in the database
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specimens_id:
 *                 type: string
 *               doctor_id:
 *                 type: string
 *               patient_id:
 *                 type: string
 *               pharm_verify:
 *                 type: string
 *               medtech_verify:
 *                 type: string
 *               note_id:
 *                 type: string
 *               rule_id:
 *                 type: string
 *               more_information:
 *                 type: string
 *               pharmacist_id:
 *                 type: string
 *               medical_technician_id:
 *                 type: string
 *               request_date:
 *                 type: string
 *               report_date:
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
 *               specimens_id:
 *                 type: string
 *               doctor_id:
 *                 type: string
 *               patient_id:
 *                 type: string
 *               pharm_verify:
 *                 type: string
 *               medtech_verify:
 *                 type: string
 *               note_id:
 *                 type: string
 *               rule_id:
 *                 type: string
 *               more_information:
 *                 type: string
 *               pharmacist_id:
 *                 type: string
 *               medical_technician_id:
 *                 type: string
 *               request_date:
 *                 type: string
 *               report_date:
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
    if (!body || !body.specimens_id || !body.patient_id) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    ReportModel.specimens_id = body.specimens_id;
    ReportModel.patient_id = body.patient_id;
    ReportModel.status = 'in progress'
    const { data, error } = await CreateReport(ReportModel)
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


export async function PUT(req) {
    const { searchParams } = new URL(req.url); //querystring
    const id = searchParams.get('id');
    const body = await req.json()
    if (!body || !body.doctor_id || !body.pharm_verify || !body.medtech_verify || !body.note_id || !body.rule_id || !body.index_rule || !body.more_information || !body.pharmacist_id || !body.medical_technician_id || !body.request_date || !body.report_date) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    ReportUpdate.doctor_id = body.doctor_id;
    ReportUpdate.pharm_verify = body.pharm_verify;
    ReportUpdate.medtech_verify = body.medtech_verify;
    ReportUpdate.note_id = body.note_id;
    ReportUpdate.rule_id = body.rule_id;
    ReportUpdate.index_rule = parseInt(body.index_rule); // แปลงเป็น integer
    ReportUpdate.more_information = body.more_information;
    ReportUpdate.pharmacist_id = body.pharmacist_id;
    ReportUpdate.medical_technician_id = body.medical_technician_id;
    ReportUpdate.status = 'finished'
    ReportUpdate.request_date = body.request_date;
    ReportUpdate.report_date = body.report_date;
    ReportUpdate.updated_at = new Date().toISOString();
    console.log(ReportUpdate)
    try {
        const { data, error } = await UpdateReportByID(id, ReportUpdate)
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

// // app/api/user/report/route.ts
// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ฝั่ง server เท่านั้น
// );

// export async function GET() {
//   // FK สมมติชื่อ reports_patient_id_fkey (ดูชื่อจริงใน DB)
//   const { data, error } = await supabase
//     .from("reports")
//     .select(`
//       id,
//       status,
//       patient:patients!reports_patient_id_fkey (
//         Eng_name,
//         eng_name
//       )
//     `)
//     .limit(200);

//   if (error) return NextResponse.json({ error: error.message, data: [] }, { status: 500 });

//   // แปลงชื่อให้ง่ายต่อฝั่ง UI (Eng_name รองรับ 2 สไตล์)
//   const mapped = (data ?? []).map((r) => ({
//     id: r.id,
//     status: r.status,
//     Eng_name: r.patient?.Eng_name ?? r.patient?.eng_name ?? null,
//   }));

//   return NextResponse.json(mapped, { status: 200 });
// }
