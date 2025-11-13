import { Dashboard } from "./type";
import { queryOptions } from "@tanstack/react-query";

// ✅ ดึงข้อมูล Fridge ทั้งหมดจาก API
export async function getDashboard(): Promise<Dashboard> {
  const res = await fetch(`/api/user/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch fridge list");

  const body = await res.json();

    return body.data;
}

// ✅ React Query Options (สำหรับ useQuery)
export const createDashboardQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["Dashboard"],
      queryFn: getDashboard,
    }),
};