"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

const statPillVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all border",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-foreground shadow-[var(--ds-shadow-xs)]",
        critical: "bg-[var(--ds-severity-critical-bg)] border-[var(--ds-severity-critical-border)] text-[var(--ds-severity-critical)]",
        warning: "bg-[var(--ds-problem-bg)] border-[var(--ds-problem-border)] text-[var(--ds-amber-600)]",
        ai: "bg-[var(--ds-ai-bg)] border-[var(--ds-ai-border)] text-[var(--ds-violet-600)]",
        signal: "bg-[var(--ds-signal-bg)] border-[var(--ds-signal-border)] text-[var(--ds-teal-600)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statPillVariants> {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  negative?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function StatPill({
  className,
  icon: Icon,
  label,
  value,
  trend,
  negative,
  variant,
  ref,
  ...props
}: StatPillProps) {
  return (
    <div
      ref={ref}
      data-slot="stat-pill"
      className={cn(statPillVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className="size-4 opacity-70" />}
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
      {trend && (
        <span
          className={cn(
            "text-xs",
            negative
              ? "text-[var(--ds-severity-critical)]"
              : "text-[var(--ds-status-active)]"
          )}
        >
          {trend}
        </span>
      )}
    </div>
  );
}

export { StatPill, statPillVariants };
