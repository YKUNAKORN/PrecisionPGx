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

export async function putReport(id: string, data: any) {
  console.log('putReport called with:', { id, data });
  console.log('Validating data before sending...');
  console.log('medtech_verify:', data.medtech_verify, 'truthy?', !!data.medtech_verify);
  console.log('rule_id:', data.rule_id, 'truthy?', !!data.rule_id);
  console.log('index_rule:', data.index_rule, 'truthy?', !!data.index_rule);
  console.log('more_information:', data.more_information, 'truthy?', !!data.more_information);
  console.log('medical_technician_id:', data.medical_technician_id, 'truthy?', !!data.medical_technician_id);
  
  const res = await fetch(`/api/user/report?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  console.log('API Response status:', res.status);
  console.log('API Response ok:', res.ok);
  
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch (e) {
      console.error('Failed to parse error response as JSON');
      throw new Error(`Failed to update report: ${res.statusText} (Status: ${res.status})`);
    }
    console.error('API Error Response:', errorData);
    throw new Error(`Failed to update report: ${errorData.message || res.statusText}`);
  }
  
  const result = await res.json();
  console.log('API Success Response:', result);
  return result;
}

export async function deleteReport(id: string) {
  const res = await fetch(`/api/user/report/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete report");
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
  if (!res.ok) throw new Error("Failed to post report");
  return res.json();
}

export async function putFinishReport(id: string, data: { status: string }) {
  const res = await fetch(`/api/user/report/finish?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch (e) {
      console.error('Failed to parse error response as JSON');
      throw new Error(`Failed to finish report: ${res.statusText} (Status: ${res.status})`);
    }
    console.error('API Error Response:', errorData);
    throw new Error(`Failed to finish report: ${errorData.message || res.statusText}`);
  }
  
  return res.json();
}


export const createReportQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["reports"],
      queryFn: getReports,
      staleTime: 60_000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["report", id],
      queryFn: () => getReport(id),
      staleTime: 60_000,
      enabled: !!id,
    }),
};

export const mutateReportQueryOptions = {
  put: () => ({
    mutationFn: async ({ id, data }: { id: string; data: any }) => await putReport(id, data),
  }),

  delete: () => ({
    mutationFn: async (id: string) => await deleteReport(id),
  }),

  post: ({
    mutationFn: async (data: Report) => await postReport(data),
  }),

  finish: () => ({
    mutationFn: async ({ id, data }: { id: string; data: { status: string } }) => await putFinishReport(id, data),
  }),
};