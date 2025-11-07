import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type Storage ={
    id: string;
    patient_id: string;
    location: string;
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

export type RuleBased ={
    id: string;
    gene_location: string;
    genotype: string;
    phenotype: string;
    active_score: number;
    recommendation: string;
    created_at: Timestamp;
    enzyme: string;
}

export type Report = {
    id?: string;
    sepicimens_id: string;
    doctor_id: string;
    patient_id: string;
    pharm_verify: boolean;
    medtech_verify: boolean;
    note_id: string;
    rule_id: string;
    more_information: string;
    pharmacist_id: string;
    medical_technologist_id: string;
    request_date: Timestamp;
    report_date: Timestamp;
    status?: string;
}

export type Note = {
    id: string;
    method: string;
    created_at: Timestamp;
}

export type Patient = {
    id?: string;
    name?: string;
    Eng_name?: string;
    phone?: string;
    age?: number;
    gender?: string;
    Ethnicity?: string;
}