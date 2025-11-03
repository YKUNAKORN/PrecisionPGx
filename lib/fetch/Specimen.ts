import { queryOptions } from "@tanstack/react-query";
import { Specimen } from "./type";


export async function getSpecimens(): Promise<Specimen[]> {
  const res = await fetch(`/api/user/specimen`);
  if (!res.ok) throw new Error("Failed to fetch specimen");
  return res.json();
}

export async function getSpecimen(id :string): Promise<Specimen> {
  const res = await fetch(`/api/user/specimen/${id}`);
  if (!res.ok) throw new Error("Failed to fetch specimen");
  return res.json();
}

export async function putSpecimen(data: Specimen) {
  const res = await fetch(`/api/user/specimen`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to put specimen");
  return res.json();
}

export async function deleteSpecimen(id: string) {
  const res = await fetch(`/api/user/specimen/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete Specimen");
  return res.json();
}

export async function postSpecimen(data: Specimen) {
  const res = await fetch(`/api/user/specimen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post Specimen");
  return res.json();
}

export const createSpecimenQueryOptions = {
    all: () =>
    queryOptions({
      queryKey: ["specimen"],
      queryFn: getSpecimens,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["specimens", id],
      queryFn: () => getSpecimen(id),
      staleTime: 60_000,
      enabled: !!id, 
    }),
  }

export const mutateSpecimenQueryOptions = {
  put: (data: Specimen) =>
    queryOptions({
      queryKey: ["specimens", data],
      queryFn: () => putSpecimen(data),
    }),
  delete: (id: string) =>
    queryOptions({
      queryKey: ["specimens", id],
      queryFn: () => deleteSpecimen(id),
    }),
  post: (data: Specimen) =>
    queryOptions({
      queryKey: ["specimens", data],
      queryFn: () => postSpecimen(data),
    }),
  };