"use client";

import { FileText, Flame, Loader2, Tag, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useActivityStreak,
  useMoodTrend,
  useTagFrequency,
  useTotalEntries,
  useWordCountTrend,
} from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { MoodTrendChart } from "./mood-trend-chart";
import { StatsCard } from "./stats-card";
import { TagCloud } from "./tag-cloud";
import { WordCountChart } from "./word-count-chart";

const timeRanges = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

export function AnalyticsView() {
  const [days, setDays] = useState(30);

  const { data: streak, isLoading: isLoadingStreak } = useActivityStreak();
  const { data: totalEntries, isLoading: isLoadingTotalEntries } =
    useTotalEntries();
  const { data: moodTrend, isLoading: isLoadingMood } = useMoodTrend(days);
  const { data: wordCount, isLoading: isLoadingWords } =
    useWordCountTrend(days);
  const { data: tagFrequency, isLoading: isLoadingTags } =
    useTagFrequency(days);

  const averageWords = wordCount?.length
    ? Math.round(
        wordCount.reduce((acc, curr) => acc + curr.averageWordCount, 0) /
          wordCount.length,
      )
    : 0;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              <span className="brutal-border brutal-shadow-sm bg-chart-4 px-2">
                Analytics
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Insights and trends from your journaling
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <Button
                className={cn(
                  "brutal-border brutal-hover",
                  days === range.value
                    ? "brutal-shadow-sm bg-primary text-primary-foreground"
                    : "",
                )}
                key={range.value}
                onClick={() => setDays(range.value)}
                size="sm"
                variant="outline"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            color="bg-chart-5"
            icon={Flame}
            isLoading={isLoadingStreak}
            suffix="days"
            title="Current Streak"
            value={streak?.current ?? 0}
          />
          <StatsCard
            color="bg-secondary"
            icon={TrendingUp}
            isLoading={isLoadingStreak}
            suffix="days"
            title="Longest Streak"
            value={streak?.longest ?? 0}
          />
          <StatsCard
            color="bg-accent"
            icon={FileText}
            isLoading={isLoadingTotalEntries}
            suffix=""
            title="Total Entries"
            value={totalEntries?.total ?? 0}
          />
          <StatsCard
            color="bg-chart-4"
            icon={Tag}
            isLoading={isLoadingWords}
            suffix="words"
            title="Avg. Words/Entry"
            value={averageWords ?? 0}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mood Trend */}
          <div className="brutal-border brutal-shadow bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-bold text-lg">Mood Trend</h2>
            {isLoadingMood ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : moodTrend && moodTrend.length > 0 ? (
              <MoodTrendChart data={moodTrend} />
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No mood data available
              </div>
            )}
          </div>

          {/* Word Count Trend */}
          <div className="brutal-border brutal-shadow bg-card p-4 sm:p-6">
            <h2 className="mb-4 font-bold text-lg">Word Count Trend</h2>
            {isLoadingWords ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : wordCount ? (
              <WordCountChart data={wordCount} />
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No word count data available
              </div>
            )}
          </div>

          {/* Tag Frequency */}
          <div className="brutal-border brutal-shadow bg-card p-4 sm:p-6 lg:col-span-2">
            <h2 className="mb-4 font-bold text-lg">Top Tags</h2>
            {isLoadingTags ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tagFrequency && tagFrequency.length > 0 ? (
              <TagCloud data={tagFrequency} />
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                No tags used yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
