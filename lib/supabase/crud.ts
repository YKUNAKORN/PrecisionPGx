import { SupabaseClient } from '@supabase/supabase-js'

interface CrudResult {
  data: any | null
  error: any | null
}

export async function Create(supabase: SupabaseClient, tableName: string, rows: any): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    if (error) {
      console.error("Insert Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("Insert Error: " + err.message);
    return { data: null, error: err };
  }
}

export async function GetAll(supabase: SupabaseClient, tableName: string): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error("GetAll Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message);
    return { data: null, error: err };
  }
}

export async function GetById(supabase: SupabaseClient, tableName: string, id: string): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).select().eq("id", id);
    if (error) {
      console.error("GetById Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetById Error: " + err.message);
    return { data: null, error: err };
  }
}

export async function Update(supabase: SupabaseClient, tableName: string, id: string, row: any): Promise<CrudResult> {
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
    return { data: [], error: err };
  }
}

export async function Delete(supabase: SupabaseClient, tableName: string, id: string): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select()
    if (error) {
      console.error("Delete Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("Delete Error: " + err.message);
    return { data: null, error: err };
  }
}

export async function GetJoinAll(supabase: SupabaseClient, tableName: string, selectFields: string): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields);
    if (error) {
      console.error("Insert Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message);
    return { data: null, error: err };
  }
}

export async function GetJoinWithId(supabase: SupabaseClient, tableName: string, id: string, selectFields: string): Promise<CrudResult> {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields).eq("id", id);
    if (error) {
      console.error("Insert Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err: any) {
    console.error("GetAll Error: " + err.message);
    return { data: null, error: err };
  }
}
