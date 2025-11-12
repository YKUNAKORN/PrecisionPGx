import { GetAllReportsDashboard } from "../service/report_service";
import { ResponseModel } from "@/lib/model/Response";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/user/dashboard:
 *   get:
 *     summary: Read report then calculate all type of status
 *     description: Retrieve report status from the database
 *     tags:
 *       - Dashboard
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

export async function GET() {
    const { data, error } = await GetAllReportsDashboard();
    if (!data || data.length === 0) {
        (ResponseModel as any).status = '404';
        (ResponseModel as any).message = 'not Found Reports';
        (ResponseModel as any).data = null;
        console.error("Reports Not Found"); //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }); //for User
    }
    if (error) {
        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Failed to retrieve reports' + error;
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    (ResponseModel as any).status = '200';
    (ResponseModel as any).message = 'Query Successful';
    (ResponseModel as any).data = data;
    return NextResponse.json(ResponseModel, { status: 200 }); //for User
}