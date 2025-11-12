import { GetAllQualityMetricsPercent } from "../../service/quality_service";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
    const { data, error } = await GetAllQualityMetricsPercent();
    if (!data){
        (ResponseModel as any).status = "404";
        (ResponseModel as any).message = "No Quality Metrics Found";
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    if (data.length === 0 || data == null) {
        (ResponseModel as any).status = "404";
        (ResponseModel as any).message = "No Quality Metrics Found";
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    if (error) {
        (ResponseModel as any).status = "500";
        (ResponseModel as any).message = error.message;
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    (ResponseModel as any).status = "200";
    (ResponseModel as any).message = "Quality Metrics Retrieved Successfully";
    (ResponseModel as any).data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}