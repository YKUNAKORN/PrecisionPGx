import { GetNoteById } from '../../service/note_service'
import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../lib/model/Response'; 

/**
 * @swagger
 * /api/user/note/{id}:
 *   get:
 *     summary: Read Note by ID
 *     description: Retrieve a specific note by its ID from the database
 *     tags: [Note]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the note
 *         example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
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
 *                         example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *                       method:
 *                         type: string
 *                         example: 37 Kobbie Mainoo
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-17T14:13:18.592258+00:00
 */

export async function GET(req, { params }) {
    const { id } = await params;
    if (!id) {
      ResponseModel.status = '400';
      ResponseModel.message = 'ID parameter is required';
      ResponseModel.data = null;
      return NextResponse.json(ResponseModel, { status: 400 });
    }
    console.log(id)
    const { data, error } = await GetNoteById(id);
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Note Not Found with ID: ' + id
        ResponseModel.data = null;
        console.error("Note Not Found with ID: " + id) //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Error retrieving note: ' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 }) //for User
    }
    {
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful'
        ResponseModel.data = data[0] // Return only the first item as object, not array
        console.log("Query Successful") //for Debug
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}