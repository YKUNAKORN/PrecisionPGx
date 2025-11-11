import { UpdateUser } from "./model/User";

export async function updateUserById(id: string,): Promise<UpdateUser | null> {
  try {
    const response = await fetch(`/api/user/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Updated user:", data);

    // ✅ ตรวจว่ามี data หรือไม่
    if (!data || !data.data) {
      console.error("No updated user data found in response");
      return null;
    }

    return data.data[0] as UpdateUser;
  } catch (error) {
    console.error("There was a problem updating the user:", error);
    return null;
  }
}