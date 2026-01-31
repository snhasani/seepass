"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

const confidenceIndicatorVariants = cva(
  "inline-flex items-center gap-2 font-medium",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const getConfidenceLevel = (
  value: number
): { label: string; color: string; description: string } => {
  if (value >= 0.8) {
    return {
      label: "High",
      color: "var(--ds-confidence-high)",
      description: "AI is very confident in this assessment",
    };
  }
  if (value >= 0.5) {
    return {
      label: "Medium",
      color: "var(--ds-confidence-medium)",
      description: "AI has moderate confidence, human review recommended",
    };
  }
  return {
    label: "Low",
    color: "var(--ds-confidence-low)",
    description: "AI is uncertain, human judgment required",
  };
};

export interface ConfidenceIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof confidenceIndicatorVariants> {
  value: number; // 0 to 1
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function ConfidenceIndicator({
  className,
  value,
  size,
  showLabel = true,
  showPercentage = true,
  animated = true,
  ref,
  ...props
}: ConfidenceIndicatorProps) {
    const clampedValue = Math.max(0, Math.min(1, value));
    const { label, color, description } = getConfidenceLevel(clampedValue);
    const percentage = Math.round(clampedValue * 100);

    return (
      <div
        ref={ref}
        data-slot="confidence-indicator"
        className={cn(confidenceIndicatorVariants({ size }), className)}
        title={description}
        {...props}
      >
        <div className="relative">
          {/* Background ring */}
          <svg
            className={cn(
              size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8"
            )}
            viewBox="0 0 36 36"
          >
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${clampedValue * 94.2} 94.2`}
              transform="rotate(-90 18 18)"
              initial={animated ? { strokeDasharray: "0 94.2" } : undefined}
              animate={{ strokeDasharray: `${clampedValue * 94.2} 94.2` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          {/* Center dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={animated ? { scale: 0 } : undefined}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div
              className={cn(
                "rounded-full",
                size === "sm" ? "size-1.5" : size === "lg" ? "size-3" : "size-2"
              )}
              style={{ backgroundColor: color }}
            />
          </motion.div>
        </div>

        {(showLabel || showPercentage) && (
          <div className="flex flex-col">
            {showPercentage && (
              <span className="font-semibold tabular-nums">{percentage}%</span>
            )}
            {showLabel && (
              <span className="text-muted-foreground text-[10px] uppercase tracking-wide">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
}

// Horizontal bar variant
interface ConfidenceBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  showLabel?: boolean;
  animated?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function ConfidenceBar({
  className,
  value,
  showLabel = true,
  animated = true,
  ref,
  ...props
}: ConfidenceBarProps) {
    const clampedValue = Math.max(0, Math.min(1, value));
    const { label, color } = getConfidenceLevel(clampedValue);

    return (
      <div
        ref={ref}
        data-slot="confidence-bar"
        className={cn("w-full", className)}
        {...props}
      >
        {showLabel && (
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium">{Math.round(clampedValue * 100)}%</span>
          </div>
        )}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={animated ? { width: 0 } : undefined}
            animate={{ width: `${clampedValue * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    );
}

export { ConfidenceIndicator, ConfidenceBar, getConfidenceLevel };
