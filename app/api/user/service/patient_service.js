import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreatePatient(row) {
    const { data, error } = await Create(db, "patient", row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetAllPatient() {
    const { data, error } = await GetAll(db, "patient")
    if (error) {
        throw new Error(`Failed to fetch patients: ${error.message}`)
    }
    return data
}

export async function GetPatientById(id) {
    const { data, error } = await GetById(db, "patient", id)
    if (error) {
        return { data: null, error: error }
    }
    if (!data || data.length === 0) {
        return { data: null, error: { message: 'Patient not found' } }
    }
    return { data: data, error: null }
}

export async function UpdatePatient(id, row) {
    const { data, error } = await Update(db, "patient", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeletePatient(id) {
    const { data, error } = await Delete(db, "patient", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}