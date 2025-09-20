import { NextResponse } from 'next/server'
import { InsertUserModel } from '../../../../lib/model/User'
import { SignUp } from '../service/SignUp'
import { ResponseModel } from '../../../../lib/model/Response'

export async function POST(request) {
  const { email, password, confirmPassword, fullname, position } = await request.json()
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }
  try {
    InsertUserModel.email = email
    InsertUserModel.position = position
    InsertUserModel.fullname = fullname
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