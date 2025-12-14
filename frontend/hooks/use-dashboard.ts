"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useDashboardRecent(limit?: number) {
  return useQuery({
    queryKey: ["dashboard", "recent", limit],
    queryFn: () => apiClient.getDashboardRecent(limit),
    staleTime: 60 * 1000,
  });
}

export function useMoodSummary(limit?: number) {
  return useQuery({
    queryKey: ["dashboard", "mood-summary", limit],
    queryFn: () => apiClient.getMoodSummary(limit),
    staleTime: 60 * 1000,
  });
}
