import { GetAllQualityMetrics, UpdateQualityMetrics, CreateQualityMetricsAndUpdateReport, DeleteQualityMetrics } from "@/app/api/user/service/quality_service";
import { NextResponse } from "next/server";
import { InsertQuality, UpdateQuality } from "@/lib/model/Quality";
import { ResponseModel } from "@/lib/model/Response";

/**
 * @swagger
 * /api/user/quality:
 *   tags: [Quality]
 *   get:
 *     summary: Retrieve all quality metrics
 *     description: Retrieve a list of all quality metrics from the database
 *     tags: [Quality]
 *     responses:
 *       200:
 *         description: A list of quality metrics
 *       404:
 *         description: No quality metrics found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a quality metric
 *     description: Update a specific quality metric in the database
 *     tags: [Quality]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the quality metric to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tester_id:
 *                 type: string
 *               quality:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quality metric updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Quality metric not found
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new quality metric
 *     description: Add a new quality metric to the database
 *     tags: [Quality]
 *     parameters:
 *       - in: query
 *         name: reportId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Optional report ID associated with the quality metric
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tester_id:
 *                 type: string
 *                 example: test-type-123
 *               quality:
 *                 type: string
 *                 example: High
 *     responses:
 *       201:
 *         description: Quality metric created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a quality metric
 *     description: Remove a specific quality metric from the database
 *     tags: [Quality]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the quality metric to delete
 *     responses:
 *       200:
 *         description: Quality metric deleted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Quality metric not found
 *       500:
 *         description: Server error
 */
export async function GET(request) {
    const { data, error } = await GetAllQualityMetrics();
    if (!data){
        ResponseModel.status = "404";
        ResponseModel.message = "No Quality Metrics Found";
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    if (data.length === 0 || data == null) {
        ResponseModel.status = "404";
        ResponseModel.message = "No Quality Metrics Found";
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    if (error) {
        ResponseModel.status = "500";
        ResponseModel.message = error.message;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = "200";
    ResponseModel.message = "Quality Metrics Retrieved Successfully";
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}

export async function PUT(request) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        ResponseModel.status = "400";
        ResponseModel.message = "ID is required for update";
        return NextResponse.json(ResponseModel, { status: 400 });
    }
    try {
        UpdateQuality.id = id;
        UpdateQuality.tester_id = body.tester_id;
        UpdateQuality.quality = body.quality;
    } catch (err) {
        ResponseModel.status = "400";
        ResponseModel.message = "Invalid data format";
        return NextResponse.json(ResponseModel, { status: 400 });
    }
    const { data, error } = await UpdateQualityMetrics(id, UpdateQuality);
    if (error) {
        ResponseModel.status = "500";
        ResponseModel.message = error.message;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = "200";
    ResponseModel.message = "Quality Metrics Updated Successfully";
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}

export async function POST(request) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    try {
        InsertQuality.tester_id = body.tester_id;
        InsertQuality.quality = body.quality;
    } catch (err) {
        ResponseModel.status = "400";
        ResponseModel.message = "Invalid data format";
        return NextResponse.json(ResponseModel, { status: 400 });
    }
    const { data, error } = await CreateQualityMetricsAndUpdateReport(InsertQuality, reportId);
    if (error) {
        ResponseModel.status = "500";
        ResponseModel.message = error.message;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = "201";
    ResponseModel.message = "Quality Metrics Created Successfully";
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 201 });
}


export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        ResponseModel.status = "400";
        ResponseModel.message = "ID is required for deletion";
        return NextResponse.json(ResponseModel, { status: 400 });
    }
    const { data, error } = await DeleteQualityMetrics(id);
    if (error) {
        ResponseModel.status = "500";
        ResponseModel.message = error.message;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = "200";
    ResponseModel.message = "Quality Metrics Deleted Successfully";
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}

