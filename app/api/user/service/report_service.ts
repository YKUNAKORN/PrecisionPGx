import { Create, GetJoinAll, Update, Delete, GetById, GetJoinWithId, GetAll} from "@/lib/supabase/crud";
import { ReportResult, ReportModel} from "@/lib/model/Report";
import { Specimen } from "@/lib/model/Specimen";
import { CreateClientSecret } from "@/lib/supabase/client";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay, addDays } from "date-fns";
const TZ = "Asia/Bangkok";

import { CreateSpecimen , DeleteSpecimen} from "./specimen_service";
import { CreateNote } from "./note_service";
import { UpdateNote } from "@/lib/model/Note";
import { CreateStorage } from "./storage_service";
import { IncreaseFridgeItem } from "./fridge_service";
import { GetUserById } from "./user_service";

const db = CreateClientSecret();

export async function CreateReport(inputReportModel: any) {
    try {
        (Specimen as any)[0].name = inputReportModel.specimens;
        (Specimen as any)[0].expire_in = 0;
        console.log(typeof((Specimen as any)[0].expire_in))
        (Specimen as any)[0].patient_id = inputReportModel.patient_id;
        const { data: specimenResponse, error: SpecimenErr } = await CreateSpecimen((Specimen as any)[0]);
        if (SpecimenErr) {
            console.error("Error inserting specimen:", SpecimenErr);
            return { data: null, error: SpecimenErr.message }; //for User
        }
        (UpdateNote as any).method = inputReportModel.note;
        const { data: noteResponse, error: noteErr } = await CreateNote(UpdateNote as any);
        if (noteErr) {
            const { data: deletedSpecimen, error: deleteErr } = await DeleteSpecimen(specimenResponse[0].id);
            if (deleteErr) {
                console.error("Error deleting specimen after note failure:", deleteErr);
            }
            console.error("Error inserting note:", noteErr);
            return { data: null, error: noteErr.message }; //for User
        }
        let StorageModel: any = {};
        StorageModel.specimen_id = specimenResponse[0].id;
        console.log(specimenResponse[0].id);
        console.log(StorageModel.specimen_id)
        StorageModel.fridge_id = inputReportModel.fridge_id;
        StorageModel.collected_at = inputReportModel.collected_at;
        let collectdate = new Date(inputReportModel.collected_at);
        let expire_at = collectdate.setDate(collectdate.getDate() + specimenResponse[0].expire_in);
        let expireAtISOString = new Date(expire_at).toISOString();
        StorageModel.expire_at = expireAtISOString;
        const storageResponse = await CreateStorage(StorageModel);
        if (storageResponse.error) {
            console.error("Error inserting storage:", storageResponse.error);
            return { data: null, error: storageResponse.error.message }; //for User
        }
        let fridge: any = {};
        fridge.item = 1;
        const fridgeUpdateResult = await IncreaseFridgeItem(inputReportModel.fridge_id, fridge);
        if (fridgeUpdateResult.error) {
            console.error("Error updating fridge:", fridgeUpdateResult.error);
            return { data: null, error: fridgeUpdateResult.error.message }; //for User
        }
        (ReportModel as any).specimens_id = specimenResponse[0].id;
        (ReportModel as any).note_id = noteResponse[0].id;
        (ReportModel as any).patient_id = inputReportModel.patient_id;
        (ReportModel as any).priority = inputReportModel.priority;
        (ReportModel as any).doctor_id = inputReportModel.doctor_id;
        (ReportModel as any).ward_id = inputReportModel.ward_id;
        (ReportModel as any).contact_number = inputReportModel.contact_number;
        (ReportModel as any).status = 'Submitted for Inspection';
        (ReportModel as any).medical_technician_id = inputReportModel.medical_technician_id;
        (ReportModel as any).pharm_verify = false;
        (ReportModel as any).medtech_verify = false;
        (ReportModel as any).request_date = new Date().toISOString();
        const response = await Create(db, "reports", ReportModel as any);
        if (response.error) {
            console.error("Error inserting rule:", response.error);
            return { data: null, error: response.error.message }; //for User
        }
        return { data: response.data, error: null }; //for User
    } catch (error: any) {
        console.error("Error inserting rule:", error);
        return { data: null, error: error.message }; //for User
    }
}

export async function GetAllReports() {
    const { data, error } = await GetJoinAll(
        db,
        "reports",
        `*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:
user!medical_technician_id(*), note(*), rule(*), ward(*)`                                                               );
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        for (let i = 0; i < data.length; i++) {
            (ReportResult as any)[i] = {};
            (ReportResult as any)[i].id = data[i].id;
            if (data[i].specimens_id == null || data[i].specimen_id == undefined) {
                (ReportResult as any)[i].specimens_id = "";
                (ReportResult as any)[i].specimen_name = "";
                (ReportResult as any)[i].specimens_expire_date = "";
            } else {
                (ReportResult as any)[i].specimens_id = data[i].specimen_id;
                (ReportResult as any)[i].specimen_name = data[i].specimen.name;
                (ReportResult as any)[i].specimens_expire_date = data[i].specimen.expire_date;
            }
            if (data[i].doctor_id == null || data[i].doctor_id == undefined) {
                (ReportResult as any)[i].doctor_id = "";
                (ReportResult as any)[i].doctor_fullname = "";
                (ReportResult as any)[i].doctor_license = "";
            } else {
                (ReportResult as any)[i].doctor_id = data[i].doctor_id;
                (ReportResult as any)[i].doctor_fullname = data[i].doctor.fullname;
                (ReportResult as any)[i].doctor_license = data[i].doctor.license;
            }
            if (data[i].patient_id == null || data[i].patient_id == undefined) {
                (ReportResult as any)[i].patient_id = "";
                (ReportResult as any)[i].Eng_name = "";
                (ReportResult as any)[i].Thai_name = "";
                (ReportResult as any)[i].DOB = "";
                (ReportResult as any)[i].age = "";
                (ReportResult as any)[i].gender = "";
                (ReportResult as any)[i].phone = "";
                (ReportResult as any)[i].address = "";
            } else {
                (ReportResult as any)[i].patient_id = data[i].patient_id;
                (ReportResult as any)[i].Eng_name = data[i].patient.Eng_name;
                (ReportResult as any)[i].Thai_name = data[i].patient.Thai_name;
                (ReportResult as any)[i].DOB = data[i].patient.dob;
                (ReportResult as any)[i].age = data[i].patient.age;
                (ReportResult as any)[i].gender = data[i].patient.gender;
                (ReportResult as any)[i].phone = data[i].patient.phone;
                (ReportResult as any)[i].address = data[i].patient.address;
            }
            if (data[i].pharm_verify == null || data[i].pharm_verify == undefined) {
                (ReportResult as any)[i].pharm_verify = false;
            } else {
                (ReportResult as any)[i].pharm_verify = data[i].pharm_verify;
            }
            if (
                data[i].medtech_verify == null ||
                data[i].medtech_verify == undefined
            ) {
                (ReportResult as any)[i].medtech_verify = false;
            } else {
                (ReportResult as any)[i].medtech_verify = data[i].medtech_verify;
            }
            if (data[i].note_id == null || data[i].note_id == undefined) {
                (ReportResult as any)[i].note_id = "";
            } else {
                (ReportResult as any)[i].note_id = data[i].note_id;
            }
            if (data[i].note == null || data[i].note == undefined) {
                (ReportResult as any)[i].note_method = "";
            } else {
                (ReportResult as any)[i].note_method = data[i].note.method;
            }
            if (data[i].index_rule == null || data[i].index_rule == undefined) {
                (ReportResult as any)[i].index_rule = 0;
                (ReportResult as any)[i].rule_location = "";
                (ReportResult as any)[i].rule_result_location = "";
                (ReportResult as any)[i].rule_phenotype = "";
                (ReportResult as any)[i].rule_predicted_genotype = "";
                (ReportResult as any)[i].rule_predicted_phenotype = "";
                (ReportResult as any)[i].rule_recommendation = "";
            } else {
                (ReportResult as any)[i].index_rule = data[i].index_rule;
                (ReportResult as any)[i].rule_location =
                    data[i].rule.location[(ReportResult as any)[i].index_rule];
                (ReportResult as any)[i].rule_result_location =
                    data[i].rule.result_location[(ReportResult as any)[i].index_rule];
                if (
                    data[i].rule.phenotype == null ||
                    data[i].rule.phenotype == undefined
                ) {
                    (ReportResult as any)[i].rule_phenotype = "";
                } else {
                    (ReportResult as any)[i].rule_phenotype =
                        data[i].rule.phenotype[(ReportResult as any)[i].index_rule];
                }
                (ReportResult as any)[i].rule_predicted_genotype =
                    data[i].rule.predicted_genotype[(ReportResult as any)[i].index_rule];
                (ReportResult as any)[i].rule_predicted_phenotype =
                    data[i].rule.predicted_phenotype[(ReportResult as any)[i].index_rule];
                (ReportResult as any)[i].rule_recommendation =
                    data[i].rule.recommend[(ReportResult as any)[i].index_rule];
            }
            if (data[i].rule_id == null || data[i].rule_id == undefined) {
                (ReportResult as any)[i].rule_id = "";
                (ReportResult as any)[i].rule_name = "";
            } else {
                (ReportResult as any)[i].rule_id = data[i].rule_id;
                (ReportResult as any)[i].rule_name = data[i].rule.Name;
            }
            if (data[i].pharmacist_id == null || data[i].pharmacist_id == undefined) {
                (ReportResult as any)[i].pharmacist_id = "";
                (ReportResult as any)[i].fullname_pharmacist = "";
                (ReportResult as any)[i].pharmacist_license = "";
            } else {
                (ReportResult as any)[i].pharmacist_id = data[i].pharmacist_id;
                (ReportResult as any)[i].fullname_pharmacist = data[i].pharmacist.fullname;
                (ReportResult as any)[i].pharmacist_license = data[i].pharmacist.license;
            }
            if (
                data[i].medical_technician_id == null ||
                data[i].medical_technician_id == undefined
            ) {
                (ReportResult as any)[i].medical_technician_id = "";
                (ReportResult as any)[i].fullname_medtech = "";
                (ReportResult as any)[i].medical_technician_license = "";
            } else {
                (ReportResult as any)[i].medical_technician_id = data[i].medical_technician_id;
                (ReportResult as any)[i].fullname_medtech = data[i].medical_technician.fullname;
                (ReportResult as any)[i].medical_technician_license =
                    data[i].medical_technician.license;
            }
            if (
                data[i].more_information == null ||
                data[i].more_information == undefined
            ) {
                (ReportResult as any)[i].more_information = "";
            } else {
                (ReportResult as any)[i].more_information = data[i].more_information;
            }
            if (data[i].status == null || data[i].status == undefined) {
                (ReportResult as any)[i].status = "";
            } else {
                (ReportResult as any)[i].status = data[i].status;
            }
            if (data[i].request_date == null || data[i].request_date == undefined) {
                (ReportResult as any)[i].request_date = "";
            } else {
                (ReportResult as any)[i].request_date = data[i].request_date;
            }
            if (data[i].report_date == null || data[i].report_date == undefined) {
                (ReportResult as any)[i].report_date = "";
            } else {
                (ReportResult as any)[i].report_date = data[i].report_date;
            }
            if (data[i].priority == null || data[i].priority == undefined) {
                (ReportResult as any)[i].priority = "";
            } else {
                (ReportResult as any)[i].priority = data[i].priority;
            }
            if (data[i].ward_id == null || data[i].ward_id == undefined) {
                (ReportResult as any)[i].ward_id = "";
                (ReportResult as any)[i].contact_number = "";
            } else {
                (ReportResult as any)[i].ward_id = data[i].ward_id;
                (ReportResult as any)[i].contact_number = data[i].ward.contact_number;
            }
            (ReportResult as any)[i].created_at = data[i].created_at;
            if (data[i].updated_at == null || data[i].updated_at == undefined) {
                (ReportResult as any)[i].updated_at = "";
            } else {
                (ReportResult as any)[i].updated_at = data[i].updated_at;
            }
            if( data[i].quality_id == null || data[i].quality_id == undefined){
                (ReportResult as any)[i].quality_id = "";
            } else {
                (ReportResult as any)[i].quality_id = data[i].quality_id;
            }
        }
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: ReportResult, error: null };
}

export async function UpdateReportByID(id: any, row: any) {
    console.log("UpdateReportByID called with:", { id, row });
    const { data, error } = await Update(db, "reports", id, row);
    console.log("Update result from DB:", { data, error });
    if (error) {
        console.error("Update error:", error);
        return { data: null, error: error }; //for User
    }
    if (!data || data.length === 0) {
        console.error("No data returned from update for ID:", id);
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    try {
        // ส่งข้อมูลที่ได้จาก database โดยตรง ไม่ต้องแปลง
        const result = {
            id: data[0].id,
            specimens_id: data[0].specimens_id,
            doctor_id: data[0].doctor_id,
            patient_id: data[0].patient_id,
            pharm_verify: data[0].pharm_verify,
            medtech_verify: data[0].medtech_verify,
            note_id: data[0].note_id,
            rule_id: data[0].rule_id,
            index_rule: data[0].index_rule,
            more_information: data[0].more_information,
            pharmacist_id: data[0].pharmacist_id,
            medical_technician_id: data[0].medical_technician_id,
            status: data[0].status,
            request_date: data[0].request_date,
            report_date: data[0].report_date,
            priority: data[0].priority,
            ward_id: data[0].ward_id,
            contact_number: data[0].contact_number,
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
        };
        console.log("Returning result:", result);
        return { data: result, error: null };
    } catch (err: any) {
        console.error("Failed to parse data:", err); //for Debug
        return { data: null, error: "Failed to parse data: " + err.message };
    }
}

export async function DeleteReportByID(id: any) {
    const { data, error } = await Delete(db, "reports", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    return { data: null, error: null };
}

export async function GetReportById(id: any) {
    const { data, error } = await GetJoinWithId(
        db,
        "reports",
        id,
        `*, specimen(*), patient(*), doctor:user!doctor_id(*), pharmacist:user!pharmacist_id(*), medical_technician:
user!medical_technician_id(*), note(*), rule(*), ward(*)`                                                               );
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) };
    }
    if (error) {
        return { data: null, error: error, status: 500 }; //for User
    }
    // console.log(data[0].id)
    try {
        (ReportResult as any)[0].id = data[0].id;
        if (data[0].specimens_id == null || data[0].specimen_id == undefined) {
            (ReportResult as any)[0].specimens_id = "";
            (ReportResult as any)[0].specimen_name = "";
            (ReportResult as any)[0].specimens_expire_date = "";
        } else {
            (ReportResult as any)[0].specimens_id = data[0].specimen_id;
            (ReportResult as any)[0].specimen_name = data[0].specimen.name;
            (ReportResult as any)[0].specimens_expire_date = data[0].specimen.expire_date;
        }
        if (data[0].doctor_id == null || data[0].doctor_id == undefined) {
            (ReportResult as any)[0].doctor_id = "";
            (ReportResult as any)[0].doctor_fullname = "";
            (ReportResult as any)[0].doctor_license = "";
        } else {
            (ReportResult as any)[0].doctor_id = data[0].doctor_id;
            (ReportResult as any)[0].doctor_fullname = data[0].doctor.fullname;
            (ReportResult as any)[0].doctor_license = data[0].doctor.license;
        }
        if (data[0].patient_id == null || data[0].patient_id == undefined) {
            (ReportResult as any)[0].patient_id = "";
            (ReportResult as any)[0].Eng_name = "";
            (ReportResult as any)[0].Thai_name = "";
            (ReportResult as any)[0].DOB = "";
            (ReportResult as any)[0].age = "";
            (ReportResult as any)[0].gender = "";
            (ReportResult as any)[0].phone = "";
            (ReportResult as any)[0].address = "";
        } else {
            (ReportResult as any)[0].patient_id = data[0].patient_id;
            (ReportResult as any)[0].Eng_name = data[0].patient.Eng_name;
            (ReportResult as any)[0].Thai_name = data[0].patient.Thai_name;
            (ReportResult as any)[0].DOB = data[0].patient.dob;
            (ReportResult as any)[0].age = data[0].patient.age;
            (ReportResult as any)[0].gender = data[0].patient.gender;
            (ReportResult as any)[0].phone = data[0].patient.phone;
            (ReportResult as any)[0].address = data[0].patient.address;
        }
        if (data[0].pharm_verify == null || data[0].pharm_verify == undefined) {
            (ReportResult as any)[0].pharm_verify = false;
        } else {
            (ReportResult as any)[0].pharm_verify = data[0].pharm_verify;
        }
        if (data[0].medtech_verify == null || data[0].medtech_verify == undefined) {
            (ReportResult as any)[0].medtech_verify = false;
        } else {
            (ReportResult as any)[0].medtech_verify = data[0].medtech_verify;
        }
        if (data[0].note_id == null || data[0].note_id == undefined) {
            (ReportResult as any)[0].note_id = "";
        } else {
            (ReportResult as any)[0].note_id = data[0].note_id;
        }
        if (data[0].note == null || data[0].note == undefined) {
            (ReportResult as any)[0].note_method = "";
        } else {
            (ReportResult as any)[0].note_method = data[0].note.method;
        }
        if (data[0].index_rule == null || data[0].index_rule == undefined) {
            (ReportResult as any)[0].index_rule = 0;
            (ReportResult as any)[0].rule_location = "";
            (ReportResult as any)[0].rule_result_location = "";
            (ReportResult as any)[0].rule_phenotype = "";
            (ReportResult as any)[0].rule_predicted_genotype = "";
            (ReportResult as any)[0].rule_predicted_phenotype = "";
            (ReportResult as any)[0].rule_recommendation = "";
        } else {
            (ReportResult as any)[0].index_rule = data[0].index_rule;
            (ReportResult as any)[0].rule_location =
                data[0].rule.location[(ReportResult as any)[0].index_rule];
            (ReportResult as any)[0].rule_result_location =
                data[0].rule.result_location[(ReportResult as any)[0].index_rule];
            if (
                data[0].rule.phenotype == null ||
                data[0].rule.phenotype == undefined
            ) {
                (ReportResult as any)[0].rule_phenotype = "";
            } else {
                (ReportResult as any)[0].rule_phenotype =
                    data[0].rule.phenotype[(ReportResult as any)[0].index_rule];
            }
            (ReportResult as any)[0].rule_predicted_genotype =
                data[0].rule.predicted_genotype[(ReportResult as any)[0].index_rule];
            (ReportResult as any)[0].rule_predicted_phenotype =
                data[0].rule.predicted_phenotype[(ReportResult as any)[0].index_rule];
            (ReportResult as any)[0].rule_recommendation =
                data[0].rule.recommend[(ReportResult as any)[0].index_rule];
        }
        if (data[0].rule_id == null || data[0].rule_id == undefined) {
            (ReportResult as any)[0].rule_id = "";
            (ReportResult as any)[0].rule_name = "";
        } else {
            (ReportResult as any)[0].rule_id = data[0].rule_id;
            (ReportResult as any)[0].rule_name = data[0].rule.Name;
        }
        if (data[0].pharmacist_id == null || data[0].pharmacist_id == undefined) {
            (ReportResult as any)[0].pharmacist_id = "";
            (ReportResult as any)[0].fullname_pharmacist = "";
            (ReportResult as any)[0].pharmacist_license = "";
        } else {
            (ReportResult as any)[0].pharmacist_id = data[0].pharmacist_id;
            (ReportResult as any)[0].fullname_pharmacist = data[0].pharmacist.fullname;
            (ReportResult as any)[0].pharmacist_license = data[0].pharmacist.license;
        }
        if (
            data[0].medical_technician_id == null ||
            data[0].medical_technician_id == undefined
        ) {
            (ReportResult as any)[0].medical_technician_id = "";
            (ReportResult as any)[0].fullname_medtech = "";
            (ReportResult as any)[0].medical_technician_license = "";
        } else {
            (ReportResult as any)[0].medical_technician_id = data[0].medical_technician_id;
            (ReportResult as any)[0].fullname_medtech = data[0].medical_technician.fullname;
            (ReportResult as any)[0].medical_technician_license =
                data[0].medical_technician.license;
        }
        if (
            data[0].more_information == null ||
            data[0].more_information == undefined
        ) {
            (ReportResult as any)[0].more_information = "";
        } else {
            (ReportResult as any)[0].more_information = data[0].more_information;
        }
        if (data[0].status == null || data[0].status == undefined) {
            (ReportResult as any)[0].status = "";
        } else {
            (ReportResult as any)[0].status = data[0].status;
        }
        if (data[0].request_date == null || data[0].request_date == undefined) {
            (ReportResult as any)[0].request_date = "";
        } else {
            (ReportResult as any)[0].request_date = data[0].request_date;
        }
        if (data[0].report_date == null || data[0].report_date == undefined) {
            (ReportResult as any)[0].report_date = "";
        } else {
            (ReportResult as any)[0].report_date = data[0].report_date;
        }
        if (data[0].priority == null || data[0].priority == undefined) {
            (ReportResult as any)[0].priority = "";
        } else {
            (ReportResult as any)[0].priority = data[0].priority;
        }
        if (data[0].ward_id == null || data[0].ward_id == undefined) {
            (ReportResult as any)[0].ward_id = "";
            (ReportResult as any)[0].contact_number = "";
        } else {
            (ReportResult as any)[0].ward_id = data[0].ward_id;
            (ReportResult as any)[0].contact_number = data[0].ward.contact_number;
        }
        (ReportResult as any)[0].created_at = data[0].created_at;
        if (data[0].updated_at == null || data[0].updated_at == undefined) {
            (ReportResult as any)[0].updated_at = "";
        } else {
            (ReportResult as any)[0].updated_at = data[0].updated_at;
        }
        if( data[0].quality_id == null || data[0].quality_id == undefined){
                (ReportResult as any)[0].quality_id = "";
            } else {
                (ReportResult as any)[0].quality_id = data[0].quality_id;
            }
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err, status: 500 };
    }
    // console.log(ReportResult[0])
    return { data: (ReportResult as any)[0], error: null };
}

export async function GetAllReportsDashboard() {
    const { data, error } = await GetAll(db, "reports");

    let submited_inspection = 0;
    let awaiting_inspection = 0;
    let inprogress = 0;
    let completed = 0;
    let awaiting_approve = 0;

    let sample_received = 0; // วันนี้
    let tests_completed = 0;
    let results_interpret = 0;

    // === ช่วงวันนี้ (BKK) ===
    const now = new Date();
    const zonedNow = toZonedTime(now, TZ);
    const startLocal = startOfDay(zonedNow);
    const endLocal = addDays(startLocal, 1);
    const startUtcISO = fromZonedTime(startLocal, TZ).toISOString();
    const endUtcISO = fromZonedTime(endLocal, TZ).toISOString();
    const startTs = Date.parse(startUtcISO);
    const endTs = Date.parse(endUtcISO);

    if (error) return { data: null, error };

    // === เตรียมคีย์วันย้อนหลัง 7 วัน (BKK) ===
    // last7Days: เรียงจากเก่า -> ใหม่ (ดัชนี 0 = d6, 6 = d0/today)
    const last7Days: any = [];
    const last7Map: any = {};
    for (let i = 6; i >= 0; i--) {
        const dLocal = addDays(startLocal, -i); // 00:00 ของแต่ละวัน (BKK)
        const key = dLocal.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
        last7Days.push(key);
        last7Map[key] = 0;
    }

    if (!data || data.length === 0) {
        // กรณีไม่มีข้อมูล คืนตัวแปร 7 ตัวเป็น 0 ทั้งหมด
        const ReportDashboard = {
            submitted_inspection: 0,
            awaiting_inspection: 0,
            inprogress: 0,
            completed: 0,
            awaiting_approve: 0,
            sample_received: 0,
            tests_completed: 0,
            results_interpret: 0,
            sample_received_d6: 0,
            sample_received_d5: 0,
            sample_received_d4: 0,
            sample_received_d3: 0,
            sample_received_d2: 0,
            sample_received_d1: 0,
            sample_received_d0: 0,
        };
        return { data: ReportDashboard, error: null };
    }

    try {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            // --- นับสถานะรวม ---
            const q = String(row?.status ?? "")
                .toLowerCase()
                .trim();
            if (q.toLowerCase() === "submitted for inspection" || q === "submitted inspection") {
                submited_inspection++;
            } else if (q.toLowerCase() === "awaiting inspection") {
                awaiting_inspection++;
            } else if (q.toLowerCase() === "in progress" || q === "in progress") {
                inprogress++;
            } else if (q.toLowerCase() === "completed") {
                completed++;
            } else if (q.toLowerCase() === "awaiting approve" || q.toLowerCase() === "awaiting approval") {
                awaiting_approve++;
            } else {
                console.warn("Status type doesn't exist for item:", row);
            }

            const createdISO = row?.created_at ? String(row.created_at) : "";
            const ts = Date.parse(createdISO);
            if (Number.isNaN(ts)) continue;

            // วันนี้ (BKK)
            if (ts >= startTs && ts < endTs) {
                sample_received++;
                if (q.toLowerCase() === "completed") tests_completed++;
                if (q.toLowerCase() === "in progress") results_interpret++;
            }

            // 7 วัน (BKK)
            const keyBkk = new Date(createdISO).toLocaleDateString("en-CA", {
                timeZone: TZ,
            });
            if (last7Map[keyBkk] !== undefined) {
                last7Map[keyBkk] += 1;
            }
        }
    } catch (err) {
        return { data: null, error: err };
    }

    // === แตกเป็นตัวแปร 7 ตัว ===
    // last7Days: [d6, d5, d4, d3, d2, d1, d0]
    //Mapping Data
    const sample_received_d6 = last7Map[last7Days[0]] ?? 0; // 6 วันก่อน
    const sample_received_d5 = last7Map[last7Days[1]] ?? 0;
    const sample_received_d4 = last7Map[last7Days[2]] ?? 0;
    const sample_received_d3 = last7Map[last7Days[3]] ?? 0;
    const sample_received_d2 = last7Map[last7Days[4]] ?? 0;
    const sample_received_d1 = last7Map[last7Days[5]] ?? 0; // เมื่อวาน
    const sample_received_d0 = last7Map[last7Days[6]] ?? 0; // วันนี้

    const ReportDashboard = {
        sample_received, // วันนี้รวม (ซ้ำกับ d0 ก็ได้ตามที่คุณใช้)
        tests_completed,
        results_interpret,
        submitted_inspection: submited_inspection,
        awaiting_inspection,
        inprogress,
        completed,
        awaiting_approve,

        // 7 ตัวแยกวัน
        sample_received_d6,
        sample_received_d5,
        sample_received_d4,
        sample_received_d3,
        sample_received_d2,
        sample_received_d1,
        sample_received_d0,
    };

    return { data: ReportDashboard, error: null };
}

export async function EditReportByID(id: any, body: any) {
    body.report_date = new Date().toISOString();
    body.updated_at = new Date().toISOString();
    console.log("EditReportByID called with:", { id, body });
    const { data, error } = await Update(db, "reports", id, body);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    if (error) {
        console.log(error);
        return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
}


export async function Pharm_verify(report_id: any, pharmacist_id: any) {
    const user  = await GetUserById(pharmacist_id);
    if(user[0].position.toLowerCase() !== 'pharmacy') {
        console.log("User is not pharmacist");
        return { data: null, error: new Error("User is not pharmacist") };
    }
    const body = {
        pharm_verify: true,
        pharmacist_id: pharmacist_id,
        updated_at: new Date().toISOString(),
    };
    console.log(body);
    const { data, error } = await Update(db, "reports", report_id, body);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + report_id) }; //for User
    }
    if (error) {
        console.log(error);
        return { data: null, error: error }; //for User
    }
    return { data: data[0], error: null };
}

export async function UpdateStatusReportById(id: any, statusupdate: any) {
    const { data, error } = await Update(db, "reports", id, statusupdate);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    if (error) {
        console.log(error);
        return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
}
