"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WordCountTrend } from "@/types/api";

interface WordCountChartProps {
  data: WordCountTrend[];
}

export function WordCountChart({ data }: WordCountChartProps) {
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        date: format(new Date(item.date), "MMM d"),
        words: item.averageWordCount * item.entries,
      })),
    [data]
  );

  return (
    <div className="h-64">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="wordGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
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
              return (
                <div className="brutal-border brutal-shadow-sm bg-card p-3">
                  <p className="font-medium">{data.date}</p>
                  <p className="text-sm">{data.words} words</p>
                </div>
              );
            }}
          />
          <Area
            dataKey="words"
            fill="url(#wordGradient)"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
