"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Clock, Sparkles, User, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "../primitives/badge";

const effortLevels = {
  trivial: { label: "Trivial", days: "< 1 day", value: 1 },
  small: { label: "Small", days: "1-3 days", value: 2 },
  medium: { label: "Medium", days: "1-2 weeks", value: 3 },
  large: { label: "Large", days: "2-4 weeks", value: 4 },
  xlarge: { label: "X-Large", days: "1-2 months", value: 5 },
  unknown: { label: "Unknown", days: "TBD", value: 0 },
};

export type EffortLevel = keyof typeof effortLevels;

const effortEstimateVariants = cva(
  "inline-flex items-center gap-2 rounded-lg border transition-all duration-200",
  {
    variants: {
      source: {
        ai: "border-[--ds-violet-200] bg-[--ds-ai-bg]",
        human: "border-[--ds-teal-200] bg-[--ds-signal-bg]",
        combined: "border-border bg-card",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      source: "combined",
      size: "default",
    },
  }
);

export interface EffortEstimateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof effortEstimateVariants> {
  effort: EffortLevel;
  source: "ai" | "human" | "combined";
  confidence?: number;
  showDetails?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function EffortEstimate({
  className,
  effort,
  source,
  size,
  confidence,
  showDetails = false,
  ref,
  ...props
}: EffortEstimateProps) {
    const config = effortLevels[effort];
    const Icon = source === "ai" ? Sparkles : source === "human" ? User : Clock;

    return (
      <div
        ref={ref}
        data-slot="effort-estimate"
        className={cn(effortEstimateVariants({ source, size }), className)}
        {...props}
      >
        <Icon
          className={cn(
            source === "ai" && "text-[--ds-violet-500]",
            source === "human" && "text-[--ds-teal-500]",
            source === "combined" && "text-muted-foreground",
            size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4"
          )}
        />

        <div className="flex flex-col">
          <span className="font-medium">{config.label}</span>
          {showDetails && (
            <span className="text-xs text-muted-foreground">{config.days}</span>
          )}
        </div>

        {confidence !== undefined && source === "ai" && (
          <span className="text-xs text-muted-foreground">
            ({Math.round(confidence * 100)}%)
          </span>
        )}

        {/* Effort dots visualization */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "rounded-full transition-colors",
                size === "sm" ? "size-1.5" : size === "lg" ? "size-2.5" : "size-2",
                level <= config.value
                  ? source === "ai"
                    ? "bg-[--ds-violet-500]"
                    : source === "human"
                      ? "bg-[--ds-teal-500]"
                      : "bg-foreground"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    );
}

// Estimate selector for human input
interface EffortSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: EffortLevel;
  onChange: (effort: EffortLevel) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function EffortSelector({
  className,
  value,
  onChange,
  disabled = false,
  showDescriptions = true,
  ref,
  ...props
}: EffortSelectorProps) {
    const levels: EffortLevel[] = ["trivial", "small", "medium", "large", "xlarge"];

    return (
      <div
        ref={ref}
        data-slot="effort-selector"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <div className="flex gap-1">
          {levels.map((level) => {
            const config = effortLevels[level];
            const isSelected = value === level;

            return (
              <button
                key={level}
                type="button"
                disabled={disabled}
                onClick={() => onChange(level)}
                className={cn(
                  "flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  "border-2 flex flex-col items-center gap-1",
                  isSelected
                    ? "border-[--ds-teal-500] bg-[--ds-signal-bg] text-[--ds-teal-700] scale-105"
                    : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>{config.label}</span>
                {showDescriptions && (
                  <span className="text-[10px] opacity-70">{config.days}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
}

// Comparison component for AI vs Human estimates
interface EstimateComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  aiEstimate: EffortLevel;
  humanEstimate?: EffortLevel;
  aiConfidence?: number;
  showDiscrepancyWarning?: boolean;
  onHumanEstimateChange?: (effort: EffortLevel) => void;
  ref?: React.Ref<HTMLDivElement>;
}

function EstimateComparison({
  className,
  aiEstimate,
  humanEstimate,
  aiConfidence,
  showDiscrepancyWarning = true,
  onHumanEstimateChange,
  ref,
  ...props
}: EstimateComparisonProps) {
    const aiConfig = effortLevels[aiEstimate];
    const humanConfig = humanEstimate ? effortLevels[humanEstimate] : null;

    const hasDiscrepancy =
      humanEstimate &&
      Math.abs(aiConfig.value - (humanConfig?.value || 0)) >= 2;

    return (
      <div
        ref={ref}
        data-slot="estimate-comparison"
        className={cn("rounded-xl border bg-card p-4 space-y-4", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="size-4" />
            Effort Estimation
          </h4>
          {hasDiscrepancy && showDiscrepancyWarning && (
            <Badge variant="warning" size="sm" icon={<AlertTriangle />}>
              Discrepancy detected
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* AI Estimate */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-[--ds-violet-500]" />
              AI Estimate
            </div>
            <EffortEstimate
              effort={aiEstimate}
              source="ai"
              confidence={aiConfidence}
              showDetails
            />
          </div>

          {/* Human Estimate */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="size-3 text-[--ds-teal-500]" />
              Your Estimate
            </div>
            {humanEstimate ? (
              <EffortEstimate
                effort={humanEstimate}
                source="human"
                showDetails
              />
            ) : onHumanEstimateChange ? (
              <button
                onClick={() => onHumanEstimateChange("medium")}
                className="w-full h-[52px] rounded-lg border-2 border-dashed border-muted hover:border-[--ds-teal-300] transition-colors text-sm text-muted-foreground"
              >
                Add your estimate
              </button>
            ) : (
              <div className="h-[52px] rounded-lg bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
                Not provided
              </div>
            )}
          </div>
        </div>

        {/* Discrepancy explanation */}
        {hasDiscrepancy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-lg bg-[--ds-problem-bg] p-3 text-sm"
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="size-4 text-[--ds-amber-500] mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-[--ds-amber-700]">
                  Large estimation gap detected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The AI and human estimates differ significantly. Consider
                  discussing the scope and hidden complexity before committing.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
}

export {
  EffortEstimate,
  EffortSelector,
  EstimateComparison,
  effortLevels,
};
