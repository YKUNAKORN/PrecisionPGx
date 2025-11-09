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

export async function postPatient(data: Patient) {
  const res = await fetch(`/api/user/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post patient");
  return res.json();
}


export const createPatientQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["patients"],
      queryFn: getPatients,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["patient", id],
      queryFn: () => getPatient(id),
      staleTime: 60_000,
      enabled: !!id,
    }),
};

export const mutatePatientQueryOptions = {
  put: () => ({
    mutationFn: async (data: Patient) => await putPatient(data),
  }),

  delete: () => ({
    mutationFn: async (id: string) => await deletePatient(id),
  }),

  post: ({
    mutationFn: async (data: Patient) => await postPatient(data),
  }),
};

