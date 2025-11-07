vi.mock('@/lib/supabase/client', () => ({
  CreateClientSecret: vi.fn(() => ({})),
}))

vi.mock('@/lib/supabase/crud', () => ({
  GetAll: vi.fn(),
  GetById: vi.fn(),
  Create: vi.fn(),
  Update: vi.fn(),
  Delete: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetAllQualityMetrics, GetAllQualityMetricsPercent } from '@/app/api/user/service/quality_service'
import { GetAll } from '@/lib/supabase/crud'
import { makeQualityRow } from '../test/_helpers/sampleData'

describe('quality_service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GetAllQualityMetrics returns Data Not Found when no data', async () => {
    GetAll.mockResolvedValue({ data: [], error: null })
    const res = await GetAllQualityMetrics()
    expect(res.data).toEqual([])
    expect(res.error).toBeInstanceOf(Error)
  })

  it('GetAllQualityMetricsPercent computes percentages', async () => {
    const rows = [makeQualityRow('pass'), makeQualityRow('fail'), makeQualityRow('warning'), makeQualityRow('pass')]
    GetAll.mockResolvedValue({ data: rows, error: null })
    const res = await GetAllQualityMetricsPercent()
    expect(res.data.total).toBe(4)
    // pass = 2 -> 50%
    expect(Math.round(res.data.pass)).toBe(50)
    expect(Math.round(res.data.fail)).toBe(25)
    expect(Math.round(res.data.warning)).toBe(25)
  })
})
