export type UpdateUserPayload = {
  fullname?: string;
  position?: string;
  phone?: string;
  license_number?: string;
};

export async function updateUserById(id: string, payload: UpdateUserPayload) {
  // ชี้ endpoint ให้ตรงกับโครงสร้างโฟลเดอร์ปัจจุบัน: /api/user/user/[id]
  const url = `/api/user/user/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
    cache: "no-store",
    // ถ้า API ของคุณต้องใช้ session/cookie ให้เปิดบรรทัดนี้
    // credentials: "include",
  });

  const raw = await res.text();
  let json: any = null;
  try { json = raw ? JSON.parse(raw) : null; } catch { json = raw; }

  if (!res.ok) {
    const msg =
      (typeof json === "object" && (json?.message || json?.error)) ||
      (typeof json === "string" && json) ||
      res.statusText;
    console.error("updateUserById failed:", { status: res.status, url, payload, serverBody: json });
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${msg}`);
  }

  // route.js ของคุณตอบเป็น ResponseModel { status, message, data }
  return (typeof json === "object" && "data" in json) ? json.data : json;
}