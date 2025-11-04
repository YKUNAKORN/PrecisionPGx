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
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        for (let i = 0; i < data.length; i++) {
        ReportResult[i] = {};
        ReportResult[i].id = data[i].id;
        if (data[i].specimens_id == null || data[i].specimen_id == undefined) {
            ReportResult[i].specimens_id = "";
            ReportResult[i].specimen_name = "";
            ReportResult[i].specimens_expire_date = "";
        } else {
            ReportResult[i].specimens_id = data[i].specimen_id;
            ReportResult[i].specimen_name = data[i].specimen.name;
            ReportResult[i].specimens_expire_date = data[i].specimen.expire_date;
        }
        if (data[i].doctor_id == null || data[i].doctor_id == undefined) {
            ReportResult[i].doctor_id = "";
            ReportResult[i].doctor_fullname = "";
            ReportResult[i].doctor_license = "";
        } else {
            ReportResult[i].doctor_id = data[i].doctor_id;
            ReportResult[i].doctor_fullname = data[i].doctor.fullname;
            ReportResult[i].doctor_license = data[i].doctor.license;
        }
        if (data[i].patient_id == null || data[i].patient_id == undefined) {
            ReportResult[i].patient_id = "";
            ReportResult[i].Eng_name = "";
            ReportResult[i].Thai_name = "";
            ReportResult[i].DOB = "";
            ReportResult[i].age = "";
            ReportResult[i].gender = "";
            ReportResult[i].phone = "";
            ReportResult[i].address = "";
        } else {
            ReportResult[i].patient_id = data[i].patient_id;
            ReportResult[i].Eng_name = data[i].patient.Eng_name;
            ReportResult[i].Thai_name = data[i].patient.Thai_name;
            ReportResult[i].DOB = data[i].patient.dob;
            ReportResult[i].age = data[i].patient.age;
            ReportResult[i].gender = data[i].patient.gender;
            ReportResult[i].phone = data[i].patient.phone;
            ReportResult[i].address = data[i].patient.address;
        }
        if (data[i].pharm_verify == null || data[i].pharm_verify == undefined) {
            ReportResult[i].pharm_verify = false;
        } else {
            ReportResult[i].pharm_verify = data[i].pharm_verify;
        }
        if (data[i].medtech_verify == null || data[i].medtech_verify == undefined) {
            ReportResult[i].medtech_verify = false;
        } else {
            ReportResult[i].medtech_verify = data[i].medtech_verify;
        }
        if (data[i].note_id == null || data[i].note_id == undefined) {
            ReportResult[i].note_id = "";
        } else {
            ReportResult[i].note_id = data[i].note_id;
        }
        if (data[i].note == null || data[i].note == undefined) {
            ReportResult[i].note_method = "";
        } else {
            ReportResult[i].note_method = data[i].note.method;
        }
        if (data[i].index_rule == null || data[i].index_rule == undefined) {
            ReportResult[i].index_rule = 0;
            ReportResult[i].rule_location = "";
            ReportResult[i].rule_result_location = "";
            ReportResult[i].rule_phenotype = "";
            ReportResult[i].rule_predicted_genotype = "";
            ReportResult[i].rule_predicted_phenotype = "";
            ReportResult[i].rule_recommendation = "";
        } else {
            ReportResult[i].index_rule = data[i].index_rule;
            ReportResult[i].rule_location = data[i].rule.location[ReportResult[i].index_rule];
            ReportResult[i].rule_result_location = data[i].rule.result_location[ReportResult[i].index_rule];
            if (data[i].rule.phenotype == null || data[i].rule.phenotype == undefined) {
                ReportResult[i].rule_phenotype = "";
            } else {
                ReportResult[i].rule_phenotype = data[i].rule.phenotype[ReportResult[i].index_rule];
            }
            ReportResult[i].rule_predicted_genotype = data[i].rule.predicted_genotype[ReportResult[i].index_rule];
            ReportResult[i].rule_predicted_phenotype = data[i].rule.predicted_phenotype[ReportResult[i].index_rule];
            ReportResult[i].rule_recommendation = data[i].rule.recommend[ReportResult[i].index_rule];
        }
        if (data[i].rule_id == null || data[i].rule_id == undefined) {
            ReportResult[i].rule_id = "";
            ReportResult[i].rule_name = "";
            
        } else {
            ReportResult[i].rule_id = data[i].rule_id;
            ReportResult[i].rule_name = data[i].rule.Name;
        }
        if (data[i].pharmacist_id == null || data[i].pharmacist_id == undefined) {
            ReportResult[i].pharmacist_id = "";
            ReportResult[i].fullname_pharmacist = "";
            ReportResult[i].pharmacist_license = "";
        } else {
            ReportResult[i].pharmacist_id = data[i].pharmacist_id;
            ReportResult[i].fullname_pharmacist = data[i].pharmacist.fullname;
            ReportResult[i].pharmacist_license = data[i].pharmacist.license;
        }
        if (data[i].medical_technician_id == null || data[i].medical_technician_id == undefined) {
            ReportResult[i].medical_technician_id = "";
            ReportResult[i].fullname_medtech = "";
            ReportResult[i].medical_technician_license = "";
        } else {
            ReportResult[i].medical_technician_id = data[i].medical_technician_id;
            ReportResult[i].fullname_medtech = data[i].medical_technician.fullname;
            ReportResult[i].medical_technician_license = data[i].medical_technician.license;
        }
        if (data[i].more_information == null || data[i].more_information == undefined) {
            ReportResult[i].more_information = "";
        } else {
            ReportResult[i].more_information = data[i].more_information;
        }
        if (data[i].status == null || data[i].status == undefined) {
            ReportResult[i].status = "";
        } else {
            ReportResult[i].status = data[i].status;
        }
        if (data[i].request_date == null || data[i].request_date == undefined) {
            ReportResult[i].request_date = "";
        } else {
            ReportResult[i].request_date = data[i].request_date;
        }
        if (data[i].report_date == null || data[i].report_date == undefined) {
            ReportResult[i].report_date = "";
        } else {
            ReportResult[i].report_date = data[i].report_date;
        }
        ReportResult[i].created_at = data[i].created_at;
        if (data[i].updated_at == null || data[i].updated_at == undefined) {
            ReportResult[i].updated_at = "";
        } else {
            ReportResult[i].updated_at = data[i].updated_at;
        }
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