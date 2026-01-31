"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

const metricCardVariants = cva(
  "relative rounded-xl border p-4 transition-all duration-200 hover:shadow-[--ds-shadow-md]",
  {
    variants: {
      variant: {
        default: "border-border bg-[--ds-gradient-card] shadow-[--ds-shadow-xs]",
        highlighted: "border-[--ds-teal-200] bg-[--ds-signal-bg] shadow-[--ds-shadow-sm]",
        warning: "border-[--ds-amber-200] bg-[--ds-problem-bg] shadow-[--ds-shadow-sm]",
        ai: "border-[--ds-violet-200] bg-[--ds-gradient-ai] shadow-[--ds-shadow-sm] shadow-[--ds-shadow-glow]",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  previousValue?: string | number;
  changeLabel?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendIsPositive?: boolean; // Is "up" a good thing for this metric?
  description?: string;
  animated?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function MetricCard({
  className,
  title,
  value,
  previousValue,
  changeLabel,
  icon: Icon,
  trend,
  trendIsPositive = true,
  description,
  variant,
  size,
  animated = true,
  ref,
  ...props
}: MetricCardProps) {
    const TrendIcon =
      trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    // Determine if trend is good or bad
    const isTrendGood =
      trend === "stable" ||
      (trend === "up" && trendIsPositive) ||
      (trend === "down" && !trendIsPositive);

    // Calculate percentage change if both values are numbers
    const percentChange =
      typeof value === "number" && typeof previousValue === "number" && previousValue > 0
        ? Math.round(((value - previousValue) / previousValue) * 100)
        : null;

    return (
      <motion.div
        ref={ref}
        data-slot="metric-card"
        initial={animated ? { opacity: 0, y: 12 } : undefined}
        animate={{ opacity: 1, y: 0 }}
        className={cn(metricCardVariants({ variant, size }), className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          {Icon && (
            <Icon
              className={cn(
                "size-5",
                variant === "highlighted" && "text-[--ds-teal-500]",
                variant === "warning" && "text-[--ds-amber-500]",
                variant === "ai" && "text-[--ds-violet-500]",
                variant === "default" && "text-muted-foreground"
              )}
            />
          )}
        </div>

        {/* Value */}
        <motion.div
          className="flex items-end gap-2"
          initial={animated ? { scale: 0.9 } : undefined}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <span
            className={cn(
              "font-bold tabular-nums",
              size === "sm" ? "text-2xl" : size === "lg" ? "text-4xl" : "text-3xl"
            )}
          >
            {value}
          </span>

          {/* Trend indicator */}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium mb-1",
                isTrendGood
                  ? "bg-[--ds-status-active-bg] text-[--ds-status-active]"
                  : "bg-[--ds-severity-critical-bg] text-[--ds-severity-critical]"
              )}
            >
              <TrendIcon className="size-3" />
              {percentChange !== null && (
                <span>
                  {percentChange > 0 ? "+" : ""}
                  {percentChange}%
                </span>
              )}
              {changeLabel && <span>{changeLabel}</span>}
            </div>
          )}
        </motion.div>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}

        {/* Sparkline placeholder */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20 pointer-events-none overflow-hidden rounded-b-xl">
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <motion.path
              d="M0,25 Q25,20 50,15 T100,10"
              fill="none"
              stroke={
                isTrendGood || !trend
                  ? "var(--ds-teal-400)"
                  : "var(--ds-severity-critical)"
              }
              strokeWidth="2"
              initial={animated ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>
    );
}

export { MetricCard, metricCardVariants };
