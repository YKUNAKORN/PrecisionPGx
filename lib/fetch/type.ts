import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type Storage = {
    id: string;
    patient_id: string;
    fridge_id: string;
    specimen_type: string;
    collected_at: Timestamp;
    expiry_at: Timestamp;
    status: string;
    created_at: Timestamp;
}

export type Specimen = {
    id: string;
    name: string;
    expiry_in: string;
    created_at: Timestamp;
}

export type RuleBased = {
    id: string;
    location: string[];
    result_location: string[];
    phenotype: string[];
    predicted_genotype: string[];
    predicted_phenotype: string[];
    recommendation: string[];
    Name: string;
    created_at: string
}

export type Report = {
    id: string;
    specimens_id: string;
    specimen_name: string;
    specimens_expire_date: string;
    doctor_id: string;
    doctor_fullname: string;
    patient_id: string;
    Eng_name: string;
    Thai_name: string;
    DOB: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    pharm_verify: boolean;
    medtech_verify: boolean;
    note_id: string;
    note_method: string;
    index_rule: number;
    rule_location: string;
    rule_result_location: string;
    rule_phenotype: string;
    rule_predicted_genotype: string;
    rule_predicted_phenotype: string;
    rule_recommendation: string;
    rule_id: string;
    rule_name: string;
    pharmacist_id: string;
    fullname_pharmacist: string;
    medical_technician_id: string;
    fullname_medtech: string;
    more_information: string;
    status: string;
    request_date: string;
    report_date: string;
    priority: string;
    ward_id: string;
    created_at: string;
    updated_at: string;
}

export type Note = {
    id: string;
    method: string;
    created_at: Timestamp;
}

export type Patient = {
    id: string;
    Eng_name: string;
    Thai_name: string;
    phone: string
    age: number
    gender: "Male" | "Female" | string;
    Ethnicity: string
    dob: string
    email: string
    address: string
    created_at: string;
    updated_at: string;
}

export type HLA_B = {
    id: string;
    hla_gene: string[];
    drug: string[];
    typeof_scar: string[];
    ethnic_group: string[];
    odds_score: string[];
    ref: string[];
    created_at: Timestamp;
}

export type Qualityper = {
    pass: number,
    failed: number,
    warning: number,
    total: number
}

export type Doctor = {
    id: string;
    email: string;
    position: string;
    fullname: string;
    created_at: string;
}

export type Fridge = {
    id: string,
    name: string,
    capacity: number,
    item: number,
    remaining: number,
}

export type Dashboard = {
    sample_received: number;
    tests_completed: number;
    results_interpret: number;
    submitted_inspection: number;
    awaiting_inspection: number;
    inprogress: number;
    completed: number;
    awaiting_approve: number;
    sample_received_d6: number;
    sample_received_d5: number;
    sample_received_d4: number;
    sample_received_d3: number;
    sample_received_d2: number;
    sample_received_d1: number;
    sample_received_d0: number;
}

export type Ward = {
    id: string;
    name: string;
    number: string;
    created_at: string; // ISO8601 timestamp
};


export type Quality = {
    id: string,
    tester_id: string,
    quality: string,
}