"use client";

import { format } from "date-fns";
import {
  BookOpen,
  Flame,
  Loader2,
  PenLine,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActivityStreak, useTotalEntries } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardRecent, useMoodSummary } from "@/hooks/use-dashboard";
import { DEBOUNCE_DELAY, ROUTES } from "@/lib/constants";
import { useEntriesStore } from "@/store/entries-store";
import { MOOD_CONFIG } from "@/types/entry";
import { EntryCard } from "./entry-card";
import { StatsCard } from "./stats-card";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function DashboardContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { setFilters } = useEntriesStore();

  const { data: recentData, isLoading: isLoadingRecent } =
    useDashboardRecent(5);
  const { data: moodSummary, isLoading: isLoadingMood } = useMoodSummary(7);
  const { data: streak, isLoading: isLoadingStreak } = useActivityStreak();
  const { data: totalEntries, isLoading: isTotalEntriesLoading } =
    useTotalEntries();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounced filter update
    setTimeout(() => {
      setFilters({ q: query || undefined });
    }, DEBOUNCE_DELAY);
  };

  const topMood = moodSummary?.[0];
  const greeting = getGreeting();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              {greeting},{" "}
              <span className="brutal-border brutal-shadow-sm bg-primary px-2">
                {user?.displayName?.split(" ")[0] || "there"}
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Link href={ROUTES.NEW_ENTRY}>
            <Button className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground">
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="brutal-border pl-10"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your entries..."
              value={searchQuery}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            icon={BookOpen}
            isLoading={isTotalEntriesLoading}
            suffix="entries"
            title="Total Entries"
            value={totalEntries?.total ?? 0}
          />
          <StatsCard
            color="bg-accent"
            icon={TrendingUp}
            isLoading={isLoadingMood}
            suffix={topMood ? MOOD_CONFIG[topMood.mood].label : ""}
            title="Top Mood This Week"
            value={topMood ? MOOD_CONFIG[topMood.mood].emoji : "-"}
          />
        </div>

        {/* Recent Entries */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-xl">Recent Entries</h2>
            <Link
              className="font-medium text-sm underline underline-offset-4 hover:text-primary"
              href={ROUTES.ARCHIVE}
            >
              View all
            </Link>
          </div>

          {isLoadingRecent ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !!recentData && recentData?.length > 0 ? (
            <div className="grid gap-4">
              {recentData?.map(
                (entry) => !!entry && <EntryCard entry={entry} key={entry.id} />
              )}
            </div>
          ) : (
            <div className="brutal-border brutal-shadow bg-card p-8 text-center">
              <div className="brutal-border brutal-shadow-sm mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-muted">
                <PenLine className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-bold">No entries yet</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                Start your journaling journey by creating your first entry.
              </p>
              <Link href={ROUTES.NEW_ENTRY}>
                <Button className="brutal-border brutal-shadow-sm brutal-hover bg-primary text-primary-foreground">
                  Write your first entry
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
