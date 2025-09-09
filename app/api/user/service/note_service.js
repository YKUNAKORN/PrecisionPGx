import { Create, GetAll, GetById, Update, Delete } from "../../../../lib/supabase/crud";
import { Note } from "../../../../lib/model/Note";
import { ResponseModel } from "../../../../lib/model/Response";
import { NextResponse } from "next/server";
import {  CreateClientSecret } from "../../../../lib/supabase/client";


const db = CreateClientSecret();

export async function CreateNote(row) {
    const data = await Create(db, "note", row);
    if (!data) {
        ResponseModel.status = "404";
        ResponseModel.message = "error data not found";
        console.error("error data not found"); //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }); //for User
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        ResponseModel.status = "500";
        ResponseModel.message = "Failed to parse data" + err;
        console.error("Failed to parse data"); //for Debug
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    return Note;
}

export async function GetAllNotes() {
    const data = await GetAll(db, "note");
    if (!data) {
        ResponseModel.status = "400";
        ResponseModel.message = "error data not found";
        console.error("error data not found"); //for Debug
        return NextResponse.json(ResponseModel, { status: 400 }); //for User
    }
    try {
        for (let i = 0; i < data.length; i++) {
            Note[i] = {};
            Note[i].id = data[i].id;
            Note[i].method = data[i].method;
            Note[i].created_at = data[i].created_at;
        }
    } catch (err) {
        ResponseModel.status = "500";
        ResponseModel.message = "Failed to parse data" + err;
        console.error("Failed to parse data"); //for Debug
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    return Note;
}

export async function GetNoteById(query) {
    const data = await GetById(db, "note", query);
    if (!data) {
        ResponseModel.status = "404";
        ResponseModel.message = "error data not found";
        console.error("error data not found: No Current Id"); //for Debug
        return NextResponse.json(ResponseModel, { status: 404 }); //for User
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        ResponseModel.status = "500";
        ResponseModel.message = "Failed to parse data" + err;
        console.error("Failed to parse data"); //for Debug
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    return Note;
}
export async function UpdateNoteByID(id, row) {
    const data = await Update(db, "note", id, row);
    if (!data) {
        ResponseModel.status = 404;
        ResponseModel.message = "data not found";
        console.error("error data not found");
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    try {
        for (let i = 0; i < data.length; i++) {
            Note[i] = {};
            Note[i].id = data[i].id;
            Note[i].method = data[i].method;
            Note[i].created_at = data[i].created_at;
        }
    } catch (err) {
        ResponseModel.status = "500";
        ResponseModel.message = "Failed to parse data" + err;
        console.error("Failed to parse data"); //for Debug
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    return Note;
}
export async function DeleteNoteByID(id) {
    const data = await Delete(db, "note", id);
    if (!data) {
        ResponseModel.status = 404;
        ResponseModel.message = "data not found";
        console.error("error data not found");
        return NextResponse.json(ResponseModel, { status: 404 });
    }
    try {
        Note[0].id = data[0].id;
        Note[0].method = data[0].method;
        Note[0].created_at = data[0].created_at;
    } catch (err) {
        ResponseModel.status = "500";
        ResponseModel.message = "Failed to parse data" + err;
        console.error("Failed to parse data"); //for Debug
        return NextResponse.json(ResponseModel, { status: 500 }); //for User
    }
    consolee.log(data)
    return data;
}
