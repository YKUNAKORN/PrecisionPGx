import { Ward } from "./type";
import { queryOptions } from "@tanstack/react-query";

// ✅ ดึงข้อมูล Fridge ทั้งหมดจาก API
export async function getWard(): Promise<Ward> {
  const res = await fetch(`/api/user/ward`);
  if (!res.ok) throw new Error("Failed to fetch ward");

  const body = await res.json();

    return body.data;
}

// ✅ React Query Options (สำหรับ useQuery)
export const createWardQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["Wards"],
      queryFn: getWard,
    }),
};