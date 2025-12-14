"use client";

import { cn } from "@/lib/utils";
import type { TagFrequency } from "@/types/api";

interface TagCloudProps {
  data: TagFrequency[];
}

const tagColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-2",
];

export function TagCloud({ data }: TagCloudProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));

  const getSize = (count: number) => {
    if (maxCount === minCount) return "text-base";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return "text-xl font-bold";
    if (ratio > 0.5) return "text-lg font-semibold";
    if (ratio > 0.25) return "text-base font-medium";
    return "text-sm";
  };

  return (
    <div className="flex flex-wrap gap-3">
      {data.slice(0, 20).map((tag, index) => (
        <span
          className={cn(
            "brutal-border brutal-shadow-sm brutal-hover cursor-default px-4 py-2",
            getSize(tag.count),
            tagColors[index % tagColors.length]
          )}
          key={tag.tag}
        >
          {tag.tag}
          <span className="ml-2 text-xs opacity-70">({tag.count})</span>
        </span>
      ))}
    </div>
  );
}
