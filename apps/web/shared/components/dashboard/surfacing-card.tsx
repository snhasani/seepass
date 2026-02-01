"use client";

import { cn } from "@/shared/lib/utils";
import { AlertTriangle, ArrowRight, Eye, Lightbulb } from "lucide-react";

export type SurfacingType = "investigate" | "watch" | "opportunity";

export interface SurfacingCardProps {
  type: SurfacingType;
  title: string;
  description: string;
  score?: number;
  affectedAccounts?: number;
  revenueAtRisk?: number;
  windowStart?: string;
  windowEnd?: string;
  onClick?: () => void;
  className?: string;
}

const typeConfig: Record<
  SurfacingType,
  { label: string; icon: typeof AlertTriangle; colors: string }
> = {
  investigate: {
    label: "Investigate",
    icon: AlertTriangle,
    colors: "bg-rose-100 text-rose-700 border-rose-300",
  },
  watch: {
    label: "Watch",
    icon: Eye,
    colors: "bg-amber-100 text-amber-700 border-amber-300",
  },
  opportunity: {
    label: "Opportunity",
    icon: Lightbulb,
    colors: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
};

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

function formatDateRange(start?: string, end?: string): string | null {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}`;
}

export function SurfacingCard({
  type,
  title,
  description,
  affectedAccounts,
  revenueAtRisk,
  windowStart,
  windowEnd,
  onClick,
  className,
}: SurfacingCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const dateRange = formatDateRange(windowStart, windowEnd);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onClick}
          className="group flex cursor-pointer items-center gap-1.5 text-left"
        >
          <h3 className="text-sm font-semibold text-foreground group-hover:text-slate-600 group-hover:underline">
            {title}
          </h3>
          <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
        {dateRange && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {dateRange}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 min-h-10 text-sm text-slate-700">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            config.colors
          )}
        >
          <Icon className="size-3" />
          {config.label}
        </span>

        {(affectedAccounts !== undefined || revenueAtRisk !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {affectedAccounts !== undefined && (
              <span>
                <span className="font-medium text-foreground">
                  {affectedAccounts}
                </span>{" "}
                accounts
              </span>
            )}
            {revenueAtRisk !== undefined && (
              <span>
                <span className="font-medium text-foreground">
                  {formatCurrency(revenueAtRisk)}
                </span>{" "}
                at risk
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function SurfacingEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 py-10 text-sm text-muted-foreground",
        className
      )}
    >
      All clear—nothing urgent
    </div>
  );
}
