export const ReportResult =[ {  //for result and delete
    id: "",
    specimens_id: "",
    doctor_id: "",
    patient_id: "",
    pharm_verify: false,
    medtech_verify: false,
    note_id: "",
    rule_id: "",
    index_rule: 0,
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    status: "",
    request_date: "",
    report_date: "",
    created_at: "",
    updated_at: ""
}]

export const ReportModel = {  //for create body
    specimens_id: "",
    patient_id: "",
    status: "",
}

export const ReportUpdate = {  //for update
    doctor_id: "",
    pharm_verify: false,
    medtech_verify: false,
    note_id: "",
    rule_id: [],
    index_rule: 0,
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    request_date: "",
    report_date: "",
    status: "",
    updated_at: ""
}