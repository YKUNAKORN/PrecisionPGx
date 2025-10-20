import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllStorages, CreateStorage } from '@/app/api/user/service/storage_service'

/**
 * @swagger
 * /api/user/storage:
 *   get:
 *     summary: Read All Storages
 *     description: Retrieve all storages from the database
 *     tags:
 *       - Storage
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     patient_id:
 *                       type: string
 *                       format: uuid
 *                     location:
 *                       type: string
 *                     specimen_id:
 *                       type: string
 *                       format: uuid
 *                     collected_at:
 *                       type: string
 *                       format: date-time
 *                     expire_at:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 * 
 *   post:
 *     summary: Create a new Storage
 *     description: Create a new storage entry in the database
 *     tags:
 *       - Storage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - location
 *               - specimen_id
 *               - status
 *             properties:
 *               patient_id:
 *                 type: string
 *                 format: uuid
 *                 example: e7cfa90c-bd77-4721-b902-e01c80c86b06
 *               location:
 *                 type: string
 *                 example: Birmingham
 *               specimen_id:
 *                 type: string
 *                 format: uuid
 *                 example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *               status:
 *                 type: string
 *                 example: Stored
 *     responses:
 *       201:
 *         description: Storage created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "201"
 *                 message:
 *                   type: string
 *                   example: Storage created successfully
 *                 data:
 *                   type: object
 */

export async function GET() {
    try {
        const storages = await GetAllStorages()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = storages

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching storages:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { patient_id, location, specimen_id, status } = body
        
        if (!patient_id || !location || !specimen_id || !status) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Missing required fields'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        const { data, error } = await CreateStorage(body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '201'
        ResponseModel.message = 'Storage created successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 201 })
    } catch (error) {
        console.error('Error creating storage:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}