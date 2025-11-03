import { ResponseModel } from "../../../../lib/model/Response"
import { NextResponse } from "next/server"
import { QueryRule, InsertRule } from "../service/rule_service"
import { RuleModel } from "../../../../lib/model/Rule"

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
    if (!body || !body.location || !body.result_location || !body.phenotype || !body.predicted_genotype || !body.predicted_phenotype || !body.recommend) {
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null;
        console.error("Invalid Data") //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }) //for User
    }
    RuleModel.location = body.location;
    RuleModel.result_location = body.result_location;
    RuleModel.phenotype = body.phenotype || null; // phenotype added
    RuleModel.predicted_genotype = body.predicted_genotype;
    RuleModel.predicted_phenotype = body.predicted_phenotype;
    RuleModel.recommend = body.recommend;

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

