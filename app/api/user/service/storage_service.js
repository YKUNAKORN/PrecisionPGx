import { Create, GetAll, GetById, Update, Delete } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'

const db = CreateClientSecret()

export async function CreateStorage(row) {
    const { data, error } = await Create(db, "storage", row)
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null }
}

export async function GetAllStorages() {
    const { data, error } = await GetAll(db, "storage")
    if (error) {
        throw new Error(`Failed to fetch storage: ${error.message}`)
    }
    return data
}

export async function GetStorageById(id) {
    const { data, error } = await GetById(db, "storage", id)
    if (error) {
        throw new Error(`Failed to fetch storage: ${error.message}`)
    }
    return data
}

export async function UpdateStorage(id, row) {
    const { data, error } = await Update(db, "storage", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteStorage(id) {
    const { data, error } = await Delete(db, "storage", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: error }
}