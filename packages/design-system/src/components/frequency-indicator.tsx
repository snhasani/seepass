"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";
import { cn } from "../utils/cn";

const frequencyIndicatorVariants = cva(
  "inline-flex items-center gap-1.5 font-medium tabular-nums",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
      trend: {
        up: "text-[--ds-severity-critical]",
        down: "text-[--ds-status-active]",
        stable: "text-muted-foreground",
        hot: "text-[--ds-amber-500]",
      },
    },
    defaultVariants: {
      size: "default",
      trend: "stable",
    },
  }
);

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
  hot: Flame,
};

export interface FrequencyIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frequencyIndicatorVariants> {
  count: number;
  previousCount?: number;
  period?: string;
  showTrend?: boolean;
  threshold?: {
    hot: number;
    rising: number;
  };
  ref?: React.Ref<HTMLDivElement>;
}

function FrequencyIndicator({
  className,
  count,
  previousCount,
  period = "this week",
  size,
  showTrend = true,
  threshold = { hot: 50, rising: 10 },
  ref,
  ...props
}: FrequencyIndicatorProps) {
    const determineTrend = (): "up" | "down" | "stable" | "hot" => {
      if (count >= threshold.hot) return "hot";
      if (previousCount === undefined) return "stable";
      const change = count - previousCount;
      if (change > threshold.rising) return "up";
      if (change < -threshold.rising) return "down";
      return "stable";
    };

    const trend = determineTrend();
    const TrendIcon = trendIcons[trend];

    const changePercent =
      previousCount !== undefined && previousCount > 0
        ? Math.round(((count - previousCount) / previousCount) * 100)
        : null;

    return (
      <div
        ref={ref}
        data-slot="frequency-indicator"
        className={cn(frequencyIndicatorVariants({ size, trend }), className)}
        {...props}
      >
        {showTrend && (
          <TrendIcon
            className={cn(
              size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4",
              trend === "hot" && "animate-pulse"
            )}
          />
        )}
        <span className="font-semibold">{count}</span>
        <span className="text-muted-foreground font-normal">
          signals {period}
        </span>
        {changePercent !== null && (
          <span
            className={cn(
              "text-xs",
              changePercent > 0 && "text-[--ds-severity-high]",
              changePercent < 0 && "text-[--ds-status-active]"
            )}
          >
            ({changePercent > 0 ? "+" : ""}
            {changePercent}%)
          </span>
        )}
      </div>
    );
}

// Mini sparkline for frequency over time
interface FrequencySparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  height?: number;
  ref?: React.Ref<HTMLDivElement>;
}

function FrequencySparkline({
  className,
  data,
  height = 24,
  ref,
  ...props
}: FrequencySparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div
      ref={ref}
      data-slot="frequency-sparkline"
      className={cn("flex items-end gap-px", className)}
      style={{ height }}
      {...props}
    >
      {data.map((value, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 min-w-1 rounded-t-sm transition-all duration-300",
            "bg-[--ds-teal-400] hover:bg-[--ds-teal-500]"
          )}
          style={{
            height: `${Math.max((value / max) * 100, 8)}%`,
          }}
          title={`${value} signals`}
        />
      ))}
    </div>
  );
}

export { FrequencyIndicator, FrequencySparkline };
