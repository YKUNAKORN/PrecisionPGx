vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/report_service', () => ({
  CreateReport: vi.fn(),
  GetAllReports: vi.fn(),
}))

import { POST, GET } from '@/app/api/user/report/route'
import { CreateReport, GetAllReports } from '@/app/api/user/service/report_service'
import { makeReq } from './routeMocks'

describe('API /api/user/report route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('POST returns 400 when missing required fields', async () => {
    const req = makeReq({})
    const res = await POST(req)
    expect(res).toHaveProperty('status', 400)
    expect(res.body.status).toBe('400')
  })

  it('GET returns 404 when no reports', async () => {
    GetAllReports.mockResolvedValue({ data: [], error: null })
    const res = await GET()
    expect(res).toHaveProperty('status', 404)
    expect(res.body.status).toBe('404')
  })
})
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/report_service', () => ({
  CreateReport: vi.fn(),
  GetAllReports: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST, GET } from '@/app/api/user/report/route'
import { CreateReport, GetAllReports } from '@/app/api/user/service/report_service'
import { makeReq } from './_helpers/routeMocks'

describe('API /api/user/report route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('POST returns 400 when missing required fields', async () => {
    const req = makeReq({})
    const res = await POST(req)
    expect(res).toHaveProperty('status', 400)
    expect(res.body.status).toBe('400')
  })

  it('GET returns 404 when no reports', async () => {
    GetAllReports.mockResolvedValue({ data: [], error: null })
    const res = await GET()
    expect(res).toHaveProperty('status', 404)
    expect(res.body.status).toBe('404')
  })
})
