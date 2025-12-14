"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MoodTrend } from "@/types/api";
import { MOOD_CONFIG, type Mood } from "@/types/entry";

interface MoodTrendChartProps {
  data: MoodTrend[];
}

const moodColors: Record<Mood, string> = {
  joyful: "hsl(var(--chart-1))",
  content: "hsl(var(--chart-2))",
  neutral: "hsl(var(--muted))",
  anxious: "hsl(var(--chart-4))",
  stressed: "hsl(var(--chart-5))",
  sad: "hsl(var(--chart-3))",
  angry: "hsl(var(--destructive))",
};

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  // const chartData = useMemo(() => {
  //   // Group by date and aggregate mood counts
  //   const grouped = data.reduce(
  //     (acc, item) => {
  //       const date = format(new Date(item.date), 'MMM d')
  //       if (!acc[date]) {
  //         acc[date] = { date, entries: [], dominantMood: item.moods?.[0] }
  //       }
  //       acc[date].entries.push(item)
  //       return acc
  //     },
  //     {} as Record<string, { date: string; entries: MoodTrend[]; dominantMood: Mood }>
  //   )

  //   return Object.values(grouped).map((group) => ({
  //     date: group.date,
  //     count: group.entries.reduce((sum, e) => sum + e.count, 0),
  //     mood: group.dominantMood,
  //   }))
  // }, [data])

  const chartData = useMemo(() => {
    // Group by date and aggregate mood counts
    const grouped = data.reduce(
      (acc, item) => {
        const date = format(new Date(item.date), "MMM d");
        if (!acc[date]) {
          acc[date] = {
            date,
            totals: {} as Record<Mood, number>,
            entries: [] as MoodTrend[],
          };
        }
        acc[date].entries.push(item);
        // accumulate mood counts per day
        for (const m of Object.keys(item.moods)) {
          const mood = m as Mood;
          acc[date].totals[mood] =
            (acc[date].totals[mood] ?? 0) + (item.moods?.[mood] ?? 0);
        }
        return acc;
      },
      {} as Record<
        string,
        { date: string; totals: Record<Mood, number>; entries: MoodTrend[] }
      >
    );

    return Object.values(grouped).map((group) => {
      // determine dominant mood by maximum total for the day
      let dominantMood: Mood = "joyful";
      let max = -1;
      for (const [mood, value] of Object.entries(group.totals)) {
        const v = value ?? 0;
        if (v > max) {
          max = v;
          dominantMood = mood as Mood;
        }
      }
      const count = Object.values(group.totals).reduce(
        (a, b) => a + (b ?? 0),
        0
      );
      return { date: group.date, count, mood: dominantMood };
    });
  }, [data]);

  return (
    <div className="h-64">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis
            axisLine={{ stroke: "hsl(var(--border))" }}
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!(active && payload?.length)) return null;
              const data = payload[0].payload;
              const config = MOOD_CONFIG[data.mood as Mood];
              return (
                <div className="brutal-border brutal-shadow-sm bg-card p-3">
                  <p className="font-medium">{data.date}</p>
                  <p className="text-muted-foreground text-sm">
                    {config.emoji} {config.label}
                  </p>
                  <p className="text-sm">{data.count} entries</p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={0}>
            {chartData.map((entry) => (
              <Cell fill={moodColors[entry.mood]} key={entry.date} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
