import { Qualityper } from "./type";
import { queryOptions } from "@tanstack/react-query";

export async function getQualityPec(): Promise<Qualityper> {
  const res = await fetch(`/api/user/quality/percent`);
  if (!res.ok) throw new Error("Failed to fetch quality");
  const body = await res.json();
  return body.data;
}

export const createQualityQueryOptions = {
  pec: () =>
    queryOptions({
          queryKey: ["QualityPec"],
          queryFn: getQualityPec,
        }),
};