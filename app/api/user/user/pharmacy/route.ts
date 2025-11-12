import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetPharmacist } from '@/app/api/user/service/user_service'
/**
 * @swagger
 * /api/user/user/pharmacy:
 *   get:
 *     summary: Read All pharmacists
 *     description: Retrieve all pharmacists from the database
 *     tags:
 *       - User
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
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                       position:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

export async function GET(request: NextRequest) {
  const { data, error } = await GetPharmacist();
  if (error) {
    (ResponseModel as any).status = '500';
    (ResponseModel as any).message = 'Failed to fetch pharmacists: ' + error.message;
    (ResponseModel as any).data = null;
    return NextResponse.json(ResponseModel, { status: 500 });
  }
  (ResponseModel as any).status = '200';
  (ResponseModel as any).message = 'Pharmacists fetched successfully';
  (ResponseModel as any).data = data;
  return NextResponse.json(ResponseModel);
}