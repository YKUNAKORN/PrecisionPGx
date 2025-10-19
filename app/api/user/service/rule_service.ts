import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreateRule(row: any): Promise<any> {
    const { data, error } = await Create(db, "rule", row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetAllRules(): Promise<any> {
    const { data, error } = await GetAll(db, "rule")
    if (error) {
        throw new Error(`Failed to fetch rules: ${error.message}`)
    }
    return data
}

export async function GetRuleById(id: string): Promise<any> {
    const { data, error } = await GetById(db, "rule", id)
    if (error) {
        throw new Error(`Failed to fetch rule: ${error.message}`)
    }
    return data
}

export async function UpdateRule(id: string, row: any): Promise<any> {
    const { data, error } = await Update(db, "rule", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteRule(id: string): Promise<any> {
    const { data, error } = await Delete(db, "rule", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}
