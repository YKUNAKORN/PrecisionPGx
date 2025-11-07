import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Generic response type for CRUD operations
 */
export interface CRUDResponse<T = any> {
  data: T | null;
  error: Error | null;
}

/**
 * Create a new record in the specified table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @param rows - Data to insert (single object or array of objects)
 * @returns Promise with data and error
 */
export async function Create<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  rows: any
): Promise<CRUDResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error as unknown as Error }; //for User
    }
    return { data: data as T[], error: null };
  } catch (err) {
    console.error("Insert Error: " + (err as Error).message); //for Debug
    return { data: null, error: err as Error }; //for User
  }
}

/**
 * Get all records from the specified table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @returns Promise with data and error
 */
export async function GetAll<T = any>(
  supabase: SupabaseClient,
  tableName: string
): Promise<CRUDResponse<T[]>> {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error("GetAll Error: " + error.message); //for Debug
      return { data: null, error: error as unknown as Error }; //for User
    }
    return { data: data as T[], error: null };
  } catch (err) {
    console.error("GetAll Error: " + (err as Error).message); //for Debug
    return { data: null, error: err as Error }; //for User
  }
}

/**
 * Get a record by ID from the specified table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @param id - ID of the record to retrieve
 * @returns Promise with data and error
 */
export async function GetById<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  id: string | number
): Promise<CRUDResponse<T[]>> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq("id", id); // Filter by the 'id' column matching the provided ID
    if (error) {
      console.error("GetById Error: " + error.message);
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as T[], error: null };
  } catch (err) {
    console.error("GetById Error: " + (err as Error).message);
    return { data: null, error: err as Error }; //for User
  }
}

/**
 * Update a record by ID in the specified table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @param id - ID of the record to update
 * @param row - Data to update
 * @returns Promise with data and error
 */
export async function Update<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  id: string | number,
  row: Partial<T>
): Promise<CRUDResponse<T[]>> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(row)
      .eq("id", id)
      .select();
    if (error) {
      console.error("Update Failed: " + error);
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as T[], error: null };
  } catch (err) {
    console.error("Update Error: " + (err as Error).message);
    return { data: null, error: err as Error }; //for User
  }
}

/**
 * Delete a record by ID from the specified table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table
 * @param id - ID of the record to delete
 * @returns Promise with data and error
 */
export async function Delete<T = any>(
  supabase: SupabaseClient,
  tableName: string,
  id: string | number
): Promise<CRUDResponse<T[]>> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      console.error("Delete Failed: " + error);
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as T[], error: null };
  } catch (err) {
    console.error("Delete Error: " + (err as Error).message);
    return { data: null, error: err as Error }; //for User
  }
}
