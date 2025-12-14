import { format } from "date-fns";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Entry } from "@/types/entry";
import { MOOD_CONFIG } from "@/types/entry";

interface EntryCardProps {
  entry: Entry;
  compact?: boolean;
}

export function EntryCard({ entry, compact = false }: EntryCardProps) {
  const moodConfig = MOOD_CONFIG[entry.mood];
  const contentPreview =
    entry.content.slice(0, 150) + (entry.content.length > 150 ? "..." : "");

  return (
    <Link href={ROUTES.EDIT_ENTRY(entry.id)}>
      <article className="brutal-border brutal-shadow brutal-hover bg-card p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Mood indicator */}
          <div
            className={cn(
              "brutal-border brutal-shadow-sm flex h-12 w-12 shrink-0 items-center justify-center text-2xl",
              moodConfig.color
            )}
          >
            {moodConfig.emoji}
          </div>

          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="truncate font-bold text-lg">
                  {entry.title || "Untitled Entry"}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={entry.createdAt}>
                    {format(new Date(entry.createdAt), "MMM d, yyyy")}
                  </time>
                  <span>·</span>
                  <span>{entry.metadata.wordCount} words</span>
                </div>
              </div>
            </div>

            {/* Content preview */}
            {!compact && (
              <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
                {contentPreview}
              </p>
            )}

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.slice(0, 4).map((tag) => (
                  <span
                    className="brutal-border bg-muted px-2 py-1 font-medium text-xs"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 4 && (
                  <span className="px-2 py-1 text-muted-foreground text-xs">
                    +{entry.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
