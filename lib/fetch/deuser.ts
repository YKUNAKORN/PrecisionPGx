export async function deleteUserById(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to delete user:", res.statusText);
      return false;
    }

    console.log("User deleted successfully");
    return true;
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}