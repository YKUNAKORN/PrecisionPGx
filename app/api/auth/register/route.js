import { NextResponse } from 'next/server'
import { InsertUserModel } from '@/lib/model/User'
import { SignUp } from '@/app/api/auth/service/SignUp'
import { ResponseModel } from '@/lib/model/Response'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Register a new user and return authentication data
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *               - fullname
 *               - position
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user.example@gmail.com
 *                 description: User email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "string"
 *                 description: User password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "string"
 *                 description: Password confirmation (must match password)
 *               fullname:
 *                 type: string
 *                 example: Firstname Lastname
 *                 description: User's full name
 *               position:
 *                 type: string
 *                 example: string
 *                 description: User's position or role
 *     responses:
 *       200:
 *         description: Successful registration
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
 *                   example: SignUp Successful
 *                 data:
 *                   type: object
 *                   description: User authentication data
 */

export async function POST(request) {
  const { email, password, confirmPassword, fullname, position , phone , license_number} = await request.json()
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }
  try {
    InsertUserModel.email = email
    InsertUserModel.position = position
    InsertUserModel.fullname = fullname
    InsertUserModel.phone = phone
    InsertUserModel.license_number = license_number
    console.log("UserModel from request:", InsertUserModel) // Debug log
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request payload' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined }, { status: 400 })
  }
  const data = await SignUp(InsertUserModel, password)
  if (data.error) {
    console.error('Error during SignUp:', data.error) // Debug log
    ResponseModel.status = '500'
    ResponseModel.message = 'SignUp failed: ' + data.error
    ResponseModel.data = null
    return NextResponse.json(ResponseModel, { status: 500 })
  }
  console.log("data", data)
  ResponseModel.status = '200'
  ResponseModel.message = 'SignUp Successful'
  ResponseModel.data = data
  return NextResponse.json(ResponseModel)
}