import { GetAllReportsDashboard } from "../service/report_service";
import { ResponseModel } from "@/lib/model/Response";
import { NextResponse } from "next/server";

export async function GET() {
    const { data, error } = await GetAllReportsDashboard();
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'not Found Reports'
        ResponseModel.data = null;
        console.error("Reports Not Found") //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Failed to retrieve reports' + error
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