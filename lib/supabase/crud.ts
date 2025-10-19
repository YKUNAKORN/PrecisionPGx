import type { SupabaseClient } from '@supabase/supabase-js'

export interface CrudResponse<T = any> {
  data: T | null
  error: any
}

export async function Create<T = any>(supabase: SupabaseClient, tableName: string, rows: any): Promise<CrudResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Insert Error: " + (err as Error).message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetAll<T = any>(supabase: SupabaseClient, tableName: string): Promise<CrudResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetAll Error: " + (err as Error).message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetById<T = any>(supabase: SupabaseClient, tableName: string, id: string): Promise<CrudResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select().eq("id", id); // Filter by the 'id' column matching the provided ID
    if (error) {
      console.error("GetById Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetById Error: " + (err as Error).message);
    return { data: null, error: err }; //for User
  }
}

export async function Update<T = any>(supabase: SupabaseClient, tableName: string, id: string, row: any): Promise<CrudResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).update(row).eq("id", id).select();
    console.log(error)
    if (error) {
      console.error("Update Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Update Error: " + (err as Error).message);
    return { data: null, error: err }; //for User
  }
}

export async function Delete<T = any>(supabase: SupabaseClient, tableName: string, id: string): Promise<CrudResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select()
    if (error) {
      console.error("Delete Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Delete Error: " + (err as Error).message);
    return { data: null, error: err }; //for User
  }
}
