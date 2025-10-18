import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllRules, CreateRule } from '@/app/api/user/service/rule_service'

/**
 * @swagger
 * /api/user/rule:
 *   get:
 *     description: Get All Rules
 *     tags:[RuleBased]
 *     summary: Retrieve all rules from the database
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             status: 200
 *             message: Success
 *             data:
 *               type: array
 *               items:
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