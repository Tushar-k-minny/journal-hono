import type { Entry, Mood } from "./entry";

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export type DashboardRecent = Entry[]

export interface MoodSummary {
  mood: Mood;
  count: number;
  percentage: number;
}

export interface MoodTrend {
  date: string;
  moods: Record<Mood, number>;
}

export interface WordCountTrend {
  date: string;
  averageWordCount: number;
  entries: number;
}

export interface TagFrequency {
  tag: string;
  count: number;
}

export interface ActivityStreak {
  current: number;
  longest: number;
  totalEntries: number;
  lastEntryDate: string | null;
}

export interface HealthCheck {
  status: "healthy" | "unhealthy";
  timestamp: string;
}
