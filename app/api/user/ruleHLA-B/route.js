import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { QueryRule, QueryAllRules, QueryRuleByRowIndex, InsertRule, UpdateRule, DeleteRule } from '@/app/api/user/service/ruleHLA-B_service'
import { RuleModel } from "@/lib/model/RuleHLA-B"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const ruleID = searchParams.get('ruleID')
    const index = searchParams.get('index')
    console.log("Parameters:", { ruleID, index }) // for Debug

    // CASE 1: No parameters => Get ALL rules
    if (!ruleID && (index === null || index === undefined)) {
        console.log("Case 1: Fetching ALL rules") // for Debug
        const { data, error } = await QueryAllRules()
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Query Failed: ' + error
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        console.log(`Returning ${data.length} rules`) // for Debug
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful - All Rules'
        ResponseModel.data = data
        return NextResponse.json(ResponseModel, { status: 200 })
    }
    // CASE 2: ruleID + index → Get specific 
    if (ruleID && index !== null && index !== undefined) {
        console.log(`Case 2: Fetching rule ${ruleID} at array index ${index}`) // for Debug
        const { data, error } = await QueryRule(ruleID, parseInt(index))
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Query Failed: ' + error
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        if (!data) {
            console.error(`Rule not found: ${ruleID}`) // for Debug
            ResponseModel.status = '404'
            ResponseModel.message = `Rule Not Found with ID: ${ruleID}`
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 404 })
        }
        console.log(`Returning rule ${ruleID} at array index ${index}`) // for Debug
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful - Rule by ID'
        ResponseModel.data = data
        return NextResponse.json(ResponseModel, { status: 200 })
    }
    // CASE 3: Only index => Get rule at row index
    if (!ruleID && index !== null && index !== undefined) {
        const parsedIndex = parseInt(index);
        console.log(`Case 3: Fetching rule at ROW index ${parsedIndex}`) // for Debug
        const { data, error } = await QueryRuleByRowIndex(parsedIndex)
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Query Failed: ' + error
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        if (!data) {
            console.error(`No rule found at row index ${parsedIndex}`) // for Debug
            ResponseModel.status = '404'
            ResponseModel.message = `No rule found at row index: ${parsedIndex}`
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 404 })
        }
        console.log(`Returning rule at row index ${parsedIndex}: ${data.id}`) // for Debug
        ResponseModel.status = '200'
        ResponseModel.message = 'Query Successful - Rule by Index'
        ResponseModel.data = data
        return NextResponse.json(ResponseModel, { status: 200 })
    }
    // CASE 4: ruleID without index → Error
    if (ruleID && (index === null || index === undefined)) {
        console.error("Invalid: ruleID provided without index") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data: index parameter is required when using ruleID'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    // Somethning else
    ResponseModel.status = '400'
    ResponseModel.message = 'Invalid request parameters'
    ResponseModel.data = null
    return NextResponse.json(ResponseModel, { status: 400 })
}   

export async function POST(request) {
    const body = await request.json()
    if (!body || !body.hla_gene || !body.drug || !body.typeof_scar || !body.ethnic_group || !body.odds_score || !body.ref || !body.Name) {
        console.error("Invalid Data - missing required fields") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data - Missing required fields'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    RuleModel.hla_gene = body.hla_gene
    RuleModel.drug = body.drug
    RuleModel.typeof_scar = body.typeof_scar
    RuleModel.ethnic_group = body.ethnic_group
    RuleModel.odds_score = body.odds_score
    RuleModel.ref = body.ref
    RuleModel.Name = body.Name

    const response = await InsertRule(RuleModel)
    if (response.error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Insert Failed: ' + response.error
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    
    console.log("Insert successful:", response.data) // for Debug
    ResponseModel.status = '201'
    ResponseModel.message = 'Insert Successful'
    ResponseModel.data = response.data
    return NextResponse.json(ResponseModel, { status: 201 })
}

export async function PUT(request) {
    const { searchParams } = new URL(request.url)
    const ruleID = searchParams.get('ruleID')
    const body = await request.json()
    if (!ruleID || !body || !body.hla_gene || !body.drug || !body.typeof_scar || !body.ethnic_group || !body.odds_score || !body.ref || !body.Name) {
        console.error("Invalid Data - missing ruleID or required fields") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data - Missing ruleID or required fields'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    RuleModel.hla_gene = body.hla_gene
    RuleModel.drug = body.drug
    RuleModel.typeof_scar = body.typeof_scar
    RuleModel.ethnic_group = body.ethnic_group
    RuleModel.odds_score = body.odds_score
    RuleModel.ref = body.ref
    RuleModel.Name = body.Name

    const response = await UpdateRule(ruleID, RuleModel)
    if (response.error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Update Failed: ' + response.error
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    
    console.log("Update successful:", response.data) // for Debug
    ResponseModel.status = '200'
    ResponseModel.message = 'Update Successful'
    ResponseModel.data = response.data
    return NextResponse.json(ResponseModel, { status: 200 })
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url) 
    const ruleID = searchParams.get('ruleID')
    
    if (!ruleID) {
        console.error("Invalid Data - missing ruleID") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data - Missing ruleID'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    
    const { data, error } = await DeleteRule(ruleID);
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Delete Failed: ' + error
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    
    console.log("Delete successful for ID:", ruleID) // for Debug
    ResponseModel.status = '200'
    ResponseModel.message = 'Delete Successful'
    ResponseModel.data = data
    return NextResponse.json(ResponseModel, { status: 200 })
}