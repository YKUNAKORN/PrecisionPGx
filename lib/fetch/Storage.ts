import { queryOptions } from "@tanstack/react-query";
import { Storage } from "./type";

export type CreateStorageDTO = {
  patient_id: string;
  location: string;
  specimen_id: string;
  status: string;       // เช่น "stored"
};

export async function getStorages(): Promise<Storage[]> {
  const res = await fetch(`/api/user/storage`);
  if (!res.ok) throw new Error("Failed to fetch Storage");
  return res.json();
}

export async function getStorage(id: string): Promise<Storage> {
  const res = await fetch(`/api/user/storage/${id}`);

  // ตรวจสอบว่า request สำเร็จไหม
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to fetch storage: ${msg || res.statusText}`);
  }

  // ✅ manual unwrap
  const body = await res.json();

  // บาง API อาจตอบเป็น { status, message, data: {...} }
  if (body && typeof body === "object" && "data" in body) {
    return body.data as Storage;
  }

  // บางกรณีอาจส่ง object ตรง ๆ
  return body as Storage;
}


export async function putStorage(id: string, data: CreateStorageDTO ) {
  const res = await fetch(`/api/user/storage/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to put Storage");
  return res.json();
}

export async function deleteStorage(id: string) {
  const res = await fetch(`/api/user/storage/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete Storage");
  return res.json();
}

export async function postStorage(dto: CreateStorageDTO) {
  const res = await fetch(`/api/user/storage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to post Storage");
  return res.json();
}

export const createStorageQueryOptions = {
    all: () =>
    queryOptions({
      queryKey: ["storages"],
      queryFn: getStorages,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["storage", id],
      queryFn: () => getStorage(id),
      staleTime: 60_000,
      enabled: !!id, 
    }),
  }

export const mutateStorageQueryOptions = {
   put: (id: string) => ({ mutationFn: async (data: CreateStorageDTO ) => await putStorage(id, data) }),
  delete: ({
      mutationFn: async (id: string) => await deleteStorage(id),
    }),
  post: () => ({ mutationFn: async (dto: CreateStorageDTO) => await postStorage(dto) }),
  };