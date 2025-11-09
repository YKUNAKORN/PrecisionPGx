import { Doctor } from "./type";
import { queryOptions } from "@tanstack/react-query";

export async function getdoctors(): Promise<Doctor> {
  const res = await fetch(`/api/user/user/doctor`);
  if (!res.ok) throw new Error("Failed to fetch doctor");
  const body = await res.json();
  return body.data;
}

export const createDoctorQueryOptions = {
  all: () =>
    queryOptions({
          queryKey: ["Doctors"],
          queryFn: getdoctors,
        }),
};