
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { UserModel } from '../../../../lib/model/User'
import { SignUp } from '../service/SignUp'
import { ResponseModel } from '../../../../lib/model/Response'
// import { SignUp } from 'app/api/auth/service/login'
// import { UserModel } from '../../../../lib/model/User'

export async function POST(request) {
  const { email, password, confirmPassword, fullName, position } = await request.json()
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }
  try {
    UserModel.email = email
    UserModel.position = position
    UserModel.fullname = fullName
    console.log("UserModel from request:", UserModel) // Debug log
  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request payload' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 400 })
  }
  const response = await SignUp(UserModel.email, password)
  ResponseModel.status = '200'
  ResponseModel.message = 'SignUp Successful'
  ResponseModel.data = response
  return NextResponse.json(ResponseModel)
}