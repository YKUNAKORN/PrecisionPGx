vi.mock('@/lib/supabase/client', () => ({
  CreateClientSecret: vi.fn(() => ({})),
}))

vi.mock('@/lib/supabase/crud', () => ({
  Create: vi.fn(),
  GetAll: vi.fn(),
  GetById: vi.fn(),
  Update: vi.fn(),
  Delete: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreatePatient, GetAllPatient, GetPatientById } from '@/app/api/user/service/patient_service'
import { Create, GetAll, GetById } from '@/lib/supabase/crud'

describe('patient_service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('CreatePatient returns data when Create succeeds', async () => {
    Create.mockResolvedValue({ data: { id: '1' }, error: null })
    const res = await CreatePatient({ name: 'a' })
    expect(res).toEqual({ data: { id: '1' }, error: null })
  })

  it('GetAllPatient throws when GetAll returns error', async () => {
    GetAll.mockResolvedValue({ data: null, error: { message: 'fail' } })
    await expect(GetAllPatient()).rejects.toThrow(/Failed to fetch patients/)
  })

  it('GetPatientById returns not found when no data', async () => {
    GetById.mockResolvedValue({ data: [], error: null })
    const res = await GetPatientById('id')
    expect(res.data).toBeNull()
    expect(res.error).toBeDefined()
  })
})
