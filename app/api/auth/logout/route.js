import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import  { Logout } from '../service/Logout'

export async function POST(request) {
    const result = await Logout()
    console.log("Logout result", result)
    if (result) {
      ResponseModel.status = '500'
      ResponseModel.message = 'Logout Unsuccessful'
        return NextResponse.json(ResponseModel, { status: 500 })
    }
    return NextResponse.redirect(new URL('/login', request.url), {
      status: 302,
    })
  } 
