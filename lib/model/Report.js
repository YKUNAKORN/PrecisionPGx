export const ReportResult = {  //for result and delete
    id: "",
    specimens_id: "",
    doctor_id: "",
    patient_id: "",
    pharm_verify: [],
    medtech_verify: [],
    note_id: "",
    rule_id: "",
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    request_date: "",
    report_date: "",
    created_at: "",
    updated_at: ""
}

export const ReportModel = {  //for create body
    specimens_id: "",
    doctor_id: "",
    patient_id: "",
    pharm_verify: [],
    medtech_verify: "",
    note_id: "",
    rule_id: "",
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    request_date: "",
    report_date: "",
}

export const ReportUpdate = {  //for update
    specimens_id: "",
    doctor_id: "",
    patient_id: "",
    pharm_verify: [],
    medtech_verify: [],
    note_id: "",
    rule_id: "",
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    request_date: "",
    report_date: "",
    updated_at: new Date().toISOString()
}