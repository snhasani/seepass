"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "../primitives/badge";
import { SeverityBadge, type SeverityLevel } from "./severity-badge";

const summaryPanelVariants = cva(
  "rounded-2xl border bg-gradient-to-br transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "from-card to-card/50 border-border",
        highlighted:
          "from-[--ds-signal-bg] to-card border-[--ds-teal-300] shadow-lg",
        urgent:
          "from-[--ds-problem-bg] to-card border-[--ds-amber-300] shadow-lg ring-2 ring-[--ds-amber-200]",
        ai:
          "from-[--ds-ai-bg] to-card border-[--ds-violet-300]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PriorityItem {
  id: string;
  title: string;
  description?: string;
  severity: SeverityLevel;
  signalCount: number;
  reason: string;
  isAiSuggested?: boolean;
}

export interface SummaryPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof summaryPanelVariants> {
  title?: string;
  subtitle?: string;
  priorities: PriorityItem[];
  lastUpdated?: Date | string;
  onRefresh?: () => void;
  onItemClick?: (item: PriorityItem) => void;
  isRefreshing?: boolean;
  maxItems?: number;
  ref?: React.Ref<HTMLDivElement>;
}

function SummaryPanel({
  className,
  title = "What Matters Right Now",
  subtitle,
  priorities,
  lastUpdated,
  onRefresh,
  onItemClick,
  isRefreshing = false,
  variant,
  maxItems = 5,
  ref,
  ...props
}: SummaryPanelProps) {
    const displayedPriorities = priorities.slice(0, maxItems);
    const hasUrgent = priorities.some((p) => p.severity === "critical");
    const effectiveVariant = hasUrgent ? "urgent" : variant;

    return (
      <motion.div
        ref={ref}
        data-slot="summary-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          summaryPanelVariants({ variant: effectiveVariant }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-5 text-[--ds-violet-500]" />
                <h2 className="font-bold text-lg">{title}</h2>
                {hasUrgent && (
                  <Badge variant="destructive" size="sm" icon={<AlertTriangle />}>
                    Action Needed
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="rounded-lg p-2 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={cn(
                    "size-5 text-muted-foreground",
                    isRefreshing && "animate-spin"
                  )}
                />
              </button>
            )}
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Updated{" "}
              {new Date(lastUpdated).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        {/* Priority List */}
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {displayedPriorities.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick?.(item)}
                className={cn(
                  "group relative rounded-xl border bg-card p-4 transition-all duration-200",
                  "hover:shadow-md hover:border-[--ds-teal-300]",
                  onItemClick && "cursor-pointer",
                  item.severity === "critical" &&
                    "border-[--ds-severity-critical]/30 bg-[--ds-severity-critical-bg]"
                )}
              >
                {/* Priority number */}
                <div
                  className={cn(
                    "absolute -left-3 top-4 flex size-6 items-center justify-center rounded-full text-xs font-bold",
                    index === 0
                      ? "bg-[--ds-teal-500] text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>

                <div className="pl-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <SeverityBadge severity={item.severity} size="sm" />
                        {item.isAiSuggested && (
                          <Badge variant="ai" size="sm">
                            AI
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-lg font-bold tabular-nums">
                        {item.signalCount}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        signals
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Reason */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="size-3 text-[--ds-violet-400]" />
                    <span className="italic">{item.reason}</span>
                  </div>

                  {/* Hover arrow */}
                  {onItemClick && (
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {priorities.length > maxItems && (
          <div className="px-6 pb-6 pt-2 border-t">
            <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              View all {priorities.length} priorities
            </button>
          </div>
        )}

        {/* AI Attribution */}
        <div className="px-6 pb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-[--ds-violet-400]" />
          <span>Prioritized by AI based on signal analysis</span>
        </div>
      </motion.div>
    );
}

export { SummaryPanel, summaryPanelVariants };
