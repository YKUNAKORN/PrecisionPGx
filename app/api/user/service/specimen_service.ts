import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreateSpecimen(row: any): Promise<any> {
    const { data, error } = await Create(db, "specimen", row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetAllSpecimens(): Promise<any> {
    const { data, error } = await GetAll(db, "specimen")
    if (error) {
        throw new Error(`Failed to fetch Specimens: ${error.message}`)
    }
    return data
}

export async function GetSpecimenById(id: string): Promise<any> {
    const { data, error } = await GetById(db, "specimen", id)
    if (error) {
        throw new Error(`Failed to fetch specimen: ${error.message}`)
    }
    return data
}

export async function UpdateSpecimen(id: string, row: any): Promise<any> {
    const { data, error } = await Update(db, "specimen", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteSpecimen(id: string): Promise<any> {
    const { data, error } = await Delete(db, "specimen", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}
