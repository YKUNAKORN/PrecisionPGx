import { Fridge} from '@/lib/model/Fridge';
import { CreateClientSecret } from "@/lib/supabase/client";
import { GetAll, GetById, Update, Create, Delete } from "@/lib/supabase/crud";

const db = CreateClientSecret();

export async function GetAllFridges() {
    const { data, error } = await GetAll(db, "fridge");
    if (error) {
        return { data: null, error: error }; //for User
    }
    if (!data) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    try {
        for (let i = 0; i < data.length; i++) {
            Fridge[i] = {};
            Fridge[i].id = data[i].id;
            Fridge[i].name = data[i].name;
            Fridge[i].capacity = data[i].capacity;
            Fridge[i].item = data[i].item;
            Fridge[i].remaining = data[i].remaining;
        }
    } catch (error) {
        return { data: null, error: error };
    }
    return { data: Fridge, error: null };
}

export async function GetFridgeById(id) {
    const { data, error } = await GetById(db, "fridge", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    if (data.length === 0) {
        return { data: null, error: new Error("Data Not Found ") };
    }
    try {
        Fridge[0] = {};
        Fridge[0].id = data[0].id;
        Fridge[0].name = data[0].name;
        Fridge[0].capacity = data[0].capacity;
        Fridge[0].item = data[0].item;
        Fridge[0].remaining = data[0].remaining;
    } catch (error) {
        console.error("Error processing Fridge data:", error);
        return { data: null, error: error };
    }
    console.log("Retrieved Fridge:", Fridge[0]);
    return { data: Fridge[0], error: null };
}

export async function UpdateFridge(id, row) {
    row.updated_at = new Date().toISOString();
    const { data, error } = await Update(db, "fridge", id, row);
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        Fridge[0] = {};
        Fridge[0].id = data.id;
        Fridge[0].name = data.name;
        Fridge[0].capacity = data.capacity;
        Fridge[0].item = data.item;
        Fridge[0].remaining = data.remaining;
    } catch (err) {
        return { data: null, error: err };
    }
    return { data: Fridge[0], error: null };
}

export async function IncreaseFridgeItem(id, updated_data) {
    const { data, error } = await GetFridgeById(id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    data.item += updated_data.item;
    let remaining = 0;
    remaining = data.capacity - data.item;
    data.remaining = remaining;
    if (data.remaining < 0) {
        return { data: null, error: new Error("Fridge Capacity Exceeded") }; //for User
    }
    console.log("Updated Fridge Remaining:", data);
    const { data: dataUpdate, error: updateError } = await Update(db, "fridge", id, data);
    if (updateError) {
        return { data: null, error: updateError }; //for User
    }
    console.log("Fridge Data After Update from DB:", dataUpdate);
    return { data: dataUpdate, error: null };
}
    
export async function DecreaseFridgeItem(id, updated_data) {
    const { data, error } = await GetFridgeById(id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    data.item -= updated_data.item;
    let remaining = 0;
    remaining = data.remaining + updated_data.item;
    data.remaining = remaining;
    console.log("Updated Fridge Remaining:", data);
    const { data: dataUpdate, error: updateError } = await Update(db, "fridge", id, data);
    if (updateError) {
        return { data: null, error: updateError }; //for User
    }
    console.log("Fridge Data After Update from DB:", dataUpdate);
    return { data: dataUpdate, error: null };
}


export async function DeleteFridge(id) {
    const { data, error } = await Delete(db, "fridge", id);
    if (error) {
        return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
}

export async function CreateFridge(row) {
    const { data, error } = await Create(db, "fridge", row);
    if (error) {
        return { data: null, error: error };
    }
    return { data: data, error: null };
}