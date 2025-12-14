"use client";

import { ArrowUpDown, Filter, Loader2, PenLine, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInfiniteEntries } from "@/hooks/use-entries";
import { DEBOUNCE_DELAY, ROUTES } from "@/lib/constants";
import { useEntriesStore } from "@/store/entries-store";
import { MOOD_CONFIG, type Mood } from "@/types/entry";
import { EntryCard } from "./entry-card";

const moods = Object.entries(MOOD_CONFIG) as [
  Mood,
  (typeof MOOD_CONFIG)[Mood],
][];

export function ArchiveView() {
  const { filters, setFilters, resetFilters } = useEntriesStore();
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteEntries();

  const entries = useMemo(
    () => data?.pages.flatMap((page) => page?.data ?? null) || [],
    [data]
  );

  console.log(entries, "entreis");

  const handleSearch = (query: string) => {
    setSearchInput(query);
    setTimeout(() => {
      setFilters({ q: query || undefined });
    }, DEBOUNCE_DELAY);
  };

  const handleMoodFilter = (mood: string) => {
    setFilters({ mood: mood === "all" ? undefined : (mood as Mood) });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ sort: sort as "asc" | "desc" });
  };

  const handleDateFrom = (date: string) => {
    setFilters({ from: date || undefined });
  };

  const handleDateTo = (date: string) => {
    setFilters({ to: date || undefined });
  };

  const clearFilters = () => {
    setSearchInput("");
    resetFilters();
  };

  const hasActiveFilters =
    filters.q || filters.mood || filters.from || filters.to;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              <span className="brutal-border brutal-shadow-sm bg-secondary px-2">
                Archive
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse and search all your entries
            </p>
          </div>
          <Link href={ROUTES.NEW_ENTRY}>
            <Button className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground">
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="brutal-border brutal-shadow mb-6 bg-card p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="brutal-border pl-10"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search entries..."
                value={searchInput}
              />
            </div>

            {/* Filter Toggle */}
            <Button
              className="brutal-border brutal-shadow-sm brutal-hover"
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>

            {/* Sort */}
            <Select
              onValueChange={handleSortChange}
              value={filters.sort || "desc"}
            >
              <SelectTrigger className="brutal-border w-[140px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="brutal-border">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-border border-t pt-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-medium text-sm">Mood</Label>
                <Select
                  onValueChange={handleMoodFilter}
                  value={filters.mood || "all"}
                >
                  <SelectTrigger className="brutal-border">
                    <SelectValue placeholder="All moods" />
                  </SelectTrigger>
                  <SelectContent className="brutal-border">
                    <SelectItem value="all">All moods</SelectItem>
                    {moods.map(([mood, config]) => (
                      <SelectItem key={mood} value={mood}>
                        {config.emoji} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-sm">From Date</Label>
                <Input
                  className="brutal-border"
                  onChange={(e) => handleDateFrom(e.target.value)}
                  type="date"
                  value={filters.from || ""}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-sm">To Date</Label>
                <Input
                  className="brutal-border"
                  onChange={(e) => handleDateTo(e.target.value)}
                  type="date"
                  value={filters.to || ""}
                />
              </div>

              {hasActiveFilters && (
                <div className="sm:col-span-3">
                  <Button
                    className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                    onClick={clearFilters}
                    size="sm"
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries && entries.length > 0 ? (
          <>
            <p className="mb-4 text-muted-foreground text-sm">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
              found
            </p>
            <div className="grid gap-4">
              {entries.map(
                (entry) => entry && <EntryCard entry={entry} key={entry.id} />
              )}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="mt-6 text-center">
                <Button
                  className="brutal-border brutal-shadow-sm brutal-hover"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  variant="outline"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load more entries"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="brutal-border brutal-shadow bg-card p-8 text-center">
            <div className="brutal-border brutal-shadow-sm mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-bold">No entries found</h3>
            <p className="mb-4 text-muted-foreground text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "Start writing to see your entries here."}
            </p>
            {hasActiveFilters ? (
              <Button
                className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                onClick={clearFilters}
                variant="outline"
              >
                Clear filters
              </Button>
            ) : (
              <Link href={ROUTES.NEW_ENTRY}>
                <Button className="brutal-border brutal-shadow-sm brutal-hover bg-primary text-primary-foreground">
                  Write your first entry
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
