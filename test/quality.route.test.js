vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/quality_service', () => ({
  GetAllQualityMetrics: vi.fn(),
  CreateQualityMetrics: vi.fn(),
}))

import { GET, POST } from '@/app/api/user/quality/route'
import { GetAllQualityMetrics } from '@/app/api/user/service/quality_service'
import { makeReq } from './routeMocks'

describe('API /api/user/quality route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GET returns 404 when no quality metrics', async () => {
    GetAllQualityMetrics.mockResolvedValue({ data: [], error: null })
    const res = await GET()
    expect(res).toHaveProperty('status', 404)
    expect(res.body.status).toBe('404')
  })

  it('POST returns 500 when CreateQualityMetrics returns error', async () => {
    const { CreateQualityMetrics } = await import('@/app/api/user/service/quality_service')
    CreateQualityMetrics.mockResolvedValue({ data: null, error: { message: 'insert failed' } })

    const req = makeReq({})
    const res = await POST(req)
    expect(res).toHaveProperty('status', 500)
    expect(res.body.status).toBe('500')
  })
})
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/quality_service', () => ({
  GetAllQualityMetrics: vi.fn(),
  CreateQualityMetrics: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/user/quality/route'
import { GetAllQualityMetrics } from '@/app/api/user/service/quality_service'
import { makeReq } from './_helpers/routeMocks'

describe('API /api/user/quality route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GET returns 404 when no quality metrics', async () => {
    GetAllQualityMetrics.mockResolvedValue({ data: [], error: null })
    const res = await GET()
    expect(res).toHaveProperty('status', 404)
    expect(res.body.status).toBe('404')
  })

  it('POST returns 500 when CreateQualityMetrics returns error', async () => {
    // The route attempts to call CreateQualityMetrics even for empty body
    // so mock it to return an error and assert the route returns 500
    const { CreateQualityMetrics } = await import('@/app/api/user/service/quality_service')
    CreateQualityMetrics.mockResolvedValue({ data: null, error: { message: 'insert failed' } })

    const req = makeReq({})
    const res = await POST(req)
    expect(res).toHaveProperty('status', 500)
    expect(res.body.status).toBe('500')
  })
})
