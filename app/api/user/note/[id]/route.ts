import { GetNoteById } from '@/app/api/user/service/note_service'
import { NextResponse, type NextRequest } from 'next/server';
import { ResponseModel } from '@/lib/model/Response'; 

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    if (!id) {
      const errorResponse = { ...ResponseModel }
      errorResponse.status = '400';
      errorResponse.message = 'ID parameter is required';
      errorResponse.data = null;
      return NextResponse.json(errorResponse, { status: 400 });
    }
    console.log(id)
    const { data, error } = await GetNoteById(id);
    if (!data || data.length === 0) {
        const errorResponse = { ...ResponseModel }
        errorResponse.status = '404'
        errorResponse.message = 'Note Not Found with ID: ' + id
        errorResponse.data = null;
        console.error("Note Not Found with ID: " + id) //for Debug
        return NextResponse.json(errorResponse, { status: 404 }) //for User
    }
    if (error) {
        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Error retrieving note: ' + error
        errorResponse.data = null;
        return NextResponse.json(errorResponse, { status: 500 }) //for User
    }
    {
        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Query Successful'
        successResponse.data = data[0] // Return only the first item as object, not array
        console.log("Query Successful") //for Debug
        return NextResponse.json(successResponse, { status: 200 }) //for User
    }
}
