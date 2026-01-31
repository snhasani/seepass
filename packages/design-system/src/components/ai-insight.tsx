"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import * as React from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../utils/cn";
import { ConfidenceBar } from "./confidence-indicator";

const aiInsightVariants = cva(
  "relative rounded-xl border transition-all duration-300 shadow-[--ds-shadow-sm]",
  {
    variants: {
      variant: {
        default:
          "bg-[--ds-gradient-card] border-border shadow-[--ds-shadow-xs] hover:border-[--ds-indigo-200] hover:shadow-[--ds-shadow-md]",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const insightIcons = {
  recommendation: Lightbulb,
  pattern: Sparkles,
  warning: AlertTriangle,
  trend: TrendingUp,
};

export type InsightType = keyof typeof insightIcons;

export interface AIInsightProps
  extends
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onDragOver"
      | "onDragEnter"
      | "onDragLeave"
      | "onDrop"
      | "onAnimationStart"
      | "onAnimationEnd"
    >,
    VariantProps<typeof aiInsightVariants> {
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  explanation?: string;
  relatedProblems?: string[];
  onFeedback?: (isPositive: boolean) => void;
  onDismiss?: () => void;
  expandable?: boolean;
  defaultExpanded?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function AIInsight({
  className,
  type,
  title,
  description,
  confidence,
  explanation,
  relatedProblems,
  onFeedback,
  onDismiss,
  variant,
  size,
  expandable = true,
  defaultExpanded = false,
  ref,
  ...props
}: AIInsightProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [feedbackGiven, setFeedbackGiven] = React.useState<
    "positive" | "negative" | null
  >(null);

  const Icon = insightIcons[type];

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackGiven(isPositive ? "positive" : "negative");
    onFeedback?.(isPositive);
  };

  return (
    <motion.div
      ref={ref}
      data-slot="ai-insight"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={cn(aiInsightVariants({ variant, size }), className)}
      {...props}
    >
      {/* Animated gradient accent */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[--ds-violet-400] via-[--ds-teal-400] to-[--ds-amber-400] opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />

      {/* Header */}
      <div className="relative flex items-start gap-3">
        <div className={cn("shrink-0 rounded-lg p-2")}>
          <Icon className="size-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="ai" size="sm">
              AI Insight
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {type}
            </span>
          </div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {expandable && explanation ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors"
          >
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        ) : null}
      </div>

      {/* Confidence */}
      <div className="relative mt-4">
        <ConfidenceBar value={confidence} />
      </div>

      {/* Expandable Section */}
      <AnimatePresence>
        {isExpanded && (explanation || relatedProblems) ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative pt-4 mt-4 border-t border-border/50">
              {explanation ? (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <HelpCircle className="size-3" />
                    Why this insight?
                  </div>
                  <p className="text-sm text-muted-foreground">{explanation}</p>
                </div>
              ) : null}

              {relatedProblems && relatedProblems.length > 0 ? (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Related Problems
                  </div>
                  <ul className="space-y-1">
                    {relatedProblems.map((problem, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-[--ds-teal-400]" />
                        {problem}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Feedback */}
      {onFeedback ? (
        <div className="relative mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Was this helpful?
          </span>
          <div className="flex items-center gap-2">
            {feedbackGiven ? (
              <span className="text-xs text-muted-foreground">
                Thanks for your feedback!
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleFeedback(true)}
                  className="rounded-md p-1.5 hover:bg-[--ds-status-active-bg] transition-colors"
                >
                  <ThumbsUp className="size-4 text-muted-foreground hover:text-[--ds-status-active]" />
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="rounded-md p-1.5 hover:bg-[--ds-severity-critical-bg] transition-colors"
                >
                  <ThumbsDown className="size-4 text-muted-foreground hover:text-[--ds-severity-critical]" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export { AIInsight, aiInsightVariants };
