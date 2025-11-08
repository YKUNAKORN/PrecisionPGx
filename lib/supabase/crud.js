export async function Create(supabase, tableName, rows) {
  try {
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Insert Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetAll(supabase, tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error("GetAll Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetById(supabase, tableName, id) {
  try {
    const { data, error } = await supabase.from(tableName).select().eq("id", id); // Filter by the 'id' column matching the provided ID
    if (error) {
      console.error("GetById Error: " + error.message);
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetById Error: " + err.message);
    return { data: null, error: err }; //for User
  }
}

export async function Update(supabase, tableName, id, row) {
  try {
    const { data, error } = await supabase.from(tableName).update(row).eq("id", id).select();
    console.log("Update Data:", data); //for Debug
    if (error) {
      console.error("Update Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Update Error: " + err.message);
    return { data: null, error: err }; //for User
  }
}

export async function Delete(supabase, tableName, id) {
  try {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select()
    if (error) {
      console.error("Delete Failed: " + error)
      return { data: null, error: error };
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("Delete Error: " + err.message);
    return { data: null, error: err }; //for User
  }
}

export async function GetJoinAll(supabase, tableName, selectFields) {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields);
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}

export async function GetJoinWithId(supabase, tableName, id, selectFields) {
  try {
    const { data, error } = await supabase.from(tableName).select(selectFields).eq("id", id);
    if (error) {
      console.error("Insert Error: " + error.message); //for Debug
      return { data: null, error: error }; //for User
    }
    return { data: data, error: null };
  } catch (err) {
    console.error("GetAll Error: " + err.message); //for Debug
    return { data: null, error: err }; //for User
  }
}
