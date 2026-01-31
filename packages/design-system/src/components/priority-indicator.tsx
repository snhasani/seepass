"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "../utils/cn";

const priorityLevels = {
  urgent: {
    label: "Urgent",
    value: 4,
    color: "var(--ds-severity-critical)",
    bgColor: "var(--ds-severity-critical-bg)",
  },
  high: {
    label: "High",
    value: 3,
    color: "var(--ds-severity-high)",
    bgColor: "var(--ds-severity-high-bg)",
  },
  medium: {
    label: "Medium",
    value: 2,
    color: "var(--ds-severity-medium)",
    bgColor: "var(--ds-severity-medium-bg)",
  },
  low: {
    label: "Low",
    value: 1,
    color: "var(--ds-severity-low)",
    bgColor: "var(--ds-severity-low-bg)",
  },
};

export type PriorityLevel = keyof typeof priorityLevels;

const priorityIndicatorVariants = cva(
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

export interface PriorityIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priorityIndicatorVariants> {
  priority: PriorityLevel;
  showLabel?: boolean;
  animated?: boolean;
  overridden?: boolean;
  originalPriority?: PriorityLevel;
  ref?: React.Ref<HTMLDivElement>;
}

function PriorityIndicator({
  className,
  priority,
  size,
  showLabel = true,
  animated = true,
  overridden = false,
  originalPriority,
  ref,
  ...props
}: PriorityIndicatorProps) {
  const config = priorityLevels[priority];
  const originalConfig = originalPriority
    ? priorityLevels[originalPriority]
    : null;

  return (
    <div
      ref={ref}
      data-slot="priority-indicator"
      className={cn(priorityIndicatorVariants({ size }), className)}
      {...props}
    >
      {/* Priority dots */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className={cn(
              "rounded-full",
              size === "sm" ? "size-2" : size === "lg" ? "size-3" : "size-2.5"
            )}
            style={{
              backgroundColor:
                level <= config.value ? config.color : "var(--muted)",
            }}
            initial={animated ? { scale: 0 } : undefined}
            animate={{ scale: 1 }}
            transition={{ delay: level * 0.05, type: "spring" }}
          />
        ))}
      </div>

      {showLabel && (
        <div className="flex items-center gap-1.5">
          <span style={{ color: config.color }}>{config.label}</span>
          {overridden && originalConfig && (
            <span className="text-muted-foreground text-xs line-through">
              {originalConfig.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Priority selector for user input
interface PrioritySelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: PriorityLevel;
  onChange: (priority: PriorityLevel) => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function PrioritySelector({
  className,
  value,
  onChange,
  disabled = false,
  ref,
  ...props
}: PrioritySelectorProps) {
  const levels: PriorityLevel[] = ["low", "medium", "high", "urgent"];

  return (
    <div
      ref={ref}
      data-slot="priority-selector"
      className={cn("flex gap-1", disabled && "opacity-50", className)}
      {...props}
    >
      {levels.map((level) => {
        const config = priorityLevels[level];
        const isSelected = value === level;

        return (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level)}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
              "border-2",
              isSelected
                ? "scale-105 shadow-md"
                : "hover:scale-102 border-transparent"
            )}
            style={{
              backgroundColor: isSelected ? config.bgColor : undefined,
              borderColor: isSelected ? config.color : "transparent",
              color: isSelected ? config.color : "var(--muted-foreground)",
            }}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

export { PriorityIndicator, priorityLevels, PrioritySelector };
