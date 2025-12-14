"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, PenLine } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useEntries } from "@/hooks/use-entries";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type Entry, MOOD_CONFIG } from "@/types/entry";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get entries for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data: entriesData, isLoading } = useEntries({
    from: format(monthStart, "yyyy-MM-dd"),
    to: format(monthEnd, "yyyy-MM-dd"),
    limit: 100,
  });

  // Create a map of dates to entries
  const entriesByDate = useMemo(() => {
    const map = new Map<string, Entry[]>();
    if (entriesData?.data) {
      for (const entry of entriesData.data) {
        const dateKey = format(new Date(entry.createdAt), "yyyy-MM-dd");
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, entry]);
      }
    }
    return map;
  }, [entriesData]);

  // Get calendar days including padding for week alignment
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const selectedDateEntries = selectedDate
    ? entriesByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl sm:text-4xl">
              <span className="brutal-border brutal-shadow-sm bg-accent px-2">
                Calendar
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              View your journal entries by date
            </p>
          </div>
          <Link href={ROUTES.NEW_ENTRY}>
            <Button className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground">
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar Grid */}
          <div className="brutal-border brutal-shadow bg-card p-4 sm:p-6 lg:col-span-2">
            {/* Month Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <Button
                className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                onClick={goToPreviousMonth}
                size="icon"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>

              <div className="flex items-center gap-3">
                <h2 className="font-bold text-xl">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <Button
                  className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                  onClick={goToToday}
                  size="sm"
                  variant="outline"
                >
                  Today
                </Button>
              </div>

              <Button
                className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                onClick={goToNextMonth}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Week day headers */}
                <div className="mb-2 grid grid-cols-7">
                  {weekDays.map((day) => (
                    <div
                      className="py-2 text-center font-medium text-muted-foreground text-sm"
                      key={day}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayEntries = entriesByDate.get(dateKey) || [];
                    const hasEntries = dayEntries.length > 0;
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelected =
                      !!selectedDate && isSameDay(day, selectedDate);
                    const dayIsToday = isToday(day);

                    // Get dominant mood for the day
                    const dominantMood = hasEntries ? dayEntries[0].mood : null;
                    const moodConfig = dominantMood
                      ? MOOD_CONFIG[dominantMood]
                      : null;

                    return (
                      <button
                        className={cn(
                          "brutal-border flex aspect-square flex-col items-center justify-center gap-1 p-1 transition-all sm:p-2",
                          isCurrentMonth ? "bg-card" : "bg-muted/50",
                          !!isSelected &&
                            "brutal-shadow-sm ring-2 ring-foreground",
                          !!dayIsToday && !isSelected && "ring-2 ring-primary",
                          !isSelected && "hover:bg-muted"
                        )}
                        key={dateKey}
                        onClick={() => setSelectedDate(day)}
                        type="button"
                      >
                        <span
                          className={cn(
                            "font-medium text-sm",
                            !isCurrentMonth && "text-muted-foreground",
                            !!dayIsToday && "font-bold text-primary"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {!!hasEntries && moodConfig && (
                          <span className="text-lg leading-none">
                            {moodConfig.emoji}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Selected Date Panel */}
          <div className="brutal-border brutal-shadow bg-card p-4 sm:p-6">
            <h3 className="mb-4 font-bold text-lg">
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Select a date"}
            </h3>

            {selectedDate ? (
              selectedDateEntries.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEntries.map((entry) => (
                    <Link
                      className="brutal-border brutal-hover block bg-muted p-3"
                      href={ROUTES.EDIT_ENTRY(entry.id)}
                      key={entry.id}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {MOOD_CONFIG[entry.mood].emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {entry.title || "Untitled"}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {format(new Date(entry.createdAt), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">
                    No entries for this date
                  </p>
                  <Link href={ROUTES.NEW_ENTRY}>
                    <Button
                      className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                      variant="outline"
                    >
                      <PenLine className="mr-2 h-4 w-4" />
                      Write an entry
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Click on a date to view entries
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
