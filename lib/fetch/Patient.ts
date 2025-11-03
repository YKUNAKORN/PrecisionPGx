import { Patient } from "./type";
import { queryOptions } from "@tanstack/react-query";

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`/api/user/patient`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}


export async function getPatient(id: string): Promise<Patient> {
  const res = await fetch(`/api/user/patient/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function putPatient(data: Patient) {
  const res = await fetch(`/api/user/patient`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to put patient");
  return res.json();
}

export async function deletePatient(id: string) {
  const res = await fetch(`/api/user/patient/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete patient");
  return res.json();
}

export const createPatientQueryOptions = {
  all: () =>
    queryOptions<Patient[]>({
      queryKey: ["patients"],
      queryFn: getPatients,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions<Patient>({
      queryKey: ["patient", id],
      queryFn: () => getPatient(id),
      staleTime: 60_000,
      enabled: !!id, 
    }),
};

export const mutatePatientQueryOptions = {
  put: (data: Patient) =>
    queryOptions<Patient>({
      queryKey: ["putPatient", data],
      queryFn: () => putPatient(data),
    }),
  delete: (id: string) =>
    queryOptions<Patient>({
      queryKey: ["deletePatient", id],
      queryFn: () => deletePatient(id),
    }),
};  