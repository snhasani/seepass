"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils/cn";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-[var(--ds-teal-500)]",
        problem: "bg-[var(--ds-problem)]",
        ai: "bg-[var(--ds-ai)]",
        success: "bg-[var(--ds-status-active)]",
        warning: "bg-[var(--ds-status-pending)]",
        danger: "bg-[var(--ds-severity-critical)]",
        gradient:
          "bg-gradient-to-r from-[var(--ds-teal-500)] via-[var(--ds-violet-500)] to-[var(--ds-amber-500)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  showValue?: boolean;
  label?: string;
  ref?: React.Ref<React.ElementRef<typeof ProgressPrimitive.Root>>;
}

function Progress({
  className,
  value,
  size,
  variant,
  showValue,
  label,
  ref,
  ...props
}: ProgressProps) {
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-medium tabular-nums">{value ?? 0}%</span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(indicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}

export { Progress };
