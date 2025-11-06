import { create } from "domain"

export const Quality =[{
    id: "",
    tester_id: "",
    tester_name: "",
    quality: "",
}]

export const UpdateQuality = {
    id: "",
    tester_id: "",
    quality: "",
    updated_at: "",
}
export const ResponseQuality = {
    id: "",
    tester_id: "",
    quality: "",
    updated_at: "",
    created_at: "",
}


export const InsertQuality = {
    tester_id: "",
    quality: "",
}

export const QualityCount = {
    pass: 0,
    fail: 0,
    warning: 0,
    total: 0
}