import { GetQualityById } from "../../service/quality_service";
import { NextResponse } from "next/server";
import { ResponseModel } from "@/lib/model/Response";

/**
 * @swagger
 * /api/user/quality/{id}:
 *   tags: [Quality]
 *   get:
 *     summary: Read Quality Metric by ID
 *     description: Retrieve a specific quality metric by its ID from the database
 *     tags: [Quality]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the quality metric
 *         example: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
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
 *                   example: Query Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
 *                       test_type_id:
 *                         type: string
 *                         example: test-type-123
 *                       test_type_name:
 *                         type: string
 *                         example: Blood Test
 *                       quality:
 *                         type: string
 *                         example: High
 */
export async function GET(request , { params }) {
    const { id } = await params;
    if (!id) {
      ResponseModel.status = '400';
      ResponseModel.message = 'ID parameter is required';
      ResponseModel.data = null;
      return NextResponse.json(ResponseModel, { status: 400 });
    }
    const { data, error } = await GetQualityById(id);
    if (error) {
        ResponseModel.status = "500";
        ResponseModel.message = error.message;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    if (!data) {
        ResponseModel.status = "404";
        ResponseModel.message = "Quality Metric Not Found";
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    ResponseModel.status = "200";
    ResponseModel.message = "Quality Metric Retrieved Successfully";
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}