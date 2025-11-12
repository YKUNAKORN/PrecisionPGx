import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { CalculateFridge } from '../../service/fridge_service'

/**
 * @swagger
 * /api/user/storage/calculate:
 *   get:
 *     summary: Calculate storage usage
 *     description: Calculate the storage usage based on current data
 *     tags:
 *       - Storage
 *     responses:
 *       200:
 *         description: Calculation Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 PercentRemaining:
 *                   type: number
 *                   format: float
 *                   description: The percentage of remaining storage capacity
 *                   example: 75.5
 */
export async function GET() {
    const { data, error } = await CalculateFridge();
    if (error) {
        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Failed to calculate storage usage' + error;
        (ResponseModel as any).data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) ; //for User
    }
    (ResponseModel as any).status = '200';
    (ResponseModel as any).message = 'Calculation Successful';
    (ResponseModel as any).data = data;
    return NextResponse.json(ResponseModel, { status: 200 }); //for User
}