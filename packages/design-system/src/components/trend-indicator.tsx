"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "../primitives/badge";

const trendIndicatorVariants = cva(
  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200",
  {
    variants: {
      trend: {
        emerging:
          "border-[--ds-violet-200] bg-[--ds-ai-bg] text-[--ds-violet-700]",
        rising:
          "border-[--ds-severity-high] bg-[--ds-severity-high-bg] text-[--ds-severity-high]",
        stable: "border-border bg-muted/50 text-muted-foreground",
        declining:
          "border-[--ds-status-active] bg-[--ds-status-active-bg] text-[--ds-status-active]",
        hot: "border-[--ds-amber-400] bg-[--ds-problem-bg] text-[--ds-amber-600]",
      },
      size: {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
      },
    },
    defaultVariants: {
      trend: "stable",
      size: "default",
    },
  }
);

const trendConfig = {
  emerging: { icon: Sparkles, label: "Emerging" },
  rising: { icon: TrendingUp, label: "Rising" },
  stable: { icon: Minus, label: "Stable" },
  declining: { icon: TrendingDown, label: "Declining" },
  hot: { icon: Flame, label: "Hot" },
};

export type TrendType = keyof typeof trendConfig;

export interface TrendIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trendIndicatorVariants> {
  trend: TrendType;
  label?: string;
  description?: string;
  changePercent?: number;
  showIcon?: boolean;
  animated?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function TrendIndicator({
  className,
  trend,
  label,
  description,
  changePercent,
  size,
  showIcon = true,
  animated = true,
  ref,
  ...props
}: TrendIndicatorProps) {
    const config = trendConfig[trend];
    const Icon = config.icon;

    return (
      <motion.div
        ref={ref}
        data-slot="trend-indicator"
        initial={animated ? { opacity: 0, scale: 0.95 } : undefined}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(trendIndicatorVariants({ trend, size }), className)}
        {...props}
      >
        {showIcon && (
          <Icon
            className={cn(
              size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4",
              trend === "hot" && "animate-pulse"
            )}
          />
        )}
        <span className="font-medium">{label || config.label}</span>
        {changePercent !== undefined && (
          <span className="opacity-70 text-xs">
            ({changePercent > 0 ? "+" : ""}
            {changePercent}%)
          </span>
        )}
        {description && (
          <span className="text-xs opacity-60">{description}</span>
        )}
    </motion.div>
  );
}

// Trend list for showing multiple trends at once
interface TrendListItem {
  id: string;
  title: string;
  trend: TrendType;
  count?: number;
  isNew?: boolean;
}

interface TrendListProps extends React.HTMLAttributes<HTMLDivElement> {
  trends: TrendListItem[];
  title?: string;
  maxItems?: number;
  onTrendClick?: (trend: TrendListItem) => void;
  ref?: React.Ref<HTMLDivElement>;
}

function TrendList({
  className,
  trends,
  title = "Trending Topics",
  maxItems = 5,
  onTrendClick,
  ref,
  ...props
}: TrendListProps) {
    const displayedTrends = trends.slice(0, maxItems);

    return (
      <div
        ref={ref}
        data-slot="trend-list"
        className={cn("rounded-xl border bg-card", className)}
        {...props}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            {title}
          </h3>
          <Badge variant="secondary" size="sm">
            {trends.length} trends
          </Badge>
        </div>

        <div className="p-2">
          {displayedTrends.map((trend, index) => {
            const config = trendConfig[trend.trend];
            const Icon = config.icon;

            return (
              <motion.button
                key={trend.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onTrendClick?.(trend)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  "hover:bg-muted/50",
                  onTrendClick && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    trend.trend === "emerging" && "bg-[--ds-ai-bg] text-[--ds-violet-500]",
                    trend.trend === "rising" && "bg-[--ds-severity-high-bg] text-[--ds-severity-high]",
                    trend.trend === "stable" && "bg-muted text-muted-foreground",
                    trend.trend === "declining" && "bg-[--ds-status-active-bg] text-[--ds-status-active]",
                    trend.trend === "hot" && "bg-[--ds-problem-bg] text-[--ds-amber-600]"
                  )}
                >
                  <Icon className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {trend.title}
                    </span>
                    {trend.isNew && (
                      <Badge variant="ai" size="sm">
                        New
                      </Badge>
                    )}
                  </div>
                  {trend.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {trend.count} signals
                    </span>
                  )}
                </div>

                <Badge
                  variant={
                    trend.trend === "hot"
                      ? "warning"
                      : trend.trend === "emerging"
                        ? "ai"
                        : "secondary"
                  }
                  size="sm"
                >
                  {config.label}
                </Badge>
              </motion.button>
            );
          })}
        </div>

        {trends.length > maxItems && (
          <div className="p-2 pt-0">
            <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              View all {trends.length} trends
            </button>
          </div>
        )}
      </div>
    );
}

export { TrendIndicator, TrendList, trendIndicatorVariants, trendConfig };
