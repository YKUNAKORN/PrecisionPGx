import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetUserById, UpdateUser, DeleteUser } from '@/app/api/user/service/user_service'

/**
 * @swagger
 * /api/user/user/{id}:
 *   get:
 *     summary: Read User by ID
 *     description: Retrieve a specific user entry by its ID from the database
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the user
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
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
 *                     email:
 *                       type: string
 *                     position:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 * 
 *   put:
 *     summary: Update a User by ID
 *     description: Update an existing user entry in the database
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the user
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane.smith@example.com
 *               position:
 *                 type: string
 *                 example: Pharmacist
 *               fullname:
 *                 type: string
 *                 example: Jane Smith
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 * 
 *   delete:
 *     summary: Delete a User by ID
 *     description: Delete an existing user entry from the database
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the User
 *         example: ed59ecb5-28b7-4424-a413-2635e540aac6
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *                 data:
 *                   type: object
 */

export async function GET(req, { params }) {
    try {  
        const { id } = await params
        const user = await GetUserById(id);

        if (!user) {
            (ResponseModel as any).status = '404';
            (ResponseModel as any).message = 'User not found';
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 404 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Success';
        (ResponseModel as any).data = user;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdateUser(id, body);
        if (error) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = error.message;
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'User updated successfully';
        (ResponseModel as any).data = data;
        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error updating user:', error); 
        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params
        const { data, error } = await DeleteUser(id);

        if (error) {
            (ResponseModel as any).status = '400';
            (ResponseModel as any).message = error.message;
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 400 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'User deleted successfully';
        (ResponseModel as any).data = data;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting user:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}