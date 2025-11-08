import { NextResponse } from "next/server";
import { ResponseModel } from "@/lib/model/Response";
import { Pharm_verify } from "@/app/api/user/service/report_service";

/**
 * @swagger
 * /api/user/report/verify:
 *   patch:
 *     summary: Verify a report by pharmacist
 *     description: Verify a report by pharmacist using report ID and pharmacist ID
 *     tags:
 *       - Report
 *     parameters:
 *       - in: query
 *         name: report_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the report to be verified
 *       - in: query
 *         name: pharmacist_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the pharmacist verifying the report
 *     responses:
 *       200:
 *         description: Report verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Report verified successfully
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Report not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const report_id = searchParams.get("report_id");
  const pharmacist_id = searchParams.get("pharmacist_id");

  try {
    const result = await Pharm_verify(report_id, pharmacist_id);
    if (result.error) {
      ResponseModel.status = "404";
      ResponseModel.message = "Report not found";
      ResponseModel.data = null;
      return NextResponse.json(ResponseModel, { status: 404 });
    }

    ResponseModel.status = "200";
    ResponseModel.message = "Report verified successfully";
    ResponseModel.data = result.data;
    return NextResponse.json(ResponseModel, { status: 200 });
  } catch (error) {
    console.error("Error verifying report:", error);
    ResponseModel.status = "500";
    ResponseModel.message = "Internal server error";
    ResponseModel.data = null;
    return NextResponse.json(ResponseModel, { status: 500 });
  }
}
