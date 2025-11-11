import { SupabaseClient } from '@supabase/supabase-js'

interface DbResult<T> {
  data: T | null
  error: any
}

export async function Create<T = any>(supabase: SupabaseClient, tableName: string, rows: any): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("Insert Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetAll<T = any>(supabase: SupabaseClient, tableName: string): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error("GetAll Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetById<T = any>(supabase: SupabaseClient, tableName: string, id: string): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select().eq("id", id); // Filter by the 'id' column matching the provided ID
    if (error) {
      console.error("GetById Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetById Error: " + err.message);
    return { data: null, error: err }; //for User
  }
}

export async function Update<T = any>(supabase: SupabaseClient, tableName: string, id: string, row: any): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).update(row).eq("id", id).select();
    if (error) {
      console.error("Update Failed:", JSON.stringify(error, null, 2));
      console.error("Update Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { data: null, error: error };
    }
    if (!data || data.length === 0) {
      console.error("Update returned empty data for ID:", id);
      return { data: [], error: new Error("No data returned from update") };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("Update Error: " + err.message);
    return { data: [], error: err }; //for User
  }
}

export async function Delete<T = any>(supabase: SupabaseClient, tableName: string, id: string): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select()
    if (error) {
      console.error("Delete Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("Delete Error: " + err.message);
    return { data: null, error: err }; //for User
  }
}

export async function GetJoinAll<T = any>(supabase: SupabaseClient, tableName: string, selectFields: string): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields);
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetJoinWithId<T = any>(supabase: SupabaseClient, tableName: string, id: string, selectFields: string): Promise<DbResult<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields).eq("id", id);
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}
