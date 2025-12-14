"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type ApiClientError, apiClient } from "@/lib/api-client";
import { useEntriesStore } from "@/store/entries-store";
import type {
  CreateEntryData,
  EntryFilters,
  UpdateEntryData,
} from "@/types/entry";

export function useEntries(filters?: EntryFilters) {
  const { setEntries } = useEntriesStore();
  const storeFilters = useEntriesStore((state) => state.filters);
  const mergedFilters = { ...storeFilters, ...filters };

  return useQuery({
    queryKey: ["entries", mergedFilters],
    queryFn: async () => {
      const response = await apiClient.getEntries(mergedFilters);
      setEntries(response.data);
      return response;
    },
    staleTime: 30 * 1000,
  });
}

export function useInfiniteEntries(filters?: EntryFilters) {
  const storeFilters = useEntriesStore((state) => state.filters);
  const mergedFilters = { ...storeFilters, ...filters };

  return useInfiniteQuery({
    queryKey: ["entries", "infinite", mergedFilters],
    queryFn: async ({ pageParam }) =>
      await apiClient.getEntries({ ...mergedFilters, cursor: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useEntry(id: string) {
  const { setCurrentEntry } = useEntriesStore();

  return useQuery({
    queryKey: ["entry", id],
    queryFn: async () => {
      const entry = await apiClient.getEntry(id);
      setCurrentEntry(entry);
      return entry;
    },
    enabled: !!id,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  const { addEntry } = useEntriesStore();

  return useMutation({
    mutationFn: (data: CreateEntryData) => apiClient.createEntry(data),
    onSuccess: (newEntry) => {
      addEntry(newEntry);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  const { updateEntry } = useEntriesStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntryData }) =>
      apiClient.updateEntry(id, data),
    onSuccess: (updatedEntry) => {
      updateEntry(updatedEntry.id, updatedEntry);
      queryClient.setQueryData(["entry", updatedEntry.id], updatedEntry);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  const { deleteEntry } = useEntriesStore();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteEntry(id),
    onSuccess: (_, id) => {
      deleteEntry(id);
      queryClient.removeQueries({ queryKey: ["entry", id] });
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useEntryMutationError() {
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry();
  const deleteMutation = useDeleteEntry();

  return {
    createError: createMutation.error as ApiClientError | null,
    updateError: updateMutation.error as ApiClientError | null,
    deleteError: deleteMutation.error as ApiClientError | null,
  };
}
