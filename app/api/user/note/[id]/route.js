import { GetNoteById } from '../../service/note_service'
import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../lib/model/Response'; 


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
        ResponseModel.data = data
        console.error("Query Successful") //for Debug
        return NextResponse.json(ResponseModel, { status: 200 }) //for User
    }
}