vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/storage_service', () => ({
  GetAllStorages: vi.fn(),
  CreateStorage: vi.fn(),
}))

import { GET, POST } from '@/app/api/user/storage/route'
import { GetAllStorages, CreateStorage } from '@/app/api/user/service/storage_service'
import { makeReq } from './routeMocks'

describe('API /api/user/storage route', () => {
  beforeEach(() => vi.resetAllMocks())

  it('GET returns 200 and data', async () => {
    GetAllStorages.mockResolvedValue([{ id: 's1' }])
    const res = await GET()
    expect(res).toHaveProperty('status', 200)
    expect(res.body.data).toEqual([{ id: 's1' }])
  })

  it('POST returns 400 when missing fields', async () => {
    const req = makeReq({ patient_id: 'p1' })
    const res = await POST(req)
    expect(res).toHaveProperty('status', 400)
    expect(res.body.status).toBe('400')
  })
})
