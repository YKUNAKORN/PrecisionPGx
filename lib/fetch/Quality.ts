import { Quality } from "./type";
import { queryOptions } from "@tanstack/react-query";

export async function getQualityPec(): Promise<Quality> {
  const res = await fetch(`/api/user/quality/percent`);
  if (!res.ok) throw new Error("Failed to fetch quality");
  return res.json();
}

export const createQualityQueryOptions = {
  pec: 
    queryOptions({
          queryKey: ["QualityPec"],
          queryFn: getQualityPec,
        }),
};