import { NextResponse } from 'next/server';
import { ResponseModel } from '@/lib/model/Response';
import { IncreaseFridgeItem } from '../../service/fridge_service';

/**
 * @swagger
 * /api/user/fridge/add:
 *   patch:
 *     summary: Updated a fridge remaining item
 *     description: Increase a fridge remaining item in the database
 *     tags:
 *       - Fridge
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "28b382bc-3bdc-4fc4-8343-c93f7f7c1bb3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Update Successful
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
 *                   example: Update Successful
 *                 data:
 *                   type: object
 */
export async function PATCH(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log(id)
    if (!id) {
        ResponseModel.status = '400'
        ResponseModel.message = 'ID parameter is required'
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const req = await request.json();
    if (!req.item) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Item parameter is required'
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const { data, error } = await IncreaseFridgeItem(id, req);
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to update fridge' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '200';
        ResponseModel.message = 'Update Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}