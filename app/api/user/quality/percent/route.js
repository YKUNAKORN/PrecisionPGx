import { GetAllQualityMetricsPercent } from "../../service/quality_service";
import { NextResponse } from "next/server";
import { ResponseModel } from "@/lib/model/Response";

/**
 * @swagger
 * /api/user/quality/percent:
 *   get:
 *     summary: Read Quality with percent output
 *     description: Retrieve quality status percentage from the database
 *     tags:
 *       - Quality
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
 */

export async function GET(request) {
    const { data, error } = await GetAllQualityMetricsPercent();
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