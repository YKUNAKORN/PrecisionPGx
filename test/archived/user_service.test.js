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
import { CreateUser, GetAllUsers, GetUserById, UpdateUser } from '@/app/api/user/service/user_service'
import { Create, GetAll, GetById, Update } from '@/lib/supabase/crud'

describe('user_service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('CreateUser returns data on success', async () => {
    Create.mockResolvedValue({ data: { id: 'u1' }, error: null })
    const res = await CreateUser({ username: 'u' })
    expect(res).toEqual({ data: { id: 'u1' }, error: null })
  })

  it('GetAllUsers throws when GetAll returns error', async () => {
    GetAll.mockResolvedValue({ data: null, error: { message: 'fail' } })
    await expect(GetAllUsers()).rejects.toThrow(/Failed to fetch users/)
  })

  it('GetUserById returns data when found', async () => {
    GetById.mockResolvedValue({ data: [{ id: 'u1' }], error: null })
    const res = await GetUserById('u1')
    expect(res).toEqual([{ id: 'u1' }])
  })

  it('UpdateUser returns data on success', async () => {
    Update.mockResolvedValue({ data: { id: 'u1' }, error: null })
    const res = await UpdateUser('u1', { username: 'x' })
    expect(res).toEqual({ data: { id: 'u1' }, error: null })
  })
})
