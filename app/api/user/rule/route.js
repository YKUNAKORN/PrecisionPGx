import { NextResponse } from 'next/server'
import { QueryRule, QueryAllRules, QueryRuleByRowIndex, InsertRule, UpdateRule, DeleteRule } from '@/app/api/user/service/rule_service'
import { RuleModel } from "@/lib/model/Rule"
import { ResponseModel } from "@/lib/model/Response"

/**
 * @swagger
 * /api/user/rule:
 *   get:
 *     summary: Query Rules with Flexible Options
 *     description: |
 *       This endpoint supports three different query patterns:
 *       1. **Get All Rules**: No parameters - Returns all rules with row_index for reference
 *       2. **Get Rule by Row Index**: Only `index` parameter - Returns the Nth rule from database (0-based)
 *       3. **Get Rule Element by ID**: Both `ruleID` and `index` - Returns specific array element within a rule
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: index
 *         required: false
 *         description: |
 *           Row index (0-based) when used alone, or array element index when used with ruleID
 *         schema:
 *           type: integer
 *           minimum: 0
 *         example: 0
 *       - in: query
 *         name: ruleID
 *         required: false
 *         description: UUID of a specific rule (requires index parameter)
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
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
 *                   example: "Query Successful - All Rules"
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       description: Array of all rules with row_index (when no parameters provided)
 *                       items:
 *                         type: object
 *                         properties:
 *                           row_index:
 *                             type: integer
 *                             description: Row number for reference (0-based)
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           location:
 *                             type: array
 *                             items:
 *                               type: string
 *                           result_location:
 *                             type: array
 *                             items:
 *                               type: string
 *                           predicted_genotype:
 *                             type: array
 *                             items:
 *                               type: string
 *                           predicted_phenotype:
 *                             type: array
 *                             items:
 *                               type: string
 *                           recommend:
 *                             type: array
 *                             items:
 *                               type: string
 *                           phenotype:
 *                             type: array
 *                             items:
 *                               type: string
 *                           Name:
 *                             type: array
 *                             items:
 *                               type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     - type: object
 *                       description: Single rule object (when index or ruleID+index provided)
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         location:
 *                           type: array
 *                           items:
 *                             type: string
 *                         result_location:
 *                           oneOf:
 *                             - type: array
 *                               items:
 *                                 type: string
 *                             - type: string
 *                         predicted_genotype:
 *                           oneOf:
 *                             - type: array
 *                               items:
 *                                 type: string
 *                             - type: string
 *                         predicted_phenotype:
 *                           oneOf:
 *                             - type: array
 *                               items:
 *                                 type: string
 *                             - type: string
 *                         recommendation:
 *                           oneOf:
 *                             - type: array
 *                               items:
 *                                 type: string
 *                             - type: string
 *                         phenotype:
 *                           oneOf:
 *                             - type: array
 *                               items:
 *                                 type: string
 *                             - type: string
 *                         Name:
 *                           type: array
 *                           items:
 *                             type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad Request - Invalid parameters
 *       404:
 *         description: Not Found - Rule not found at specified index
 *       500:
 *         description: Internal Server Error
 * 
 *   put:
 *     summary: Update a Rule by ID
 *     description: Update an existing rule in the database using ruleID query parameter
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: ruleID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the rule to update
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
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
 *                 example: ["Standard dose recommended", "Reduce dose by 50%", "Consider alternative therapy"]
 *               Name:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TPMT"]
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
 *                   example: "Update Successful"
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
 *                     phenotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     predicted_genotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     predicted_phenotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendation:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Name:
 *                       type: array
 *                       items:
 *                         type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing required fields
 *       500:
 *         description: Internal Server Error
 * 
 *   delete:
 *     summary: Delete a Rule by ID
 *     description: Delete an existing rule from the database using ruleID query parameter
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: query
 *         name: ruleID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the rule to delete
 *         example: "2cb582c0-3b2f-4f39-881b-c95072c392d2"
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
 *                   example: "Delete Successful"
 *                 data:
 *                   type: string
 *                   example: "Rule deleted successfully"
 *       400:
 *         description: Bad Request - Missing ruleID
 *       500:
 *         description: Internal Server Error
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
 *                 example: ["Standard dose recommended", "Reduce dose by 50%", "Consider alternative therapy"]
 *               Name:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TPMT"]
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
 *                   example: "Insert Successful"
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
 *                     phenotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     predicted_genotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     predicted_phenotype:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendation:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Name:
 *                       type: array
 *                       items:
 *                         type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing required fields
 *       500:
 *         description: Internal Server Error
 */

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
    // CASE 2: ruleID + index => Get specific element 
    if (ruleID && index !== null && index !== undefined) {
        console.log(`Case 2: Fetching rule ${ruleID} at index ${index}`) // for Debug
        const { data, error } = await QueryRule(ruleID, parseInt(index))
        if (error) {
            ResponseModel.status = '500'
            ResponseModel.message = 'Query Failed: ' + error
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 500 })
        }
        if (!data) {
            console.error(`Rule not found: ${ruleID}`)
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
        console.error("✗ Invalid: ruleID provided without index") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data: index parameter is required when using ruleID'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    // Something else
    ResponseModel.status = '400'
    ResponseModel.message = 'Invalid request parameters'
    ResponseModel.data = null
    return NextResponse.json(ResponseModel, { status: 400 })
}   

export async function POST(request) {
    const body = await request.json();
    if (!body || !body.location || !body.result_location || !body.phenotype || !body.predicted_genotype || !body.predicted_phenotype || !body.recommend || !body.Name) {
        console.error("Invalid Data - missing required fields") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    RuleModel.location = body.location;
    RuleModel.result_location = body.result_location;
    RuleModel.phenotype = body.phenotype || null;
    RuleModel.predicted_genotype = body.predicted_genotype;
    RuleModel.predicted_phenotype = body.predicted_phenotype;
    RuleModel.recommend = body.recommend;
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
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    const body = await request.json();
    if (!ruleID || !body || !body.location || !body.result_location || !body.phenotype || !body.predicted_genotype || !body.predicted_phenotype || !body.recommend || !body.Name) {
        console.error("Invalid Data");
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
        ResponseModel.data = null
        return NextResponse.json(ResponseModel, { status: 400 })
    }
    RuleModel.location = body.location;
    RuleModel.result_location = body.result_location;
    RuleModel.phenotype = body.phenotype || null;
    RuleModel.predicted_genotype = body.predicted_genotype;
    RuleModel.predicted_phenotype = body.predicted_phenotype;
    RuleModel.recommend = body.recommend;
    RuleModel.Name = body.Name;

    const response = await UpdateRule(ruleID, RuleModel);
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
    const { searchParams } = new URL(request.url);
    const ruleID = searchParams.get('ruleID');
    if (!ruleID) {
        console.error("Invalid Data") // for Debug
        ResponseModel.status = '400'
        ResponseModel.message = 'Invalid Data'
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