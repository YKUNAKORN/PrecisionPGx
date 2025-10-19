import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreateReport(row: any): Promise<any> {
    const { data, error } = await Create(db, "report", row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function GetAllReports(): Promise<any> {
    const { data, error } = await GetAll(db, "report")
    if (error) {
        throw new Error(`Failed to fetch reports: ${error.message}`)
    }
    return data
}

export async function GetReportById(id: string): Promise<any> {
    const { data, error } = await GetById(db, "report", id)
    if (error) {
        throw new Error(`Failed to fetch report: ${error.message}`)
    }
    return data
}

export async function UpdateReport(id: string, row: any): Promise<any> {
    const { data, error } = await Update(db, "report", id, row)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}

export async function DeleteReport(id: string): Promise<any> {
    const { data, error } = await Delete(db, "report", id)
    if (error) {
        return { data: null, error: error }
    }
    return { data: data, error: null }
}
