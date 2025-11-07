vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/user_service', () => ({
  GetAllUsers: vi.fn(),
}))

import { GET } from '@/app/api/user/user/route'
import { GetAllUsers } from '@/app/api/user/service/user_service'

describe('API /api/user/user route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GET returns users and 200', async () => {
    const fake = [{ id: '1', email: 'a' }]
    GetAllUsers.mockResolvedValue(fake)

    const res = await GET()

    expect(res).toHaveProperty('status', 200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toEqual(fake)
    expect(res.body.status).toBe('200')
    expect(res.body.message).toBe('Success')
  })

  it('GET returns 500 when service throws', async () => {
    GetAllUsers.mockImplementation(() => { throw new Error('oops') })
    const res = await GET()
    expect(res).toHaveProperty('status', 500)
    expect(res.body.status).toBe('500')
  })
})
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, opts) => ({ body, status: opts?.status ?? 200 }),
  },
}))

vi.mock('@/app/api/user/service/user_service', () => ({
  GetAllUsers: vi.fn(),
}))

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/user/user/route'
import { GetAllUsers } from '@/app/api/user/service/user_service'

describe('API /api/user/user route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GET returns users and 200', async () => {
    const fake = [{ id: '1', email: 'a' }]
    GetAllUsers.mockResolvedValue(fake)

    const res = await GET()

    expect(res).toHaveProperty('status', 200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toEqual(fake)
    expect(res.body.status).toBe('200')
    expect(res.body.message).toBe('Success')
  })

  it('GET returns 500 when service throws', async () => {
    GetAllUsers.mockImplementation(() => { throw new Error('oops') })
    const res = await GET()
    expect(res).toHaveProperty('status', 500)
    expect(res.body.status).toBe('500')
  })
})
