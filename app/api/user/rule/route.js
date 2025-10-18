import { NextResponse } from 'next/server'
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

export async function GET() {
    try {
        const rules = await GetAllRules()

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = rules

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching rules:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { genotype, phenotype, active_score, recommendation, gene_location, enzyme } = body
        
        if (!genotype || !phenotype || !active_score || !recommendation || !gene_location || !enzyme) {
            ResponseModel.status = '400'
            ResponseModel.message = 'Missing required fields'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        const { data, error } = await CreateRule(body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '201'
        ResponseModel.message = 'Rule created successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 201 })
    } catch (error) {
        console.error('Error creating rule:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}