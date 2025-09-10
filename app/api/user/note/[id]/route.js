import { GetNoteById } from '../../service/note_service'
import { NextResponse } from 'next/server';
import { ResponseModel } from '../../../../../lib/model/Response'; 


export async function GET(req,{ params }) {
    const { id } = await params;
    if (!id) {
      ResponseModel.status = '400';
      ResponseModel.message = 'ID parameter is required';
      return NextResponse.json(ResponseModel, { status: 400 });
    }
    console.log(id)
    const { data, error } = await GetNoteById(id);
    if (error) {
        
        ResponseModel.status = '500'
        ResponseModel.message = 'Error retrieving note' + error
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