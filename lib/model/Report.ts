import { request } from "http"
import { Fridge } from "./Fridge"

export interface ReportResultType {
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

export interface CreateReportModelType {
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

export interface ReportModelType {
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

export interface ReportUpdateType {
    medtech_verify: boolean
    rule_id: string
    index_rule: number
    more_information: string
    medical_technician_id: string
    report_date: string
    status: string
    updated_at: string
}

export interface ReportDashboardType {
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

export const ReportResult: ReportResultType[] = [ {  //for result and delete
    id: "",
    specimens_id: "",
    specimens_name: "",
    specimens_expire_date: "",
    doctor_id: "",
    doctor_fullname: "",
    doctor_license: "",
    patient_id: "",
    Eng_name: "",
    Thai_name: "",
    DOB: "",
    age: 0,
    gender: "",
    ethnicity: "",
    pharm_verify: false,
    medtech_verify: false,
    note_id: "",
    note_method: "",
    rule_id: "",
    rule_name: "",
    rule_location: "",
    rule_result_location: "",
    rule_phenotype: "",
    rule_predicted_genotype: "",
    rule_predicted_phenotype: "",
    rule_recommendation: "",
    index_rule: 0,
    more_information: [],
    pharmacist_id: "",
    fullname_pharmacist: "",
    pharmacist_license: "",
    medical_technician_id: "",
    fullname_medtech: "",
    medical_technician_license: "",
    status: "",
    request_date: "",
    report_date: "",
    priority: "",
    ward_id: "",
    contact_number: "",
    created_at: "",
    updated_at: "",
    quality_id: ""
} ]

export const CreateReportModel: CreateReportModelType = {  //for create body
    patient_id: "",
    specimens: "",
    priority: "",
    doctor_id: "",
    ward_id: "",
    contact_number: "",
    note: "",
    collected_at: "",
    fridge_id: "",
    medical_technician_id: "",
    request_date: ""
}
export const ReportModel: ReportModelType = {  //for create body
    specimens_id: "",
    patient_id: "",
    note_id: "",
    priority: "",
    doctor_id: "",
    ward_id: "",
    contact_number: "",
    status: "",
    pharm_verify: false,
    medtech_verify: false,
}

export const ReportUpdate: ReportUpdateType = {  //for update
    medtech_verify: false,
    rule_id: "",
    index_rule: 0,
    more_information: "",
    medical_technician_id: "",
    report_date: "",
    status: "",
    updated_at: ""
    // quality_id: ""
}

export const ReportDashboard: ReportDashboardType = {
    sample_received: 0,
    tests_completed: 0,
    results_interpret: 0,
    submitted_inspection: 0,
    awaiting_inspection: 0,
    inprogress: 0,
    completed: 0,
    awaiting_approve: 0,
    //last 7 days
    sample_received_d6: 0, //most previous
    sample_received_d5: 0,
    sample_received_d4: 0,
    sample_received_d3: 0,
    sample_received_d2: 0,
    sample_received_d1: 0,
    sample_received_d0: 0 //today
}