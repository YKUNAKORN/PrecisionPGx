export interface ReportResult {
    id: string;
    specimens_id: string;
    doctor_id: string;
    patient_id: string;
    pharm_verify: boolean;
    medtech_verify: boolean;
    note_id: string;
    rule_id: string;
    index_rule: number;
    more_information: any[];
    pharmacist_id: string;
    medical_technician_id: string;
    status: string;
    request_date: string;
    report_date: string;
    created_at: string;
    updated_at: string;
}

export interface ReportModel {
    specimens_id: string;
    patient_id: string;
    status: string;
}

export interface ReportUpdate {
    doctor_id: string;
    pharm_verify: boolean;
    medtech_verify: boolean;
    note_id: string;
    rule_id: string; // Changed from string[] to string to match database schema
    index_rule: number;
    more_information: any[];
    pharmacist_id: string;
    medical_technician_id: string;
    request_date: string;
    report_date: string;
    status: string;
    updated_at: string;
    quality_id?: string; // Optional: UUID of the quality/tester type
}

export const ReportResultExample: ReportResult[] = [{
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
}];

export const ReportModelExample: ReportModel = {
    specimens_id: "",
    patient_id: "",
    status: "",
};

export const ReportUpdateExample: ReportUpdate = {
    doctor_id: "",
    pharm_verify: false,
    medtech_verify: false,
    note_id: "",
    rule_id: "",
    index_rule: 0,
    more_information: [],
    pharmacist_id: "",
    medical_technician_id: "",
    request_date: "",
    report_date: "",
    status: "",
    updated_at: ""
};
