import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Create } from "@/lib/supabase/crud";
import { CreateClientPublic } from "@/lib/supabase/client";

interface InsertUserModelType {
  id?: string
  email: string
  position: string
  [key: string]: any
}

interface SignUpResult {
  user: any
  error: any
}

export async function SignUp(InsertUserModel: InsertUserModelType, password: string): Promise<SignUpResult | { data: any; error: any }> {
  try {
    const supabase = await createSupabaseServerClient();
    const db = CreateClientPublic();
    const { data, error } = await supabase.auth.signUp({
      email: InsertUserModel.email,
      password,
      position: InsertUserModel.position,
      options: {
        emailRedirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      console.error("SignUp failed: ", error);
      return { user: null, error: error };
    }
    InsertUserModel.id = data.user!.id;
    const Profile = Create(db, "user", InsertUserModel)
    return Profile
  } catch (error: any) {
    console.error("SignUp failed: Internal server error: ", error.message);
    return { user: null, error: "Internal server error: " + error.message };
  }
}