import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetRuleById, UpdateRule, DeleteRule } from '@/app/api/user/service/rule_service'

/**
 * @swagger
 * /api/user/rule/{id}:
 *   get:
 *     summary: Read Rule by ID
 *     description: Retrieve a specific rule by its ID from the database
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the rule
 *         example: 1861e133-4a57-4dca-bcf6-bfc87f468d99
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
 *   put:
 *     summary: Update a Rule by ID
 *     description: Update an existing rule in the database
 *     tags:
 *       - RuleBased
 *     parameters:
 *       - in: path
 *         name: id
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
 *               genotype:
 *                 type: string
 *                 example: "*1/*2"
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
 *                     active_scrore:
 *                       type: float
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
 *       - in: path
 *         name: id
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
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {  
        const { id } = await params
        const rule = await GetRuleById(id)

        if (!rule) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '404'
            errorResponse.message = 'Rule not found'
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 404 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Success'
        successResponse.data = rule

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error fetching rule:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const body = await req.json()
        const { data, error } = await UpdateRule(id, body)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Rule updated successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error updating rule:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
        const { id } = await params
        const { data, error } = await DeleteRule(id)

        if (error) {
            const errorResponse = { ...ResponseModel }
            errorResponse.status = '400'
            errorResponse.message = error.message
            errorResponse.data = null
            return NextResponse.json(errorResponse, { status: 400 })
        }

        const successResponse = { ...ResponseModel }
        successResponse.status = '200'
        successResponse.message = 'Rule deleted successfully'
        successResponse.data = data

        return NextResponse.json(successResponse, { status: 200 })
    } catch (error) {
        console.error('Error deleting rule:', error)

        const errorResponse = { ...ResponseModel }
        errorResponse.status = '500'
        errorResponse.message = 'Internal server error'
        errorResponse.data = null

        return NextResponse.json(errorResponse, { status: 500 })
    }
}
