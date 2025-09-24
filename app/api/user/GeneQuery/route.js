import { NextResponse } from "next/server";
import { getRuleBaseByEnzymeAndGene } from "../service/rulebase_service";
import { ResponseModel } from "../../../../lib/model/Response";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const enzyme = searchParams.get('enzyme');
    const geneParam = searchParams.get('gene'); //"C/T/A/A"
    const gene = geneParam ? geneParam.split('/') : null; //["C", "T", "A", "A"]
    console.log("enzyme:", enzyme);
    console.log("gene raw:", gene);
    if (!enzyme) {
        ResponseModel.status = '400';
        ResponseModel.message = 'enzyme parameter is required';
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 });
    } else if (!gene) {
        ResponseModel.status = '400';
        ResponseModel.message = 'gene parameter is required';
        ResponseModel.data = null;
        return NextResponse.json(ResponseModel, { status: 400 });
    }

    const { data, error } = await getRuleBaseByEnzymeAndGene(enzyme, gene);
    if (!data || data.length === 0) {
        ResponseModel.status = '404'
        ResponseModel.message = 'Data Not Found with enzyme: ' + enzyme + " and gene: " + gene
        ResponseModel.data = null;
        console.error('Data Not Found with enzyme: ' + enzyme + " and gene: " + gene) //for Debug
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
