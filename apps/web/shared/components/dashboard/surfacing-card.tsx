"use client";

import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertTriangle, Eye, Lightbulb } from "lucide-react";

export type SurfacingType = "investigate" | "monitor" | "note";

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
    colors: "bg-rose-50 text-rose-700 border-rose-200",
  },
  monitor: {
    label: "Monitor",
    icon: Eye,
    colors: "bg-amber-50 text-amber-700 border-amber-200",
  },
  note: {
    label: "Note",
    icon: Lightbulb,
    colors: "bg-slate-50 text-slate-600 border-slate-200",
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        onClick && "hover:border-slate-300",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              config.colors
            )}
          >
            <Icon className="size-3" />
            {config.label}
          </span>
          {dateRange && (
            <span className="text-xs text-muted-foreground">{dateRange}</span>
          )}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        {(affectedAccounts !== undefined || revenueAtRisk !== undefined) && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            {affectedAccounts !== undefined && (
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {affectedAccounts}
                </span>{" "}
                accounts
              </span>
            )}
            {revenueAtRisk !== undefined && (
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {formatCurrency(revenueAtRisk)}
                </span>{" "}
                at risk
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SurfacingEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-sm text-muted-foreground",
        className
      )}
    >
      All clear—nothing urgent
    </div>
  );
}
