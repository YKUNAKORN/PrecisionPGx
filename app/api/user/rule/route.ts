import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllRules, CreateRule } from '@/app/api/user/service/rule_service'

/**
 * @swagger
 * /api/user/rule:
 *   get:
 *     summary: Read All Rules
 *     description: Retrieve all rules from the database
 *     tags:
 *       - RuleBased
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
 *                     active_scrore:
 *                       type: string
 *                     recommendation:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     enzyme:
 *                       type: string
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
 *               - genotype
 *               - phenotype
 *               - active_score
 *               - recommendation
 *               - gene_location
 *               - enzyme
 *             properties:
 *               gene_location:
 *                 type: string
 *                 example: This is gene_location
 *               genotype:
 *                 type: string
 *                 example: This is genotype
 *               phenotype:
 *                 type: string
 *                 example: This is phenotype
 *               active_score:
 *                 type: float
 *                 example: 0.37
 *               recommendation:
 *                 type: string
 *                 example: This is recommendation
 *               enzyme:
 *                 type: string
 *                 example: This is enzyme
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
 *                     active_scrore:
 *                       type: string
 *                     recommendation:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     enzyme:
 *                       type: string
 */

export async function GET(): Promise<NextResponse> {
    try {
        const rules = await GetAllRules()

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = rules

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching rules:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const { genotype, phenotype, active_score, recommendation, gene_location, enzyme } = body
        
        if (!genotype || !phenotype || !active_score || !recommendation || !gene_location || !enzyme) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = 'Missing required fields'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const { data, error } = await CreateRule(body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '201'
        successResponse.message = 'Rule created successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 201 })
    } catch (error) {
        console.error('Error creating rule:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
