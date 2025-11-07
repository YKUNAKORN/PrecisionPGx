vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/barcode_service', () => ({
  GenerateBarcode: vi.fn(),
}))

vi.mock('@/app/api/user/service/patient_service', () => ({
  GetPatientById: vi.fn(),
}))

import { GET } from '@/app/api/user/barcode/route'
import { makeReqWithUrl } from './routeMocks'
import { GetPatientById } from '@/app/api/user/service/patient_service'
import { GenerateBarcode } from '@/app/api/user/service/barcode_service'

describe('API /api/user/barcode route', () => {
  beforeEach(() => vi.resetAllMocks())

  it('GET returns 400 when missing patientId', async () => {
    const req = makeReqWithUrl({}, '/')
    const res = await GET(req)
    expect(res).toHaveProperty('status', 400)
  })

  it('GET returns 404 when patient not found', async () => {
    const req = makeReqWithUrl({}, '/?patientId=notfound')
    GetPatientById.mockResolvedValue([])
    const res = await GET(req)
    expect(res).toHaveProperty('status', 404)
  })

  it('GET returns 200 when barcode generated', async () => {
    const req = makeReqWithUrl({}, '/?patientId=p1')
    GetPatientById.mockResolvedValue([{ id: 'p1' }])
    GenerateBarcode.mockResolvedValue({ data: 'base64', error: null })
    const res = await GET(req)
    expect(res).toHaveProperty('status', 200)
    expect(res.body.data).toHaveProperty('base64')
  })
})
