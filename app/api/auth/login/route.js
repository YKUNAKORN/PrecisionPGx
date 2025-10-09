import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import { Login } from '../service/Login'

export async function POST(request) {
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
    errorResponse.message = 'Login failed: Internal server error: ' + error.message
    errorResponse.data = null
    return NextResponse.json(errorResponse, { status: 500 })
  }
}