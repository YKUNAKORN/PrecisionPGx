import { NextResponse } from "next/server";
import { CreateNote, GetAllNotes, UpdateNoteByID, DeleteNoteByID } from "../service/note_service";
import { ResponseModel } from "../../../../lib/model/Response";
import { UpdateNote } from "../../../../lib/model/Note";

/**
 * @swagger
 * /api/user/note:
 *   get:
 *     summary: Read All Notes
 *     description: Retrieve all notes from the database
 *     tags:
 *       - Note
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
 * 
 *   post:
 *     summary: Create a new Note
 *     description: Create a new note in the database
 *     tags:
 *       - Note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 example: 37 Kobbie Mainoo
 *                 description: Note content or method description
 *     responses:
 *       201:
 *         description: Note created successfully
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
 *                   example: Created Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       method:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       
 *   put:
 *     summary: Update a Note by ID
 *     description: Update an existing note using query parameter
 *     tags:
 *       - Note
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the note to update
 *         example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 example: 1 David De Gea
 *                 description: Updated note content or method description
 *     responses:
 *       200:
 *         description: Note updated successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       method:
 *                         type: string
 *                         example: 1 David De Gea
 *                       created_at:
 *                         type: string
 *                         format: date-time
 * 
 *   delete:
 *     summary: Delete a Note by ID
 *     description: Delete an existing note using query parameter
 *     tags:
 *       - Note
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the note to delete
 *         example: c39ba4bb-e684-4b52-a66e-9084f9ef4c3e
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       method:
 *                         type: string
 *                         example: 1 David De Gea
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

export async function POST(req) {
    const row = await req.json()
    if (!row.method) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const { data, error } = await CreateNote(row)
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Created Failed' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    ResponseModel.status = '201';
    ResponseModel.message = 'Created Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 201 })
}

export async function GET() {
    const { data, error } = await GetAllNotes();
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Note Not Found with ID: ' + id
        ResponseModel.data = null;
        console.error("Note Not Found with ID: " + id) //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to retrieve notes' + error
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

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const row = await req.json();
    UpdateNote.method = row.method
    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID is required';
        ResponseModel.data = null;
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const { data, error } = await UpdateNoteByID(id, UpdateNote)
        if (!data || data.length === 0) {
            ResponseModel.status = '404'
            ResponseModel.message = 'Note Not Found with ID: ' + id
            ResponseModel.data = null;
            console.error("Note Not Found with ID: " + id) //for Debug
            return NextResponse.json(ResponseModel, { status: 404 }) //for User
        }
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Update Failed' + error
            ResponseModel.data = null;
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        ResponseModel.status = '200';
        ResponseModel.message = 'Update Successful';
        ResponseModel.data = data;
        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (err) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Update Failed' + err
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID is required';
        ResponseModel.data = null;
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await DeleteNoteByID(id);
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Note Not Found with ID: ' + id
        ResponseModel.data = null;
        console.error("Note Not Found with ID: " + id) //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500';
        ResponseModel.message = 'Delete Failed' + error;
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = '200';
    ResponseModel.message = 'Delete Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}