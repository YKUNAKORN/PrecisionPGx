import { create } from "domain"

export interface QualityType {
    id: string
    tester_id: string
    tester_name: string
    quality: string
}

export interface UpdateQualityType {
    id: string
    tester_id: string
    quality: string
    updated_at: string
}

export interface ResponseQualityType {
    id: string
    tester_id: string
    quality: string
    updated_at: string
    created_at: string
}

export interface InsertQualityType {
    tester_id: string
    quality: string
}

export interface QualityCountType {
    pass: number
    failed: number
    warning: number
    total: number
}

export const Quality: QualityType[] =[{
    id: "",
    tester_id: "",
    tester_name: "",
    quality: "",
}]

export const UpdateQuality: UpdateQualityType = {
    id: "",
    tester_id: "",
    quality: "",
    updated_at: "",
}
export const ResponseQuality: ResponseQualityType = {
    id: "",
    tester_id: "",
    quality: "",
    updated_at: "",
    created_at: "",
}


export const InsertQuality: InsertQualityType = {
    tester_id: "",
    quality: "",
}

export const QualityCount: QualityCountType = {
    pass: 0,
    failed: 0,
    warning: 0,
    total: 0
}