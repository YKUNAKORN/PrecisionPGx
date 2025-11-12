import { create } from "domain"

export interface Quality {
    id: string
    tester_id: string
    tester_name: string
    quality: string
}

export interface UpdateQuality {
    id: string
    tester_id: string
    quality: string
    updated_at: string
}
export interface ResponseQuality {
    id: string
    tester_id: string
    quality: string
    updated_at: string
    created_at: string
}


export interface InsertQuality {
    tester_id: string
    quality: string
}

export interface QualityCount {
    pass: number
    failed: number
    warning: number
    total: number
}

export const Quality: any = []
