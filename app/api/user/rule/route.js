import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { QueryRule, InsertRule, UpdateRule, DeleteRule } from '@/app/api/user/service/rule_service'
import { RuleModel } from "@/lib/model/Rule"

/**
 * @swagger
 * /api/user/rule:
 *   get:
 *     summary: Read Rule by ID
 *     description: Retrieve a specific rule by its ID from the database
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: ruleID
 *         required: true
 *         description: The unique identifier of the rule
 *         example: 1861e133-4a57-4dca-bcf6-bfc87f468d99
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: index
 *         required: true
 *         description: The index of the rule details to retrieve
 *         example: 0
 *         schema:
 *           type: integer
 *           format: int32
 *     responses:
 *       200:
 *         description: Query Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     gene_location:
 *                       type: string
 *                     genotype:
 *                       type: string
 *                     phenotype:
 *                       type: string
 *                     active_score:
 *                       type: string
 *                     recommendation:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     enzyme:
 *                       type: string
 * 
 *   put:
 *     summary: Update a Rule by ID
 *     description: Update an existing rule in the database
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: ruleID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the rule
 *         example: 1861e133-4a57-4dca-bcf6-bfc87f468d99
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TPMT*3C"]
 *               result_location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A/A"]
 *               phenotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["IM"]
 *               predicted_genotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["*1/*2"]
 *               predicted_phenotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Phenotype description"]
 *               recommend:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Recommendation description"]
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: Rule updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     gene_location:
 *                       type: string
 *                     genotype:
 *                       type: string
 *                     phenotype:
 *                       type: string
 *                     active_score:
 *                       type: number
 *                     recommendation:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     enzyme:
 *                       type: string
 * 
 *   delete:
 *     summary: Delete a Rule by ID
 *     description: Delete an existing rule from the database
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: ruleID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the rule
 *         example: 1861e133-4a57-4dca-bcf6-bfc87f468d99
 *     responses:
 *       200:
 *         description: Rule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: Rule deleted successfully
 *                 data:
 *                   type: object
 * 
 *   post:
 *     summary: Create a new Rule
 *     description: Create a new rule in the database
 *     tags:
 *       - RuleBased
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TPMT*3C"]
 *               result_location:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A/A"]
 *               phenotype:
 *                 type: string
 *                 example: "IM"
 *               predicted_genotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["*1/*2"]
 *               predicted_phenotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Phenotype description"]
 *               recommend:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Recommendation description"]
 *     responses:
 *       201:
 *         description: Rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "201"
 *                 message:
 *                   type: string
 *                   example: Rule created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     gene_location:
 *                       type: string
 *                     genotype:
 *                       type: string
 *                     phenotype:
 *                       type: string
 *                     active_score:
 *                       type: string
 *                     recommendation:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     enzyme:
 *                       type: string
 */

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

export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    const body = await request.json();
    if (!ruleID || !body || !body.location || !body.result_location || !body.phenotype || !body.predicted_genotype || !body.predicted_phenotype || !body.recommend) {
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