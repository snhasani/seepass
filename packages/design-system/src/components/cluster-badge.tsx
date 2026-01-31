"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Layers, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

const clusterBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-[--ds-teal-100] text-[--ds-teal-700] dark:bg-[--ds-teal-800] dark:text-[--ds-teal-200]",
        aiGenerated:
          "bg-[--ds-ai-bg] text-[--ds-violet-700] dark:text-[--ds-violet-300] ring-1 ring-[--ds-violet-200] dark:ring-[--ds-violet-700]",
        userCreated:
          "bg-[--ds-signal-bg] text-[--ds-teal-700] dark:text-[--ds-teal-300] ring-1 ring-[--ds-teal-200] dark:ring-[--ds-teal-700]",
        trending:
          "bg-[--ds-amber-100] text-[--ds-amber-700] dark:bg-[--ds-amber-800] dark:text-[--ds-amber-200] ring-1 ring-[--ds-amber-200]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
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

export interface ClusterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof clusterBadgeVariants> {
  name: string;
  problemCount?: number;
  isAiGenerated?: boolean;
  showIcon?: boolean;
  onNavigate?: () => void;
  ref?: React.Ref<HTMLSpanElement>;
}

function ClusterBadge({
  className,
  name,
  problemCount,
  isAiGenerated = false,
  showIcon = true,
  interactive,
  variant,
  size,
  onNavigate,
  ref,
  ...props
}: ClusterBadgeProps) {
    const effectiveVariant = isAiGenerated ? "aiGenerated" : variant;

    const handleClick = (e: React.MouseEvent) => {
      if (onNavigate) {
        e.stopPropagation();
        onNavigate();
      }
    };

    return (
      <span
        ref={ref}
        data-slot="cluster-badge"
        className={cn(
          clusterBadgeVariants({
            variant: effectiveVariant,
            size,
            interactive: interactive || !!onNavigate,
          }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {showIcon && (
          <>
            {isAiGenerated ? (
              <Sparkles
                className={cn(
                  size === "sm"
                    ? "size-2.5"
                    : size === "lg"
                      ? "size-4"
                      : "size-3"
                )}
              />
            ) : (
              <Layers
                className={cn(
                  size === "sm"
                    ? "size-2.5"
                    : size === "lg"
                      ? "size-4"
                      : "size-3"
                )}
              />
            )}
          </>
        )}
        <span className="truncate max-w-[120px]">{name}</span>
        {problemCount !== undefined && (
          <span className="opacity-60">({problemCount})</span>
        )}
        {onNavigate && (
          <ChevronRight
            className={cn(
              "opacity-50",
              size === "sm" ? "size-2.5" : size === "lg" ? "size-4" : "size-3"
            )}
          />
        )}
      </span>
    );
}

export { ClusterBadge, clusterBadgeVariants };
