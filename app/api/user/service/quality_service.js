import { GetAll, GetById, Create, Update, Delete } from "@/lib/supabase/crud";
import { Quality, UpdateQuality, ResponseQuality, QualityCount } from "@/lib/model/Quality";
import { CreateClientSecret } from "@/lib/supabase/client";

const db = CreateClientSecret();

export async function GetAllQualityMetrics() {
    const { data, error } = await GetAll(db, "quality");
    if (error) {
        return { data: null, error: error }; //for User
    }
    console.log("GetAllQualityMetrics - data:", data); // for Debug
    console.log("GetAllQualityMetrics - error:", error); // for Debug
    if (!data) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }

    try {
        for (let i = 0; i < data.length; i++) {
            Quality[i] = {};
            Quality[i].id = data[i].id;
            Quality[i].tester_id = data[i].tester_id;
            Quality[i].tester_name = data[i].tester_name;
            Quality[i].quality = data[i].quality;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    return { data: Quality, error: null };
}

export async function UpdateQualityMetrics(id, row) {
    row.updated_at = new Date().toISOString();
    const { data, error } = await Update(db, "quality", id, row);
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        ResponseQuality.id = data.id;
        ResponseQuality.tester_id = data.tester_id;
        ResponseQuality.quality = data.quality;
        ResponseQuality.updated_at = data.updated_at;
        ResponseQuality.created_at = data.created_at;

    } catch (err) {
        return { data: null, error: err };
    }
    return { data: data, error: null };
}
export async function GetQualityById(id) {
    const { data, error } = await GetById(db, "quality", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    if (data.length === 0) {
        return { data: null, error: new Error("Data Not Found ") };
    }
    try {
        Quality[0].id = data[0].id;
        Quality[0].tester_id = data[0].tester_id;
        Quality[0].tester_name = data[0].tester_name;
        Quality[0].quality = data[0].quality;
    } catch (err) {
        return { data: null, error: err };
    }
    return { data: Quality, error: null };
}

export async function CreateQualityMetrics(row) {
    const { data, error } = await Create(db, "quality", row);
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        ResponseQuality.id = data.id;
        ResponseQuality.tester_id = data.tester_id;
        ResponseQuality.quality = data.quality;
        ResponseQuality.updated_at = data.updated_at;
        ResponseQuality.created_at = data.created_at;
    } catch (err) {
        return { data: null, error: err };
    }
    return { data: data, error: null };
}

export async function CreateQualityMetricsAndUpdateReport(row, reportId) {
    const { data, error } = await Create(db, "quality", row);
    if (error) {
        return { data: null, error: error }; //for User
    }
    console.log('Created quality metric:', data);
    try {
        ResponseQuality.id = data[0].id;
        ResponseQuality.tester_id = data[0].tester_id;
        ResponseQuality.quality = data[0].quality;
        ResponseQuality.updated_at = data[0].updated_at;
        ResponseQuality.created_at = data[0].created_at;
    } catch (err) {
        return { data: null, error: err };
    }
    console.log(ResponseQuality.id)
    let rowToUpdate = {
        quality_id: ResponseQuality.id
    };
    console.log('Updating report with ID:', reportId, 'to set quality_id to:', rowToUpdate);
    const reportResponse = await Update(db, "reports", reportId, rowToUpdate);
    if (reportResponse.error) {
        const { data: _, error: deleteError } = await Delete(db, "quality", data[0].id);
        if (deleteError) {
            console.error("Failed to rollback quality metric after report update failure:", deleteError);
        }
        return { data: null, error: reportResponse.error };
    }

    return { data: ResponseQuality, error: null };
}

export async function DeleteQualityMetrics(id) {
    const { data, error } = await Delete(db, "quality", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
}

export async function GetAllQualityMetricsPercent() {
    const { data, error } = await GetAll(db, "quality");
    let pass = 0;
    let fail = 0;
    let warning = 0;

    if (error) {
        return { data: null, error }; //for User
    }


    if (!data || data.length === 0) {
        return { data: { pass: 0, fail: 0, warning: 0, total: 0 }, error: null };
    }

    try {
        for (let i = 0; i < data.length; i++) {
            const q = String(data[i]?.quality ?? "").toLowerCase();

            if (q === "pass") {
                pass++;
            } else if (q === "failed") {
                fail++;
            } else if (q === "warning") {
                warning++;
            } else {
                // แค่ log แล้วทำงานต่อ ไม่ต้อง return
                console.warn("Quality type doesn't exist for item:", data[i]);
            }
        }
    } catch (err) {
        return { data: null, error: err };
    }
    const total = pass + fail + warning;
    if (total === 0) {
        return { data: { pass: 0, failed: 0, warning: 0, total: 0 }, error: null };
    }
    let percentpass = 0.0;
    let percentfailed = 0.0;
    let percentwarning = 0.0;
    percentpass = (pass * 100) / total;
    QualityCount.pass = percentpass.toFixed(2);
    percentwarning = (warning * 100) / total;
    QualityCount.warning = percentwarning.toFixed(2);
    percentfailed = (fail * 100) / total;
    QualityCount.failed = percentfailed.toFixed(2);
    QualityCount.total = total;
    return { data: QualityCount, error: null };
}