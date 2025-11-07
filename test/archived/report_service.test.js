vi.mock('@/lib/supabase/client', () => ({
  CreateClientSecret: vi.fn(() => ({})),
}))

vi.mock('@/lib/supabase/crud', () => ({
  Create: vi.fn(),
  GetJoinAll: vi.fn(),
  GetJoinWithId: vi.fn(),
  GetAll: vi.fn(),
  Update: vi.fn(),
  Delete: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreateReport, GetAllReports, GetAllReportsDashboard } from '@/app/api/user/service/report_service'
import { Create, GetJoinAll, GetAll as GetAllCrud } from '@/lib/supabase/crud'
import { makeReportRow } from '../test/_helpers/sampleData'

describe('report_service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('CreateReport returns error message when Create responds with error', async () => {
    Create.mockResolvedValue({ data: null, error: { message: 'insert failed' } })
    const res = await CreateReport({})
    expect(res.data).toBeNull()
    expect(res.error).toContain('insert failed')
  })

  it('GetAllReports returns Data Not Found when empty array', async () => {
    GetJoinAll.mockResolvedValue({ data: [], error: null })
    const res = await GetAllReports()
    expect(res.data).toEqual([])
    expect(res.error).toBeInstanceOf(Error)
  })

  it('GetAllReportsDashboard returns zeros when no reports', async () => {
    GetAllCrud.mockResolvedValue({ data: [], error: null })
    const res = await GetAllReportsDashboard()
    expect(res.data).toHaveProperty('sample_received_d0')
    expect(res.data.sample_received).toBe(0)
    expect(res.data.tests_completed).toBe(0)
  })
})
