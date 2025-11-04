import { Create, GetJoinAll, Update, Delete, GetById, GetJoinWithId } from '@/lib/supabase/crud'
import { ReportResult, ReportResultOne } from "@/lib/model/Report"
import { CreateClientSecret } from "@/lib/supabase/client"

const db = CreateClientSecret()

export async function CreateReport(InsertReportModel) {
    try {
        const response = await Create(db, "reports", InsertReportModel);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        // ReportResult.id = response.data[0].id;
        // ReportResult.specimens_id = response.data[0].specimens_id;
        // ReportResult.doctor_id = response.data[0].doctor_id;
        // ReportResult.patient_id = response.data[0].patient_id;
        // ReportResult.pharm_verify = response.data[0].pharm_verify;
        // ReportResult.medtech_verify = response.data[0].medtech_verify;
        // ReportResult.note_id = response.data[0].note_id;
        // ReportResult.rule_id = response.data[0].rule_id;
        // ReportResult.more_information = response.data[0].more_information;
        // ReportResult.pharmacist_id = response.data[0].pharmacist_id;
        // ReportResult.pharmacist_license = response.data[0].pharmacist_license;
        // ReportResult.medical_technician_id = response.data[0].medical_technician_id;
        // ReportResult.medtech_license = response.data[0].medtech_license;
        // ReportResult.status = response.data[0].status;
        // ReportResult.request_date = response.data[0].request_date;
        // ReportResult.report_date = response.data[0].report_date;
        // ReportResult.created_at = response.data[0].created_at;

        // return { data: ReportResult, error: null }; //for User
        return { data: response.data, error: null }; //for User
    } catch (error) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message }; //for User
    }
}

export async function GetAllReports() {
    const { data, error } = await GetJoinAll(db, "reports",`*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:user!medical_technician_id(*), note(*), rule(*)`);
    console.log(data)
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    console.log(data)
    try {
        for (let i = 0; i < data.length; i++) {
            ReportResult[i] = {};
            ReportResult[i].id = data[i].id;
            ReportResult[i].specimens_id = data[i].specimens_id;
            ReportResult[i].doctor_id = data[i].doctor_id;
            ReportResult[i].patient_id = data[i].patient_id;
            ReportResult[i].pharm_verify = data[i].pharm_verify;
            ReportResult[i].medtech_verify = data[i].medtech_verify;
            ReportResult[i].note_id = data[i].note_id;
            ReportResult[i].rule_id = data[i].rule_id;
            ReportResult[i].pharmacist_id = data[i].pharmacist_id;
            ReportResult[i].medical_technician_id = data[i].medical_technician_id;
            ReportResult[i].status = data[i].status;
            ReportResult[i].request_date = data[i].request_date;
            ReportResult[i].report_date = data[i].report_date;
            ReportResult[i].updated_at = data[i].updated_at;
            ReportResult[i].created_at = data[i].created_at;
        }
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: ReportResult, error: null };
}

export async function UpdateReportByID(id, row) {
    const { data, error } = await Update(db, "reports", id, row);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    if (error) {
        console.log(error)
        return { data: null, error: error }; //for User
    }
    try {
        ReportResult.id = data[0].id;
        ReportResult.specimens_id = data[0].specimens_id;
        ReportResult.doctor_id = data[0].doctor_id;
        ReportResult.patient_id = data[0].patient_id;
        ReportResult.pharm_verify = data[0].pharm_verify;
        ReportResult.medtech_verify = data[0].medtech_verify;
        ReportResult.note_id = data[0].note_id;
        ReportResult.rule_id = data[0].rule_id;
        ReportResult.more_information = data[0].more_information;
        ReportResult.medical_technician_id = data[0].medical_technician_id;
        ReportResult.status = data[0].status;
        ReportResult.request_date = data[0].request_date;
        ReportResult.report_date = data[0].report_date;
        ReportResult.created_at = data[0].created_at;
        ReportResult.updated_at = data[0].updated_at;
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: ReportResult, error: null };
}

export async function DeleteReportByID(id) {
    const { data, error } = await Delete(db, "reports", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    return { data: null, error: null };
}

export async function GetReportById(id) {
    const { data, error } = await GetJoinWithId(db, "reports", id, `*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:user!medical_technician_id(*), note(*), rule(*)`);
    console.log(data)
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) };
    }
    if (error) {
        return { data: null, error: error, status: 500 }; //for User
    }
    // console.log(data[0].id)
    try {
        ReportResultOne.id = data[0].id;
        ReportResultOne.specimens_id = data[0].specimens_id;
        ReportResultOne.specimens_name = data[0].specimen.name;
        ReportResultOne.specimens_expire_date = data[0].specimen.expire_date;
        ReportResultOne.doctor_fullname = data[0].doctor.fullname;
        ReportResultOne.doctor_license = data[0].doctor.license;
        ReportResultOne.doctor_id = data[0].doctor_id;
        ReportResultOne.patient_id = data[0].patient_id;
        ReportResultOne.Eng_name = data[0].patient.Eng_name;
        ReportResultOne.Thai_name = data[0].patient.Thai_name;
        ReportResultOne.DOB = data[0].patient.dob;
        ReportResultOne.age = data[0].patient.age;
        ReportResultOne.gender = data[0].patient.gender;
        ReportResultOne.pharm_verify = data[0].pharm_verify;
        ReportResultOne.medtech_verify = data[0].medtech_verify;
        ReportResultOne.note_id = data[0].note_id;
        ReportResultOne.note_method = data[0].note.method;
        ReportResultOne.index_rule = data[0].index_rule;
        ReportResultOne.rule_id = data[0].rule_id;
        ReportResultOne.rule_name = data[0].rule.Name;
        ReportResultOne.rule_location = data[0].rule.location[ReportResultOne.index_rule];
        ReportResultOne.rule_result_location = data[0].rule.result_location[ReportResultOne.index_rule];
        if (data[0].rule.phenotype == null || data[0].rule.phenotype == undefined) {
            ReportResultOne.rule_phenotype = "";
        } else {
            ReportResultOne.rule_phenotype = data[0].rule.phenotype[ReportResultOne.index_rule];
        }
        ReportResultOne.rule_predicted_genotype = data[0].rule.predicted_genotype[ReportResultOne.index_rule];
        ReportResultOne.rule_predicted_phenotype = data[0].rule.predicted_phenotype[ReportResultOne.index_rule];
        ReportResultOne.rule_recommendation = data[0].rule.recommend[ReportResultOne.index_rule];
        ReportResultOne.pharmacist_id = data[0].pharmacist_id;
        ReportResultOne.fullname_pharmacist = data[0].pharmacist.fullname;
        ReportResultOne.pharmacist_license = data[0].pharmacist.license;
        ReportResultOne.more_information = data[0].more_information;
        ReportResultOne.medical_technician_id = data[0].medical_technician_id;
        ReportResultOne.fullname_medtech = data[0].medical_technician.fullname;
        ReportResultOne.medical_technician_license = data[0].medical_technician.license;
        ReportResultOne.status = data[0].status;
        ReportResultOne.request_date = data[0].request_date;
        ReportResultOne.report_date = data[0].report_date;
        ReportResultOne.created_at = data[0].created_at;
        ReportResultOne.updated_at = data[0].updated_at;

    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err, status: 500 };
    }
    // console.log(ReportResultOne)
    return { data: ReportResultOne, error: null };
}