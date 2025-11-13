import { queryOptions } from "@tanstack/react-query";
import { RuleBased } from "./model/Rule";

export async function getRules(): Promise<RuleBased[]> {
  const res = await fetch(`/api/user/rule`);
  if (!res.ok) throw new Error("Failed to fetch rules");
  const response = await res.json();
  return response.data || [];
}

export async function getRule(id: string): Promise<RuleBased> {
  const res = await fetch(`/api/user/rule/${id}`);
  if (!res.ok) throw new Error("Failed to fetch rule");
  const response = await res.json();
  return response.data;
}

export async function putRule(data: RuleBased) {
  const res = await fetch(`/api/user/rule`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to put rule");
  const response = await res.json();
  return response.data;
}

export async function deleteRule(id: string) {
  const res = await fetch(`/api/user/rule/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete rule");
  const response = await res.json();
  return response.data;
}

export async function postRule(data: RuleBased) {
  const res = await fetch(`/api/user/rule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post rule");
  const response = await res.json();
  return response.data;
}

export const createRuleQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["rules"],
      queryFn: getRules,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["rule", id],
      queryFn: () => getRule(id),
      enabled: !!id,
    }),
};

export const mutateRuleQueryOptions = {
  put: () => ({
    mutationFn: async (data: RuleBased) => await putRule(data),
  }),

  delete: () => ({
    mutationFn: async (id: string) => await deleteRule(id),
  }),

  post: () => ({
    mutationFn: async (data: RuleBased) => await postRule(data),
  }),
};
