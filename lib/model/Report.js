import { request } from "http"
import { Fridge } from "./Fridge"

export const ReportResult = [ {  //for result and delete
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

export const CreateReportModel = {  //for create body
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
export const ReportModel = {  //for create body
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

export const ReportUpdate = {  //for update
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

export const ReportDashboard = {
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