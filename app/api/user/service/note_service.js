import { Create, GetAll, GetById, Update, Delete } from "@/lib/supabase/crud";
import { Note } from "@/lib/model/Note";
import { CreateClientSecret } from "@/lib/supabase/client";

const db = CreateClientSecret();

export async function CreateNote(row) {
    const { data, error } = await Create(db, "note", row);
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: Note, error: null };
}

export async function GetAllNotes() {
    const { data, error } = await GetAll(db, "note");
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found ") };
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        for (let i = 0; i < data.length; i++) {
            Note[i] = {};
            Note[i].id = data[i].id;
            Note[i].method = data[i].method;
            Note[i].created_at = data[i].created_at;
        }
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: Note, error: null };
}

export async function GetNoteById(id) {
    const { data, error } = await GetById(db, "note", id);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) };
    }
    if (error) {
        return { data: null, error: error, status: 500 }; //for User
    }
    try {
        // Create a new array with only the single note data
        const noteResult = [{
            id: data[0].id,
            method: data[0].method,
            created_at: data[0].created_at
        }];
        return { data: noteResult, error: null };
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err, status: 500 };
    }
}

export async function UpdateNoteByID(id, row) {
    const { data, error } = await Update(db, "note", id, row);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: Note, error: null };
}

export async function DeleteNoteByID(id) {
    const { data, error } = await Delete(db, "note", id);
    if (data.length === 0) {
        return { data: [], error: new Error("Data Not Found : " + id) }; //for User
    }
    if (error) {
        return { data: null, error: error }; //for User
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        console.error("Failed to parse data" + err); //for Debug
        return { data: null, error: "Failed to parse data" + err };
    }
    return { data: Note, error: null };
}