"use client";

import { cn } from "@/lib/utils";
import { MOOD_CONFIG, type Mood } from "@/types/entry";

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

const moods = Object.entries(MOOD_CONFIG) as [
  Mood,
  (typeof MOOD_CONFIG)[Mood],
][];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map(([mood, config]) => (
        <button
          className={cn(
            "brutal-border flex items-center gap-2 px-4 py-2 transition-all",
            value === mood
              ? `${config.color} brutal-shadow-sm`
              : "bg-card hover:bg-muted"
          )}
          key={mood}
          onClick={() => onChange(mood)}
          type="button"
        >
          <span className="text-xl">{config.emoji}</span>
          <span className="font-medium text-sm">{config.label}</span>
        </button>
      ))}
    </div>
  );
}
