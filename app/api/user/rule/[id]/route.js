import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { QueryRule, UpdateRule, DeleteRule } from '@/app/api/user/service/rule_service'
import { RuleModel } from "@/lib/model/Rule"

/**
 * @swagger
 * /api/user/rule/{id}:
 *   get:
 *     summary: Read Rule by ID with Array Index (Dynamic Route)
 *     description: Retrieve a specific element from a rule's arrays using the rule ID from URL path and array index from query parameter
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier (UUID) of the rule
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: index
 *         required: true
 *         description: The array index to retrieve from the rule's data arrays (0-based)
 *         example: 0
 *         schema:
 *           type: integer
 *           minimum: 0
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
 *                   example: "Query Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     location:
 *                       type: array
 *                       items:
 *                         type: string
 *                     result_location:
 *                       type: array
 *                       items:
 *                         type: string
 *                     predicted_genotype:
 *                       type: string
 *                     predicted_phenotype:
 *                       type: string
 *                     recommendation:
 *                       type: string
 *                     phenotype:
 *                       oneOf:
 *                         - type: array
 *                         - type: string
 *       400:
 *         description: Bad Request - Missing required parameters
 *       404:
 *         description: Not Found - Rule not found or index out of bounds
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update a Rule by ID (Dynamic Route)
 *     description: Update an existing rule using the rule ID from URL path
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier (UUID) of the rule to update
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - result_location
 *               - predicted_genotype
 *               - predicted_phenotype
 *               - recommend
 *               - Name
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
 *                 example: ["A/A", "A/G", "G/G"]
 *               phenotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["NM", "IM", "PM"]
 *                 nullable: true
 *               predicted_genotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["*1/*1", "*1/*3C", "*3C/*3C"]
 *               predicted_phenotype:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Normal metabolizer", "Intermediate metabolizer", "Poor metabolizer"]
 *               recommend:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Standard dose", "Reduce dose", "Alternative therapy"]
 *               Name:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TPMT"]
 *     responses:
 *       200:
 *         description: Update Successful
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
 *                   example: "Update Successful"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request - Missing required fields
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a Rule by ID (Dynamic Route)
 *     description: Delete an existing rule using the rule ID from URL path
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier (UUID) of the rule to delete
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Delete Successful
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
 *                   example: "Delete Successful"
 *                 data:
 *                   type: string
 *                   example: "Rule deleted successfully"
 *       400:
 *         description: Bad Request - Missing rule ID
 *       500:
 *         description: Internal Server Error
 */

export async function GET(request, { params }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    console.log("GET /api/user/rule/[id] - ruleID:", id, "index:", index) // for Debug

    if (!id) {
        console.error("Invalid Data: Rule ID is required") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data: Rule ID is required'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    if (index === null || index === undefined) {
        console.error("Invalid Data: index is required") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data: index query parameter is required'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    const { data, error } = await QueryRule(id, parseInt(index))
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Query Failed: ' + error
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    if (!data) {
        console.error(`Rule Not Found with ID: ${id} at index: ${index}`) // for Debug
        ResponseModel.status = '404'
        ResponseModel.message = `Rule Not Found with ID: ${id} at index: ${index}`
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 404 })
    }
    
    ResponseModel.status = '200'
    ResponseModel.message = 'Query Successful'
    ResponseModel.data = data
    return NextResponse.json(ResponseModel, { status: 200 })
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    
    if (!id || !body || !body.location || !body.result_location || !body.phenotype || !body.predicted_genotype || !body.predicted_phenotype || !body.recommend || !body.Name) {
        console.error("Invalid Data - missing ID or required fields");
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data - Missing ID or required fields'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    
    RuleModel.location = body.location
    RuleModel.result_location = body.result_location
    RuleModel.phenotype = body.phenotype || null;
    RuleModel.predicted_genotype = body.predicted_genotype
    RuleModel.predicted_phenotype = body.predicted_phenotype
    RuleModel.recommend = body.recommend
    RuleModel.Name = body.Name

    const response = await UpdateRule(id, RuleModel);
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

export async function DELETE(request, { params }) {
    const { id } = await params;
    if (!id) {
        console.error("Invalid Data: Rule ID is required") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data: Rule ID is required'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    const { data, error } = await DeleteRule(id)
    if (error) {
        ResponseModel.status = '500'
        ResponseModel.message = 'Delete Failed: ' + error
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    console.log("Delete successful for ID:", id) // for Debug
    ResponseModel.status = '200'
    ResponseModel.message = 'Delete Successful'
    ResponseModel.data = data
    return NextResponse.json(ResponseModel, { status: 200 })
}