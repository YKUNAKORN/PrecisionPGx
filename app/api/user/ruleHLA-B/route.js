import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { QueryRule, InsertRule, UpdateRule, DeleteRule } from '@/app/api/user/service/ruleHLA-B_service'
import { RuleModel } from "@/lib/model/RuleHLA-B"

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    const index = searchParams.get('index');
    console.log("ruleID:", ruleID, "index:", index); // Debug log

    if (!ruleID || index === null) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    
    const { data, error } = await QueryRule(ruleID, parseInt(index));
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Query Failed: ' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    if (!data) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Rule Not Found with ID: ' + ruleID
        ResponseModel.data = null;
        console.error("Rule Not Found with ID: " + ruleID) //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }) //for User
    }
    ResponseModel.status = '200';
    ResponseModel.message = 'Query Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 })
}   

export async function POST(request) {
    const body = await request.json();
    if (!body || !body.hla_gene || !body.drug || !body.typeof_scar || !body.ethnic_group || !body.odds_score || !body.ref) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    RuleModel.hla_gene = body.hla_gene;
    RuleModel.drug = body.drug;
    RuleModel.typeof_scar = body.typeof_scar;
    RuleModel.ethnic_group = body.ethnic_group;
    RuleModel.odds_score = body.odds_score;
    RuleModel.ref = body.ref;

    const response = await InsertRule(RuleModel);
    if (response.error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Insert Failed' + response.error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    console.log("Insert successful:", response.data); // Debug log
    ResponseModel.status = '201';
    ResponseModel.message = 'Insert Successful';
    ResponseModel.data = response.data;
    return NextResponse.json(ResponseModel, { status: 201 })
}

export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    const body = await request.json();
    if (!ruleID || !body || !body.hla_gene || !body.drug || !body.typeof_scar || !body.ethnic_group || !body.odds_score || !body.ref) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    RuleModel.hla_gene = body.hla_gene;
    RuleModel.drug = body.drug;
    RuleModel.typeof_scar = body.typeof_scar;
    RuleModel.ethnic_group = body.ethnic_group;
    RuleModel.odds_score = body.odds_score;
    RuleModel.ref = body.ref;

    const response = await UpdateRule(ruleID, RuleModel);
    if (response.error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Update Failed' + response.error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    console.log("Update successful:", response.data); // Debug log
    ResponseModel.status = '200';
    ResponseModel.message = 'Update Successful';
    ResponseModel.data = response.data;
    return NextResponse.json(ResponseModel, { status: 200 })
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    if (!ruleID) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    const { data, error } = await DeleteRule(ruleID);
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Delete Failed: ' + error
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    console.log("Delete successful for ID:", ruleID); // Debug log
    ResponseModel.status = '200';
    ResponseModel.message = 'Delete Successful';
    ResponseModel.data = data;
    return NextResponse.json(ResponseModel, { status: 200 })
}