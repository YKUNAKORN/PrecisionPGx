import { NextResponse } from "next/server";
import { CreateNote, GetAllNotes, UpdateNoteByID, DeleteNoteByID } from "../service/note_service";
import { ResponseModel } from "../../../../lib/model/Response";
import { Note } from "../../../../lib/model/Note";


export async function POST(req) {
    const row = await req.json()
    if (!row.method) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const { data, error } = await CreateNote(row)
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Created Failed' + error
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    ResponseModel.status = '201';
    ResponseModel.message = 'Created Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 201 })
}

export async function GET() {
    const { data, error } = await GetAllNotes();
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to retrieve notes' + error
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
    Note.method = row.method
    Note.id = id
    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID is required';
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try{
        const { data, error } = await UpdateNoteByID(id, Note)
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Update Failed' + error
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
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await DeleteNoteByID(id);
    if (error) {
        ResponseModel.status = '500';
        ResponseModel.message = 'Delete Failed' + error;
        return NextResponse.json(ResponseModel, { status: 500 });
    }
    ResponseModel.status = '200';
    ResponseModel.message = 'Delete Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 });
}