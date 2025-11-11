import { Create, GetAll, GetById, Delete, Update } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

const db: SupabaseClient = CreateClientSecret()

interface WardRow {
    name?: string
    contact_number?: string
}

interface WardResponse {
    data: any
    error: Error | null
}

export async function CreateWard(row: WardRow): Promise<WardResponse> {
    const { data, error } = await Create(db, "ward", row)
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null }
}

export async function GetAllWards(): Promise<any> {
    const { data, error } = await GetAll(db, "ward")
    if (error) {
        throw new Error(`Failed to fetch wards: ${error.message}`)
    }
    return data
}

export async function GetWardById(id: string): Promise<any> {
    const { data, error } = await GetById(db, "ward", id)
    if (error) {
        throw new Error(`Failed to fetch ward: ${error.message}`)
    }
    return data
}

export async function UpdateWard(id: string, row: WardRow): Promise<WardResponse> {
    const { data, error } = await Update(db, "ward", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteWard(id: string): Promise<WardResponse> {
   const { data, error } = await Delete(db, "ward", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

