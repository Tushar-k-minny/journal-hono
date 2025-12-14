"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useMoodTrend(days?: number) {
  return useQuery({
    queryKey: ["analytics", "mood-trend", days],
    queryFn: () => apiClient.getMoodTrend(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWordCountTrend(days?: number) {
  return useQuery({
    queryKey: ["analytics", "word-count", days],
    queryFn: () => apiClient.getWordCountTrend(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTagFrequency(days?: number) {
  return useQuery({
    queryKey: ["analytics", "tag-frequency", days],
    queryFn: () => apiClient.getTagFrequency(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useActivityStreak() {
  return useQuery({
    queryKey: ["analytics", "activity-streak"],
    queryFn: () => apiClient.getActivityStreak(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTotalEntries() {
  return useQuery({
    queryKey: ["analytics", "total-entries"],
    queryFn: () => apiClient.totalEntries(),
    staleTime: 5 * 60 * 1000,
  });
}
