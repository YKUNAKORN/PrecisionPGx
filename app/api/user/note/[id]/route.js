import { GetNoteById } from '../../service/note_service'
import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../../lib/models/response'; 


export async function GET(request, { params }) {
    const {id} = params
    const notes = await GetNoteById(id);
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