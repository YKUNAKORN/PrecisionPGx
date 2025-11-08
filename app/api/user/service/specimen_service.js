import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreateSpecimen(row) {
    if (row.name.toLowerCase() == "blood") {
        row.expire_in = 7
    }
    else if (row.name.toLowerCase() == "saliva") {
        row.expire_in = 14
    }
    else if (row.name.toLowerCase() == "buccal swab") {
        row.expire_in = 10
    }
    else if (row.name.toLowerCase() == "tissue") {
        row.expire_in = 5
    }
    else {
        return { data: null, error: "Invalid specimen" }
    }
    console.log(row)
    const { data, error } = await Create(db, "specimen", row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetAllSpecimens() {
    const { data, error } = await GetAll(db, "specimen")
    if (error) {
        throw new Error(`Failed to fetch Specimens: ${error.message}`)
    }
    return data
}

export async function GetSpecimenById(id) {
    const { data, error } = await GetById(db, "specimen", id)
    if (error) {
        throw new Error(`Failed to fetch specimen: ${error.message}`)
    }
    return data
}

export async function UpdateSpecimen(id, row) {
    const { data, error } = await Update(db, "specimen", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteSpecimen(id) {
    const { data, error } = await Delete(db, "specimen", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}