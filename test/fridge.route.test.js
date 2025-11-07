vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/fridge_service', () => ({
  GetAllFridges: vi.fn(),
  CreateFridge: vi.fn(),
  UpdateFridge: vi.fn(),
  DeleteFridge: vi.fn(),
}))

import { GET, POST, PUT, DELETE } from '@/app/api/user/fridge/route'
import { GetAllFridges } from '@/app/api/user/service/fridge_service'
import { makeReq, makeReqWithId } from './routeMocks'

describe('API /api/user/fridge route', () => {
  beforeEach(() => vi.resetAllMocks())

  it('GET returns 404 when no fridges', async () => {
    GetAllFridges.mockResolvedValue({ data: [], error: null })
    const res = await GET()
    expect(res).toHaveProperty('status', 404)
  })

  it('POST returns 201 when create succeeds', async () => {
    const { CreateFridge } = await import('@/app/api/user/service/fridge_service')
    CreateFridge.mockResolvedValue({ data: { id: 'f1' }, error: null })
    const req = makeReq({ name: 'F', capacity: 10 })
    const res = await POST(req)
    expect(res).toHaveProperty('status', 201)
  })

  it('PUT returns 400 when missing id', async () => {
    const req = makeReq({ name: 'x' }, 'http://localhost/')
    const res = await PUT(req)
    expect(res).toHaveProperty('status', 400)
  })

  it('DELETE returns 400 when missing id', async () => {
    const req = makeReq({}, 'http://localhost/')
    const res = await DELETE(req)
    expect(res).toHaveProperty('status', 400)
  })
})
