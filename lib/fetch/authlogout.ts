// src/lib/fetch/auth.ts
export async function logout(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST", // หรือ "GET" แล้วแต่ฝั่ง API
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Logout failed:", res.statusText);
      return false;
    }

    console.log("Logged out successfully");
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
}