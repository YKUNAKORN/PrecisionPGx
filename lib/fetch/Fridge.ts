import { Fridge } from "./type";
import { queryOptions } from "@tanstack/react-query";

// ✅ ดึงข้อมูล Fridge ทั้งหมดจาก API
export async function getFridges(): Promise<Fridge[]> {
  const res = await fetch(`/api/user/fridge`);
  if (!res.ok) throw new Error("Failed to fetch fridge list");

  const body = await res.json();

  // ตรวจสอบว่ามี field data และเป็น array หรือไม่
  const data: Fridge[] = Array.isArray(body.data) ? body.data : [];

  // ✅ กรองเฉพาะตู้เย็นที่ยังมีช่องว่างเหลือ
  const filtered = data.filter((fridge) => fridge.remaining > 0);

  return filtered;
}

// ✅ React Query Options (สำหรับ useQuery)
export const createFridgeQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["Fridges"],
      queryFn: getFridges,
    }),
};
