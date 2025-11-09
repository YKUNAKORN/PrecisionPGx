import { Create, GetAll, GetById, Delete, Update } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'

const db = CreateClientSecret()

export async function CreateWard(row) {
    const { data, error } = await Create(db, "ward", row)
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null }
}

export async function GetAllWards() {
    const { data, error } = await GetAll(db, "ward")
    if (error) {
        throw new Error(`Failed to fetch wards: ${error.message}`)
    }
    return data
}

export async function GetWardById(id) {
    const { data, error } = await GetById(db, "ward", id)
    if (error) {
        throw new Error(`Failed to fetch ward: ${error.message}`)
    }
    return data
}

export async function UpdateWard(id, row) {
    const { data, error } = await Update(db, "ward", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteWard(id) {
   const { data, error } = await Delete(db, "ward", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

