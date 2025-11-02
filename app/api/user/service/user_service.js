import { Create, GetAll, GetById, Update } from '@/lib/supabase/crud'
import { CreateClientSecret } from '@/lib/supabase/client'

const db = CreateClientSecret()

export async function CreateUser(row) {
    const { data, error } = await Create(db, "user", row)
    if (error) {
        return { data: null, error: error}
    }
    return { data: data, error: null }
}

export async function GetAllUsers() {
    const { data, error } = await GetAll(db, "user")
    if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
    return data
}

export async function GetUserById(id) {
    const { data, error } = await GetById(db, "user", id)
    if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
    return data
}

export async function UpdateUser(id, row) {
    const { data, error } = await Update(db, "user", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteUser(id) {
   const { data, error } = await db.auth.admin.deleteUser(id)
    if (error) {
        console.error(error)
        return { data: null, error: error }
    }
    console.log(data)
    return { data: data, error: null }
}