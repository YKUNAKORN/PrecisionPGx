import { queryOptions } from "@tanstack/react-query";
import { Storage } from "./type";


export async function getStorages(): Promise<Storage[]> {
  const res = await fetch(`/api/user/storage`);
  if (!res.ok) throw new Error("Failed to fetch Storage");
  return res.json();
}

export async function getStorage(id :string): Promise<Storage> {
  const res = await fetch(`/api/user/storage/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Storage");
  return res.json();
}

export async function putStorage(data: Storage) {
  const res = await fetch(`/api/user/storage`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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

export async function postStorage(data: Storage) {
  const res = await fetch(`/api/user/storage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
  put: () => ({
      mutationFn: async (data: Storage) => await putStorage(data),
    }),
  delete: ({
      mutationFn: async (id: string) => await deleteStorage(id),
    }),
  post: ({
      mutationFn: async (data: Storage) => await postStorage(data),
    }),
  };