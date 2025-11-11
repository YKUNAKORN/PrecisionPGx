import { Create, GetAll, GetById, GetJoinWithId, Update } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'

const db = CreateClientSecret()

export async function CreateUser(row: any): Promise<{ data: any; error: any }> {
    const { data, error } = await Create(db, "user", row)
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null }
}

export async function GetAllUsers(): Promise<any> {
    const { data, error } = await GetAll(db, "user")
    if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
    return data
}

export async function GetUserById(id: string): Promise<any> {
    const { data, error } = await GetJoinWithId(db, "user", id, "*, ward(name)")
    if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
    return data
}

export async function UpdateUser(id: string, row: any): Promise<{ data: any; error: any }> {
    const { data, error } = await Update(db, "user", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteUser(id: string): Promise<{ data: any; error: any }> {
   const { data, error } = await db.auth.admin.deleteUser(id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetDoctor(): Promise<{ data: any; error: any }> {
    const { data, error } = await db.from("user").select("*").eq("position", "doctor")
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetMedicalTechnician(): Promise<{ data: any; error: any }> {
    const { data, error } = await db.from("user").select("*").eq("position", "medtech")
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetPharmacist(): Promise<{ data: any; error: any }> {
    const { data, error } = await db.from("user").select("*").eq("position", "pharmacy")
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}