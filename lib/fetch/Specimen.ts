import { queryOptions } from "@tanstack/react-query";
import { Specimen } from "./type";

export type CreateSpecimenDTO = {
  name: string;            // เช่น "blood" | "saliva" | ...
  expire_in: string;       // "YYYY-MM-DD"
};

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

export async function postSpecimen(dto: CreateSpecimenDTO) {
  const res = await fetch(`/api/user/specimen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to post Specimen");
  return res.json(); // คาดหวัง { status, message, data: { id?... } } หรือรูปแบบใกล้เคียง
}

export const createSpecimenQueryOptions = {
    all: () =>
    queryOptions({
      queryKey: ["specimens"],
      queryFn: getSpecimens,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["specimen", id],
      queryFn: () => getSpecimen(id),
      staleTime: 60_000,
      enabled: !!id, 
    }),
  }

export const mutateSpecimenQueryOptions = {
  put: () => ({
      mutationFn: async (data: Specimen) => await putSpecimen(data),
    }),
  delete: ({
      mutationFn: async (id: string) => await deleteSpecimen(id),
    }),
  post: () => ({ mutationFn: async (dto: CreateSpecimenDTO) => await postSpecimen(dto),
    }),
  };