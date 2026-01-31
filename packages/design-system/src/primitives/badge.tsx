"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-[--ds-indigo-100] text-[--ds-indigo-700] dark:bg-[--ds-indigo-800] dark:text-[--ds-indigo-200]",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        outline: "border border-current bg-transparent",
        problem:
          "bg-[--ds-problem-bg] text-[--ds-amber-700] dark:text-[--ds-amber-300] border border-[--ds-problem-border] dark:border-[--ds-amber-700]",
        ai: "bg-[--ds-ai-bg] text-[--ds-violet-600] dark:text-[--ds-violet-300] border border-[--ds-ai-border] dark:border-[--ds-violet-700]",
        signal:
          "bg-[--ds-signal-bg] text-[--ds-teal-700] dark:text-[--ds-teal-300] border border-[--ds-signal-border] dark:border-[--ds-teal-700]",
        success:
          "bg-[--ds-status-active-bg] text-[--ds-status-active] border border-[--ds-teal-200] dark:border-[--ds-teal-700]",
        warning:
          "bg-[--ds-status-pending-bg] text-[--ds-amber-700] dark:text-[--ds-amber-300] border border-[--ds-amber-200] dark:border-[--ds-amber-700]",
        destructive:
          "bg-[--ds-severity-critical-bg] text-[--ds-severity-critical] border border-[--ds-severity-critical-border]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] leading-4",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}

function Badge({
  className,
  variant,
  size,
  interactive,
  icon,
  children,
  ref,
  ...props
}: BadgeProps) {
  return (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {icon && <span className="shrink-0 [&_svg]:size-3">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
