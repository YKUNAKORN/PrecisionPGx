import { NextResponse } from "next/server";
import { CreateNote, GetAllNotes, UpdateNoteByID, DeleteNoteByID } from "../service/note_service";
import { ResponseModel } from "../../../../lib/model/Response";


export async function POST(req) {
    const row = await req.json()
    if (!row.method) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const response = await CreateNote(row)
    {
        ResponseModel.status = '201'
        ResponseModel.message = 'Created Successful'
        ResponseModel.data = response
        return NextResponse.json(ResponseModel, { status: 201 })
    }
}

export async function GET() {
    const notes = await GetAllNotes();
    if (!notes) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Data Not Found'
        console.error("Data Not Found Endpoint") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    {
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful'
        console.error("Query Successful") //for Debug
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const row = await req.json();
    if (!id) {
        ResponseModel.status = '400';
        ResponseModel.message = 'ID is required';
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try{
        const response = await UpdateNoteByID(id, row)
        ResponseModel.status = '200'
        ResponseModel.message = 'Update Successful'
        ResponseModel.data = response
        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (err) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Update Failed' + err
        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function Delete(req) {
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

    const response = await DeleteNoteByID(id);
    ResponseModel.status = '200';
    ResponseModel.message = 'Delete Successful';
    ResponseModel.data = response;
    return NextResponse.json(ResponseModel, { status: 200 });
}