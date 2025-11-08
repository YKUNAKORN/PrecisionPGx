import { Report } from "./type";
import { queryOptions } from "@tanstack/react-query";

export async function getReports(): Promise<Report[]> {
  const res = await fetch(`/api/user/report`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}


export async function getReport(id: string): Promise<Report> {
  const res = await fetch(`/api/user/report/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function putReport(data: Report) {
  const res = await fetch(`/api/user/report`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to put Report");
  return res.json();
}

export async function deleteReport(id: string) {
  const res = await fetch(`/api/user/report/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete Report");
  return res.json();
}

export async function postReport(data: Report) {
  const res = await fetch(`/api/user/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post Report");
  return res.json();
}


export const createReportQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["Reports"],
      queryFn: getReports,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["Report", id],
      queryFn: () => getReport(id),
      staleTime: 60_000,
      enabled: !!id,
    }),
};

export const mutateReportQueryOptions = {
  put: () => ({
    mutationFn: async (data: Report) => await putReport(data),
  }),

  delete: () => ({
    mutationFn: async (id: string) => await deleteReport(id),
  }),

  post: ({
    mutationFn: async (data: Omit<Report,"id">) => await postReport(data),
  }),
};