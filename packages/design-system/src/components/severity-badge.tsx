"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, Info, Minus } from "lucide-react";
import { cn } from "../utils/cn";

const severityConfig = {
  critical: {
    icon: AlertCircle,
    label: "Critical",
    description: "Blocking issue affecting core functionality",
  },
  high: {
    icon: AlertTriangle,
    label: "High",
    description: "Significant pain causing frequent frustration",
  },
  medium: {
    icon: Info,
    label: "Medium",
    description: "Noticeable issue but workarounds exist",
  },
  low: {
    icon: Minus,
    label: "Low",
    description: "Minor inconvenience",
  },
};

const severityBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
  {
    variants: {
      severity: {
        critical:
          "bg-[--ds-severity-critical-bg] text-[--ds-severity-critical] ring-1 ring-[--ds-severity-critical]/20",
        high:
          "bg-[--ds-severity-high-bg] text-[--ds-severity-high] ring-1 ring-[--ds-severity-high]/20",
        medium:
          "bg-[--ds-severity-medium-bg] text-[--ds-severity-medium] ring-1 ring-[--ds-severity-medium]/20",
        low:
          "bg-[--ds-severity-low-bg] text-[--ds-severity-low] ring-1 ring-[--ds-severity-low]/20",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      severity: "medium",
      size: "default",
    },
  }
);

export type SeverityLevel = keyof typeof severityConfig;

export interface SeverityBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof severityBadgeVariants> {
  severity: SeverityLevel;
  showIcon?: boolean;
  showLabel?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

function SeverityBadge({
  className,
  severity,
  size,
  showIcon = true,
  showLabel = true,
  ref,
  ...props
}: SeverityBadgeProps) {
    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
      <span
        ref={ref}
        data-slot="severity-badge"
        data-severity={severity}
        className={cn(severityBadgeVariants({ severity, size }), className)}
        title={config.description}
        {...props}
      >
        {showIcon && (
          <Icon
            className={cn(
              size === "sm" ? "size-3" : size === "lg" ? "size-4" : "size-3.5"
            )}
          />
        )}
        {showLabel && <span>{config.label}</span>}
      </span>
    );
}

// Visual severity bar for quick scanning
interface SeverityBarProps extends React.HTMLAttributes<HTMLDivElement> {
  severity: SeverityLevel;
  animated?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function SeverityBar({
  className,
  severity,
  animated = false,
  ref,
  ...props
}: SeverityBarProps) {
    const levels: SeverityLevel[] = ["low", "medium", "high", "critical"];
    const activeIndex = levels.indexOf(severity);

    return (
      <div
        ref={ref}
        data-slot="severity-bar"
        className={cn("flex gap-1", className)}
        {...props}
      >
        {levels.map((level, index) => (
          <div
            key={level}
            className={cn(
              "h-1.5 w-4 rounded-full transition-all duration-300",
              index <= activeIndex
                ? `bg-[--ds-severity-${severity}]`
                : "bg-muted",
              animated && index <= activeIndex && "animate-pulse"
            )}
            style={{
              backgroundColor:
                index <= activeIndex
                  ? `var(--ds-severity-${severity})`
                  : undefined,
            }}
          />
        ))}
      </div>
    );
}

export { SeverityBadge, SeverityBar, severityConfig };
