import { describe, it, expect } from 'vitest'
import * as crud from '@/lib/supabase/crud'

describe('supabase crud helpers', () => {
  it('Create returns data on success', async () => {
    const supabase = {
      from: () => ({ insert: () => ({ select: () => Promise.resolve({ data: [{ id: 1 }], error: null }) }) }),
    }

    const res = await crud.Create(supabase, 'table', { foo: 'bar' })
    expect(res).toEqual({ data: [{ id: 1 }], error: null })
  })

  it('Create returns error when supabase returns error', async () => {
    const supabase = {
      from: () => ({ insert: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'err' } }) }) }),
    }

    const res = await crud.Create(supabase, 'table', { foo: 'bar' })
    expect(res.data).toBeNull()
    expect(res.error).toBeDefined()
  })

  it('GetAll returns data on success', async () => {
    const supabase = { from: () => ({ select: () => Promise.resolve({ data: [1, 2, 3], error: null }) }) }
    const res = await crud.GetAll(supabase, 'table')
    expect(res).toEqual({ data: [1, 2, 3], error: null })
  })

  it('GetById returns data when found', async () => {
    const supabase = { from: () => ({ select: () => ({ eq: () => Promise.resolve({ data: [{ id: 'x' }], error: null }) }) }) }
    const res = await crud.GetById(supabase, 'table', 'x')
    expect(res).toEqual({ data: [{ id: 'x' }], error: null })
  })

  it('Update returns data on success', async () => {
    const supabase = { from: () => ({ update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: [{ id: 'u' }], error: null }) }) }) }) }
    const res = await crud.Update(supabase, 'table', 'u', { a: 1 })
    expect(res).toEqual({ data: [{ id: 'u' }], error: null })
  })

  it('Delete returns data on success', async () => {
    const supabase = { from: () => ({ delete: () => ({ eq: () => ({ select: () => Promise.resolve({ data: [{ id: 'd' }], error: null }) }) }) }) }
    const res = await crud.Delete(supabase, 'table', 'd')
    expect(res).toEqual({ data: [{ id: 'd' }], error: null })
  })
})
