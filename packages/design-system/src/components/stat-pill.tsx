"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

const statPillVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        critical: "bg-[--ds-severity-critical-bg] text-[--ds-severity-critical]",
        warning: "bg-[--ds-problem-bg] text-[--ds-amber-600]",
        ai: "bg-[--ds-ai-bg] text-[--ds-violet-600]",
        signal: "bg-[--ds-signal-bg] text-[--ds-teal-600]",
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
              ? "text-[--ds-severity-critical]"
              : "text-[--ds-status-active]"
          )}
        >
          {trend}
        </span>
      )}
    </div>
  );
}

export { StatPill, statPillVariants };
