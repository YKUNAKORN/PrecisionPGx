import { request } from "http"
import { Fridge } from "./Fridge"

export interface ReportResult {
    id: string
    specimens_id: string
    specimens_name: string
    specimens_expire_date: string
    doctor_id: string
    doctor_fullname: string
    doctor_license: string
    patient_id: string
    Eng_name: string
    Thai_name: string
    DOB: string
    age: number
    gender: string
    ethnicity: string
    pharm_verify: boolean
    medtech_verify: boolean
    note_id: string
    note_method: string
    rule_id: string
    rule_name: string
    rule_location: string
    rule_result_location: string
    rule_phenotype: string
    rule_predicted_genotype: string
    rule_predicted_phenotype: string
    rule_recommendation: string
    index_rule: number
    more_information: any[]
    pharmacist_id: string
    fullname_pharmacist: string
    pharmacist_license: string
    medical_technician_id: string
    fullname_medtech: string
    medical_technician_license: string
    status: string
    request_date: string
    report_date: string
    priority: string
    ward_id: string
    contact_number: string
    created_at: string
    updated_at: string
    quality_id: string
}

export interface CreateReportModel {
    patient_id: string
    specimens: string
    priority: string
    doctor_id: string
    ward_id: string
    contact_number: string
    note: string
    collected_at: string
    fridge_id: string
    medical_technician_id: string
    request_date: string
}
export interface ReportModel {
    specimens_id: string
    patient_id: string
    note_id: string
    priority: string
    doctor_id: string
    ward_id: string
    contact_number: string
    status: string
    pharm_verify: boolean
    medtech_verify: boolean
}

export interface ReportUpdate {
    medtech_verify: boolean
    rule_id: string
    index_rule: number
    more_information: string
    medical_technician_id: string
    report_date: string
    status: string
    updated_at: string
}

export interface ReportDashboard {
    sample_received: number
    tests_completed: number
    results_interpret: number
    submitted_inspection: number
    awaiting_inspection: number
    inprogress: number
    completed: number
    awaiting_approve: number
    sample_received_d6: number
    sample_received_d5: number
    sample_received_d4: number
    sample_received_d3: number
    sample_received_d2: number
    sample_received_d1: number
    sample_received_d0: number
}

export const ReportResult: any = []
export const ReportModel: any = {}
export const CreateReportModel: any = {}
export const ReportUpdate: any = {}
