import { NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetPatientById, UpdatePatient, DeletePatient } from '@/app/api/user/service/patient_service'

export async function GET(req, { params }) {
    try {  
        const { id } = await params
        const patient = await GetPatientById(id)

        if (!patient) {
            ResponseModel.status = '404'
            ResponseModel.message = 'Patient not found'
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 404 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Success'
        ResponseModel.data = patient

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error fetching patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params
        const body = await req.json()

        const { data, error } = await UpdatePatient(id, body)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Patient updated successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error updating patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params

        const { data, error } = await DeletePatient(id)

        if (error) {
            ResponseModel.status = '400'
            ResponseModel.message = error.message
            ResponseModel.data = null
            return NextResponse.json(ResponseModel, { status: 400 })
        }

        ResponseModel.status = '200'
        ResponseModel.message = 'Patient deleted successfully'
        ResponseModel.data = data

        return NextResponse.json(ResponseModel, { status: 200 })
    } catch (error) {
        console.error('Error deleting patient:', error)

        ResponseModel.status = '500'
        ResponseModel.message = 'Internal server error'
        ResponseModel.data = null

        return NextResponse.json(ResponseModel, { status: 500 })
    }
}