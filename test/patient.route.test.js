vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/patient_service', () => ({
  GetAllPatient: vi.fn(),
  CreatePatient: vi.fn(),
}))

import { GET, POST } from '@/app/api/user/patient/route'
import { ResponseModel } from '@/lib/model/Response'
import { GetAllPatient, CreatePatient } from '@/app/api/user/service/patient_service'

describe('API /api/user/patient route', () => {
  beforeEach(() => {
    ResponseModel.status = ''
    ResponseModel.message = ''
    ResponseModel.data = null

    vi.resetAllMocks()
  })

  it('GET returns patients and 200', async () => {
    const fakePatients = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]
    GetAllPatient.mockResolvedValue(fakePatients)

    const res = await GET()

    expect(res).toHaveProperty('status', 200)
    expect(res).toHaveProperty('body')
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toEqual(fakePatients)
    expect(res.body.status).toBe('200')
    expect(res.body.message).toBe('Success')
  })

  it('POST returns 400 when missing required fields', async () => {
    const body = { phone: '0123' }
    const req = { json: async () => body }

    const res = await POST(req)

    expect(res).toHaveProperty('status', 400)
    expect(res.body.status).toBe('400')
    expect(res.body.message).toBe('Missing required fields')
  })

  it('POST returns 201 when create succeeds', async () => {
    const body = {
      phone: '0555555555',
      age: 37,
      gender: 'Male',
      Ethnicity: 'Thai',
      Eng_name: 'Sergio',
      Thai_name: 'เซอร์จิโอ',
      dob: '1988-01-01',
      email: 's@example.com',
      address: 'Bangkok',
    }

    const created = { id: 'abc123', ...body }
    CreatePatient.mockResolvedValue({ data: created, error: null })

    const req = { json: async () => body }
    const res = await POST(req)

    expect(res).toHaveProperty('status', 201)
    expect(res.body.status).toBe('201')
    expect(res.body.message).toBe('Patient created successfully')
    expect(res.body.data).toEqual(created)
  })
})
