import { Create, GetJoinAll, Update, Delete, GetById, GetJoinWithId, GetAll } from '@/lib/supabase/crud'
import { ReportDashboard, ReportResult, ReportResultOne } from "@/lib/model/Report"
import { CreateClientSecret } from "@/lib/supabase/client"
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { startOfDay, addDays } from 'date-fns';
const TZ = 'Asia/Bangkok';


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
    const { data, error } = await GetJoinAll(db, "reports", `*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:user!medical_technician_id(*), note(*), rule(*), ward(*)`);
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
            if (data[i].priority == null || data[i].priority == undefined) {
                ReportResult[i].priority = "";
            } else {
                ReportResult[i].priority = data[i].priority;
            }
            if (data[i].ward_id == null || data[i].ward_id == undefined) {
                ReportResult[i].ward_id = "";
                ReportResult[i].contact_number = "";
            } else {
                ReportResult[i].ward_id = data[i].ward_id;
                ReportResult[i].contact_number = data[i].ward.contact_number;
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
        ReportResult.priority = data[0].priority;
        ReportResult.ward_id = data[0].ward_id;
        ReportResult.contact_number = data[0].ward.contact_number;
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
    const { data, error } = await GetJoinWithId(db, "reports", id, `*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:user!medical_technician_id(*), note(*), rule(*), ward(*)`);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) };
    }
    if (error) {
        return { data: null, error: error, status: 500 }; //for User
    }
    // console.log(data[0].id)
    try {
        ReportResult[0].id = data[0].id;
        if (data[0].specimens_id == null || data[0].specimen_id == undefined) {
            ReportResult[0].specimens_id = "";
            ReportResult[0].specimen_name = "";
            ReportResult[0].specimens_expire_date = "";
        } else {
            ReportResult[0].specimens_id = data[0].specimen_id;
            ReportResult[0].specimen_name = data[0].specimen.name;
            ReportResult[0].specimens_expire_date = data[0].specimen.expire_date;
        }
        if (data[0].doctor_id == null || data[0].doctor_id == undefined) {
            ReportResult[0].doctor_id = "";
            ReportResult[0].doctor_fullname = "";
            ReportResult[0].doctor_license = "";
        } else {
            ReportResult[0].doctor_id = data[0].doctor_id;
            ReportResult[0].doctor_fullname = data[0].doctor.fullname;
            ReportResult[0].doctor_license = data[0].doctor.license;
        }
        if (data[0].patient_id == null || data[0].patient_id == undefined) {
            ReportResult[0].patient_id = "";
            ReportResult[0].Eng_name = "";
            ReportResult[0].Thai_name = "";
            ReportResult[0].DOB = "";
            ReportResult[0].age = "";
            ReportResult[0].gender = "";
            ReportResult[0].phone = "";
            ReportResult[0].address = "";
        } else {
            ReportResult[0].patient_id = data[0].patient_id;
            ReportResult[0].Eng_name = data[0].patient.Eng_name;
            ReportResult[0].Thai_name = data[0].patient.Thai_name;
            ReportResult[0].DOB = data[0].patient.dob;
            ReportResult[0].age = data[0].patient.age;
            ReportResult[0].gender = data[0].patient.gender;
            ReportResult[0].phone = data[0].patient.phone;
            ReportResult[0].address = data[0].patient.address;
        }
        if (data[0].pharm_verify == null || data[0].pharm_verify == undefined) {
            ReportResult[0].pharm_verify = false;
        } else {
            ReportResult[0].pharm_verify = data[0].pharm_verify;
        }
        if (data[0].medtech_verify == null || data[0].medtech_verify == undefined) {
            ReportResult[0].medtech_verify = false;
        } else {
            ReportResult[0].medtech_verify = data[0].medtech_verify;
        }
        if (data[0].note_id == null || data[0].note_id == undefined) {
            ReportResult[0].note_id = "";
        } else {
            ReportResult[0].note_id = data[0].note_id;
        }
        if (data[0].note == null || data[0].note == undefined) {
            ReportResult[0].note_method = "";
        } else {
            ReportResult[0].note_method = data[0].note.method;
        }
        if (data[0].index_rule == null || data[0].index_rule == undefined) {
            ReportResult[0].index_rule = 0;
            ReportResult[0].rule_location = "";
            ReportResult[0].rule_result_location = "";
            ReportResult[0].rule_phenotype = "";
            ReportResult[0].rule_predicted_genotype = "";
            ReportResult[0].rule_predicted_phenotype = "";
            ReportResult[0].rule_recommendation = "";
        } else {
            ReportResult[0].index_rule = data[0].index_rule;
            ReportResult[0].rule_location = data[0].rule.location[ReportResult[0].index_rule];
            ReportResult[0].rule_result_location = data[0].rule.result_location[ReportResult[0].index_rule];
            if (data[0].rule.phenotype == null || data[0].rule.phenotype == undefined) {
                ReportResult[0].rule_phenotype = "";
            } else {
                ReportResult[0].rule_phenotype = data[0].rule.phenotype[ReportResult[0].index_rule];
            }
            ReportResult[0].rule_predicted_genotype = data[0].rule.predicted_genotype[ReportResult[0].index_rule];
            ReportResult[0].rule_predicted_phenotype = data[0].rule.predicted_phenotype[ReportResult[0].index_rule];
            ReportResult[0].rule_recommendation = data[0].rule.recommend[ReportResult[0].index_rule];
        }
        if (data[0].rule_id == null || data[0].rule_id == undefined) {
            ReportResult[0].rule_id = "";
            ReportResult[0].rule_name = "";

        } else {
            ReportResult[0].rule_id = data[0].rule_id;
            ReportResult[0].rule_name = data[0].rule.Name;
        }
        if (data[0].pharmacist_id == null || data[0].pharmacist_id == undefined) {
            ReportResult[0].pharmacist_id = "";
            ReportResult[0].fullname_pharmacist = "";
            ReportResult[0].pharmacist_license = "";
        } else {
            ReportResult[0].pharmacist_id = data[0].pharmacist_id;
            ReportResult[0].fullname_pharmacist = data[0].pharmacist.fullname;
            ReportResult[0].pharmacist_license = data[0].pharmacist.license;
        }
        if (data[0].medical_technician_id == null || data[0].medical_technician_id == undefined) {
            ReportResult[0].medical_technician_id = "";
            ReportResult[0].fullname_medtech = "";
            ReportResult[0].medical_technician_license = "";
        } else {
            ReportResult[0].medical_technician_id = data[0].medical_technician_id;
            ReportResult[0].fullname_medtech = data[0].medical_technician.fullname;
            ReportResult[0].medical_technician_license = data[0].medical_technician.license;
        }
        if (data[0].more_information == null || data[0].more_information == undefined) {
            ReportResult[0].more_information = "";
        } else {
            ReportResult[0].more_information = data[0].more_information;
        }
        if (data[0].status == null || data[0].status == undefined) {
            ReportResult[0].status = "";
        } else {
            ReportResult[0].status = data[0].status;
        }
        if (data[0].request_date == null || data[0].request_date == undefined) {
            ReportResult[0].request_date = "";
        } else {
            ReportResult[0].request_date = data[0].request_date;
        }
        if (data[0].report_date == null || data[0].report_date == undefined) {
            ReportResult[0].report_date = "";
        } else {
            ReportResult[0].report_date = data[0].report_date;
        }
        if (data[0].priority == null || data[0].priority == undefined) {
            ReportResult[0].priority = "";
        } else {
            ReportResult[0].priority = data[0].priority;
        }
        if (data[0].ward_id == null || data[0].ward_id == undefined) {
            ReportResult[0].ward_id = "";
            ReportResult[0].contact_number = "";
        } else {
            ReportResult[0].ward_id = data[0].ward_id;
            ReportResult[0].contact_number = data[0].ward.contact_number;
        }
        ReportResult[0].created_at = data[0].created_at;
        if (data[0].updated_at == null || data[0].updated_at == undefined) {
            ReportResult[0].updated_at = "";
        } else {
            ReportResult[0].updated_at = data[0].updated_at;
        }

    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err, status: 500 };
    }
    // console.log(ReportResult[0])
    return { data: ReportResult[0], error: null };
}


export async function GetAllReportsDashboard() {
    const { data, error } = await GetAll(db, "reports");

    let submited_inspection = 0;
    let awaiting_inspection = 0;
    let inprogress = 0;
    let completed = 0;
    let awaiting_approve = 0;
    let sample_received = 0;
    let tests_completed = 0;
    let results_interpret = 0;
    // คำนวณช่วง "วันนี้" ตามโซน Asia/Bangkok แล้วแปลงเป็น UTC ISO
    const now = new Date();
    const zonedNow = toZonedTime(now, TZ);
    const startLocal = startOfDay(zonedNow);
    const endLocal = addDays(startLocal, 1);
    const startUtcISO = fromZonedTime(startLocal, TZ).toISOString();
    const endUtcISO = fromZonedTime(endLocal, TZ).toISOString();

    // แปลงเป็น timestamp ล่วงหน้าเพื่อเทียบเร็วขึ้น
    const startTs = Date.parse(startUtcISO);
    const endTs = Date.parse(endUtcISO);

    if (error) {
        return { data: null, error }; //for User
    }

    console.log("GetAllReportsDashboard - data:", data);
    console.log("GetAllReportsDashboard - error:", error);

    if (!data || data.length === 0) {
        return {
            data: { submited_inspection: 0, awaiting_inspection: 0, inprogress: 0, completed: 0, awaiting_approve: 0, sample_received: 0, }, error: null
        };
    }
    try {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            // --- 1) นับสถานะ ---
            const q = String(row?.status ?? "").toLowerCase().trim();

            if (q === "summited inspection" || q === "submitted inspection") {
                submited_inspection++;
            } else if (q === "awaiting inspection") {
                awaiting_inspection++;
            } else if (q === "inprogress" || q === "in progress") {
                inprogress++;
            } else if (q === "completed") {
                completed++;
            } else if (q === "awaiting approve" || q === "awaiting approval") {
                awaiting_approve++;
            } else {
                console.warn("Status type doesn't exist for item:", row);
            }

            // today output
            const createdISO = row?.created_at ? String(row.created_at) : "";
            const ts = Date.parse(createdISO); // แปลงเป็น ms since epoch
            if (!Number.isNaN(ts)) {
                if (ts >= startTs && ts < endTs) {
                    sample_received++;
                    if (q === "completed") {
                        tests_completed++
                    }
                    if (q === "inprogress") {
                        results_interpret++
                    }
                }
            }

        }
    } catch (err) {
        return { data: null, error: err };
    }
    ReportDashboard.sample_received = sample_received;
    ReportDashboard.tests_completed = tests_completed;
    ReportDashboard.results_interpret = results_interpret;
    ReportDashboard.submitted_inspection = submited_inspection;
    ReportDashboard.awaiting_inspection = awaiting_inspection;
    ReportDashboard.inprogress = inprogress;
    ReportDashboard.completed = completed;
    ReportDashboard.awaiting_approve = awaiting_approve;
    return { data: ReportDashboard, error: null };
}
