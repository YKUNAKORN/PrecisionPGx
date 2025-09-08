import { ResponseModel } from "../model/Response";
import { NextResponse } from "next/server";

export async function Create(supabase, tableName, rows) {
  const { data, error } = await supabase.from(tableName).insert(rows).select();
  if (error) {
    ResponseModel.status = "500";
    ResponseModel.message = "Create Data Failed" + error.message;
    console.error("Create Data Failed" + error.message); //for Debug
    return NextResponse.json(ResponseModel, { status: 500 }); //for User
  }
  return data;
}

export async function GetAll(supabase, tableName) {
  const { data, error } = await supabase.from(tableName).select();
  if (error) {
    ResponseModel.status = "404";
    ResponseModel.message = "Data Not Found" + error.message;
    console.error("Data Not Found" + error.message); //for Debug
    return NextResponse.json(ResponseModel, { status: 404 }); //for User
  }
  return data;
}

export async function GetById(supabase, tableName, id) {
  const { data, error } = await supabase.from(tableName).select().eq("id", id); // Filter by the 'id' column matching the provided ID
  if (error) {
    ResponseModel.status = "404";
    ResponseModel.message = "Data Not Found" + error.message;
    console.error("Data Not Found" + error.message); //for Debug
    return NextResponse.json(ResponseModel, { status: 404 }); //for User
  }
  return data;
}

export async function Update(supabase, tableName, id, row) {
  const { data, error } = await supabase.from(tableName).update(row).eq("id", id).select();
  console.log(error)
  if (error) {
    ResponseModel.status = "404";
    ResponseModel.message = "Data Not Found" + error.message;
    console.error("Data Not Found" + error.message); //for Debug
    return NextResponse.json(ResponseModel, { status: 404 }); //for User
  }
  return data;
}

export async function Delete(supabase, tableName, id){
     const { data, error }  = await supabase.from(tableName).delete().eq('id', id).select()
     if(error){
        ResponseModel.status = "500"
        ResponseModel.message = "Delete Failed"+ error.message
        console.error(error)
        return NextResponse.json(ResponseModel, { status: 500 })
     }
     return data;
}
export async function UpdateRow(db, table_name, id, updatedFields) {
    try {
        const { data, error } = await db.from(table_name).update(updatedFields).eq("id", id).select();
        if (error) {
            console.error("UpdateRow error:", error.message);
            throw new Error("Error updating row");
        }
        return data;
    } catch (error) {
        console.error("Error updating row:", error);
        throw new Error("Error updating row");
    }
}