"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import * as React from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../utils/cn";
import { SeverityBadge, type SeverityLevel } from "./severity-badge";

const summaryPanelVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow-[var(--ds-shadow-sm)]",
        highlighted:
          "border-border bg-[var(--ds-gradient-card)] shadow-[var(--ds-shadow-md)] shadow-[var(--ds-shadow-glow-teal)]",
        urgent:
          "border-border bg-[var(--ds-problem-bg)] shadow-[var(--ds-shadow-md)]",
        ai: "border-border bg-[var(--ds-gradient-ai)] shadow-[var(--ds-shadow-sm)] shadow-[var(--ds-shadow-glow)]",
      },
    },
    defaultVariants: {
      variant: "ai",
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
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof summaryPanelVariants> {
  title?: string;
  subtitle?: string;
  priorities: PriorityItem[];
  lastUpdated?: Date | string;
  onRefresh?: () => void;
  onItemClick?: (item: PriorityItem) => void;
  isRefreshing?: boolean;
  maxItems?: number;
  /** Show compact one-liner items by default */
  compact?: boolean;
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
  compact = true,
  ref,
  ...props
}: SummaryPanelProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const displayedPriorities = priorities.slice(0, maxItems);
  const hasUrgent = priorities.some((p) => p.severity === "critical");
  const effectiveVariant = hasUrgent ? "urgent" : variant;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      ref={ref}
      data-slot="summary-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        summaryPanelVariants({ variant: effectiveVariant }),
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--ds-violet-500)]" />
          <h2 className="font-semibold">{title}</h2>
          {hasUrgent && (
            <Badge variant="destructive" size="sm">
              <AlertTriangle className="size-3 mr-1" />
              Action Needed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(lastUpdated).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-md p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn(
                  "size-4 text-muted-foreground",
                  isRefreshing && "animate-spin"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="px-4 pb-3 text-sm text-muted-foreground">{subtitle}</p>
      )}

      {/* Priority List */}
      <div className="px-2 pb-2">
        {displayedPriorities.map((item, index) => {
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="mb-1 last:mb-0"
            >
              {/* Collapsed row */}
              <button
                onClick={() => {
                  toggleExpand(item.id);
                  onItemClick?.(item);
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                  "hover:bg-muted/50",
                  isExpanded && "bg-muted/30",
                  item.severity === "critical" &&
                    "bg-[var(--ds-severity-critical-bg)]/30"
                )}
              >
                <SeverityBadge severity={item.severity} size="sm" />

                {item.isAiSuggested && (
                  <Sparkles className="size-3 text-[var(--ds-violet-500)] shrink-0" />
                )}

                <span className="flex-1 font-medium text-sm truncate">
                  {item.title}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold tabular-nums">
                    {item.signalCount}
                  </span>
                  <span className="text-xs text-muted-foreground">sig</span>
                </div>

                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-3 ml-3 border-l-2 border-muted">
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Sparkles className="size-3 text-[var(--ds-violet-400)] mt-0.5 shrink-0" />
                        <span className="italic">{item.reason}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      {priorities.length > maxItems && (
        <div className="px-4 pb-3 pt-1 border-t">
          <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
            View all {priorities.length} priorities
          </button>
        </div>
      )}
    </motion.div>
  );
}

export { SummaryPanel, summaryPanelVariants };
