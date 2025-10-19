import { NextResponse, type NextRequest } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { Login } from '@/app/api/auth/service/Login'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     description: Login a user and return authentication data
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 * 
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Successful login
 *                 data:
 *                   type: object
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  
  try {
    const response = await Login(email, password)
    return response
  } catch (error) {
    const errorResponse = { ...ResponseModel }
    errorResponse.status = '500'
    errorResponse.message = 'Login failed: Internal server error: ' + (error as Error).message
    errorResponse.data = null
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
