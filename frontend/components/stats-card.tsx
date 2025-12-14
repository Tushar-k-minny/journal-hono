import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  suffix,
  icon: Icon,
  color,
  isLoading,
}: StatsCardProps) {
  return (
    <div className="brutal-border brutal-shadow bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 font-medium text-muted-foreground text-sm">
            {title}
          </p>
          {isLoading ? (
            <Loader2 className="mt-2 h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl">{value}</span>
              {suffix && (
                <span className="text-muted-foreground text-sm">{suffix}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "brutal-border brutal-shadow-sm flex h-10 w-10 items-center justify-center",
            color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
