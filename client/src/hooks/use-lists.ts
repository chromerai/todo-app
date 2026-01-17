import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertList, type List } from "@shared/routes";

export function useLists() {
  return useQuery({
    queryKey: [api.lists.list.path],
    queryFn: async () => {
      const res = await fetch(api.lists.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch lists");
      return api.lists.list.responses[200].parse(await res.json());
    },
  });
}

export function useList(id: number) {
  return useQuery({
    queryKey: [api.lists.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.lists.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch list");
      return api.lists.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertList) => {
      const validated = api.lists.create.input.parse(data);
      const res = await fetch(api.lists.create.path, {
        method: api.lists.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.lists.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create list");
      }
      return api.lists.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.lists.list.path] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertList>) => {
      const validated = api.lists.update.input.parse(updates);
      const url = buildUrl(api.lists.update.path, { id });
      const res = await fetch(url, {
        method: api.lists.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to update list");
      }
      return api.lists.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.lists.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.lists.get.path, data.id] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.lists.delete.path, { id });
      const res = await fetch(url, { 
        method: api.lists.delete.method, 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.lists.list.path] });
    },
  });
}
