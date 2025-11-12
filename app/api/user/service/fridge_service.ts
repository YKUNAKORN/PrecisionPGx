import { Fridge, ReportCapacity} from '@/lib/model/Fridge';
import { CreateClientSecret } from "@/lib/supabase/client";
import { GetAll, GetById, Update, Create, Delete } from "@/lib/supabase/crud";

const db = CreateClientSecret();

export async function GetAllFridges() {
    const { data, error } = await GetAll(db, "fridge");
    if (error) {
        return { data: null, error: error };
    }
    if (!data) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    try {
        for (let i = 0; i < data.length; i++) {
            (Fridge as any)[i] = {};
            (Fridge as any)[i].id = data[i].id;
            (Fridge as any)[i].name = data[i].name;
            (Fridge as any)[i].capacity = data[i].capacity;
            (Fridge as any)[i].item = data[i].item;
            (Fridge as any)[i].remaining = data[i].remaining;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    return { data: Fridge, error: null };
}

export async function GetFridgeById(id: string) {
    const { data, error } = await GetById(db, "fridge", id);
    if (error) {
        return { data: null, error: error };
    }
    if (data.length === 0) {
        return { data: null, error: new Error("Data Not Found ") };
    }
    try {
        (Fridge as any)[0] = {};
        (Fridge as any)[0].id = data[0].id;
        (Fridge as any)[0].name = data[0].name;
        (Fridge as any)[0].capacity = data[0].capacity;
        (Fridge as any)[0].item = data[0].item;
        (Fridge as any)[0].remaining = data[0].remaining;
    } catch (error) {
        console.error("Error processing Fridge data:", error);
        return { data: null, error: error };
    }
    console.log("Retrieved Fridge:", (Fridge as any)[0]);
    return { data: (Fridge as any)[0], error: null };
}

export async function UpdateFridge(id: string, row: any) {
    row.updated_at = new Date().toISOString();
    const { data, error } = await Update(db, "fridge", id, row);
    if (error) {
        return { data: null, error: error };
    }
    try {
        (Fridge as any)[0] = {};
        (Fridge as any)[0].id = data[0].id;
        (Fridge as any)[0].name = data[0].name;
        (Fridge as any)[0].capacity = data[0].capacity;
        (Fridge as any)[0].item = data[0].item;
        (Fridge as any)[0].remaining = data[0].remaining;
    } catch (err) {
        return { data: null, error: err };
    }
    console.log("Updated Fridge:", Fridge);

    return { data: Fridge, error: null };
}

export async function IncreaseFridgeItem(id: string, updated_data: any) {
    const { data, error } = await GetFridgeById(id);
    if (error) {
        return { data: null, error: error };
    }
    data.item += updated_data.item;
    let remaining = 0;
    remaining = data.capacity - data.item;
    data.remaining = remaining;
    if (data.remaining < 0) {
        return { data: null, error: new Error("Fridge Capacity Exceeded") };
    }
    console.log("Updated Fridge Remaining:", data);
    const { data: dataUpdate, error: updateError } = await Update(db, "fridge", id, data);
    if (updateError) {
        return { data: null, error: updateError };
    }
    console.log("Fridge Data After Update from DB:", dataUpdate);
    return { data: dataUpdate, error: null };
}
    
export async function DecreaseFridgeItem(id: string, updated_data: any) {
    const { data, error } = await GetFridgeById(id);
    if (error) {
        return { data: null, error: error };
    }
    data.item -= updated_data.item;
    let remaining = 0;
    remaining = data.remaining + updated_data.item;
    data.remaining = remaining;
    console.log("Updated Fridge Remaining:", data);
    const { data: dataUpdate, error: updateError } = await Update(db, "fridge", id, data);
    if (updateError) {
        return { data: null, error: updateError };
    }
    console.log("Fridge Data After Update from DB:", dataUpdate);
    return { data: dataUpdate, error: null };
}


export async function DeleteFridge(id: string) {
    const { data, error } = await Delete(db, "fridge", id);
    if (error) {
        return { data: null, error: error };
    }
    return { data: data, error: null };
}

export async function CreateFridge(row: any) {
    const { data, error } = await Create(db, "fridge", row);
    if (error) {
        return { data: null, error: error };
    }
    return { data: data, error: null };
}

export async function CalculateFridge() {
    const { data, error } = await GetAllFridges();
    if (error) {
        return { data: null, error: error };
    }
    let capacity = 0;
    try {
        for (let i = 0; i < data.length; i++) {
            capacity += data[i].capacity;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    let item = 0;
    try {
        for (let i = 0; i < data.length; i++) {
            item += data[i].item;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    let remaining = 0;
    try {
        for (let i = 0; i < data.length; i++) {
            remaining += data[i].remaining;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    let PercentRemaining = 0;
    try {
        PercentRemaining = (item / capacity) * 100;
    } catch (error) {
        return { data: null, error: error };
    }
        (ReportCapacity as any).PercentRemaining = PercentRemaining;
        (ReportCapacity as any).Remaining = remaining;
        (ReportCapacity as any).Item = item;
        (ReportCapacity as any).Capacity = capacity;
        return { data: ReportCapacity, error: null };
}
