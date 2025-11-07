import { NextResponse } from 'next/server';
import { ResponseModel } from '@/lib/model/Response';
import { GetAllFridges, UpdateFridge, DeleteFridge, CreateFridge } from '../service/fridge_service';

/**
 * @swagger
 * /api/user/fridge:
 *   get:
 *     summary: Retrieve all fridges
 *     description: Retrieve a list of all fridges from the database
 *     tags:
 *       - Fridge
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
 */

export async function GET() {
    const { data, error } = await GetAllFridges();
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'not Found Fridges'
        ResponseModel.data = null;
        console.error("Fridges Not Found") //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to retrieve fridges' + error
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

/**
 * @swagger
 * /api/user/fridge:
 *   put:
 *     summary: Update a fridge
 *     description: Update a fridge in the database
 *     tags:
 *       - Fridge
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "fridge123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Fridge"
 *               capacity:
 *                 type: string
 *                 example: "100L"
 *               item:
 *                 type: integer
 *                 example: 1
 *               remaining:
 *                 type: integer
 *                 example: 99
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

export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        ResponseModel.status = '400'
        ResponseModel.message = 'ID parameter is required'
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const req = await request.json();
    const { data, error } = await UpdateFridge(id, req);
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



/** 
 * @swagger
 * /api/user/fridge:
 *   delete:
 *     summary: Delete a fridge
 *     description: Delete a fridge from the database
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
 *     responses:
 *       200:
 *         description: Delete Successful
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
 *                   example: Delete Successful
 *                 data:
 *                   type: object
 */
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        ResponseModel.status = '400'
        ResponseModel.message = 'ID parameter is required'
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const { data, error } = await DeleteFridge(id);
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to delete fridge' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '200';
        ResponseModel.message = 'Delete Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}

/**
 * @swagger
 * /api/user/fridge:
 *   post:
 *     summary: Create a new fridge
 *     description: Create a new fridge in the database
 *     tags:
 *       - Fridge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Fridge"
 *               capacity:
 *                 type: integer
 *                 example: "200"
 *               item:
 *                 type: integer
 *                 example: 0
 *               remaining:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Creation Successful
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
 *                   example: Creation Successful
 *                 data:
 *                   type: object
 */

export async function POST(request) {
    const req = await request.json();
    const { data, error } = await CreateFridge(req);
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to create fridge' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '201';
        ResponseModel.message = 'Creation Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 201 }) //for User
    }
}