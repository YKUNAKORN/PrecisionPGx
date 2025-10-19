import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Create } from "@/lib/supabase/crud";
import { CreateClientPublic } from "@/lib/supabase/client";
import type { InsertUserModel } from "@/lib/model/User";

export async function SignUp(InsertUserModel: InsertUserModel, password: string): Promise<any> {
  try {
    const supabase = await createSupabaseServerClient();
    const db = CreateClientPublic();
    const { data, error } = await supabase.auth.signUp({
      email: InsertUserModel.email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/auth/callback`,
        data: {
          position: InsertUserModel.position
        }
      },
    });

    if (error) {
      console.error("SignUp failed: ", error);
      return { user: null, error: error };
    }
    InsertUserModel.id = data.user!.id;
    const Profile = Create(db, "user", InsertUserModel)
    return Profile
  } catch (error) {
    console.error("SignUp failed: Internal server error: ", (error as Error).message);
    return { user: null, error: "Internal server error: " + (error as Error).message };
  }
}
