"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Link2,
  MoreHorizontal,
  Sparkles,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../utils/cn";
import { ConfidenceBar } from "./confidence-indicator";
import { EffortEstimate, type EffortLevel } from "./effort-estimate";

const solutionCardVariants = cva(
  [
    "relative flex flex-col rounded-xl border bg-card text-card-foreground transition-all duration-300",
    "hover:shadow-lg",
  ],
  {
    variants: {
      variant: {
        default: "border-border hover:border-[--ds-teal-300]",
        aiSuggested:
          "border-[--ds-violet-300] bg-gradient-to-br from-[--ds-ai-bg] to-transparent",
        approved: "border-[--ds-status-active] bg-[--ds-status-active-bg]",
        rejected: "border-[--ds-severity-critical]/30 bg-muted/30 opacity-60",
        inProgress: "border-[--ds-amber-300] bg-[--ds-problem-bg]",
      },
      size: {
        sm: "p-3 gap-2",
        default: "p-4 gap-3",
        lg: "p-6 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const statusConfig = {
  proposed: {
    label: "Proposed",
    icon: Sparkles,
    color: "text-[--ds-violet-500]",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-[--ds-status-active]",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-[--ds-severity-critical]",
  },
  inProgress: {
    label: "In Progress",
    icon: Clock,
    color: "text-[--ds-amber-500]",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-[--ds-status-active]",
  },
};

export type SolutionStatus = keyof typeof statusConfig;

export interface Solution {
  id: string;
  title: string;
  description?: string;
  status: SolutionStatus;
  linkedProblems: Array<{ id: string; title: string }>;
  effort?: {
    ai?: EffortLevel;
    human?: EffortLevel;
    aiConfidence?: number;
  };
  aiConfidence?: number;
  isAiGenerated?: boolean;
  tags?: string[];
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface SolutionCardProps
  extends
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      | "children"
      | "onSelect"
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onAnimationStart"
      | "onAnimationEnd"
    >,
    VariantProps<typeof solutionCardVariants> {
  solution: Solution;
  onSelect?: (solution: Solution) => void;
  onMenuClick?: (solution: Solution) => void;
  onProblemClick?: (problemId: string) => void;
  selected?: boolean;
  compact?: boolean;
  showEffort?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function SolutionCard({
  className,
  solution,
  variant,
  size,
  onSelect,
  onMenuClick,
  onProblemClick,
  selected = false,
  compact = false,
  showEffort = true,
  ref,
  ...props
}: SolutionCardProps) {
  const effectiveVariant =
    solution.status === "approved"
      ? "approved"
      : solution.status === "rejected"
        ? "rejected"
        : solution.status === "inProgress"
          ? "inProgress"
          : solution.isAiGenerated
            ? "aiSuggested"
            : variant;

  const StatusIcon = statusConfig[solution.status].icon;

  return (
    <motion.div
      ref={ref}
      data-slot="solution-card"
      data-solution-id={solution.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        solutionCardVariants({ variant: effectiveVariant, size }),
        selected && "ring-2 ring-primary",
        onSelect && "cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(solution)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <StatusIcon
              className={cn("size-4", statusConfig[solution.status].color)}
            />
            {solution.isAiGenerated ? (
              <Badge variant="ai" size="sm">
                AI Suggested
              </Badge>
            ) : null}
            <Badge
              variant={
                solution.status === "approved"
                  ? "success"
                  : solution.status === "rejected"
                    ? "destructive"
                    : "secondary"
              }
              size="sm"
            >
              {statusConfig[solution.status].label}
            </Badge>
          </div>
          <h3 className="font-semibold truncate">{solution.title}</h3>
          {!compact && solution.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {solution.description}
            </p>
          ) : null}
        </div>

        {onMenuClick ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(solution);
            }}
            className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors"
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      {/* AI Confidence */}
      {solution.aiConfidence !== undefined ? (
        <ConfidenceBar value={solution.aiConfidence} animated={false} />
      ) : null}

      {/* Effort Estimates */}
      {showEffort && solution.effort && !compact ? (
        <div className="flex gap-2">
          {solution.effort.ai ? (
            <EffortEstimate
              effort={solution.effort.ai}
              source="ai"
              confidence={solution.effort.aiConfidence}
              size="sm"
            />
          ) : null}
          {solution.effort.human ? (
            <EffortEstimate
              effort={solution.effort.human}
              source="human"
              size="sm"
            />
          ) : null}
        </div>
      ) : null}

      {/* Linked Problems */}
      {solution.linkedProblems.length > 0 ? (
        <div className="space-y-1.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Link2 className="size-3" />
            Solves {solution.linkedProblems.length} problem
            {solution.linkedProblems.length !== 1 ? "s" : ""}
          </span>
          {!compact ? (
            <div className="flex flex-wrap gap-1">
              {solution.linkedProblems.slice(0, 3).map((problem) => (
                <button
                  key={problem.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProblemClick?.(problem.id);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-[--ds-problem-bg] text-[--ds-amber-700] hover:bg-[--ds-amber-200] transition-colors"
                >
                  <ArrowRight className="size-2.5" />
                  <span className="truncate max-w-[100px]">
                    {problem.title}
                  </span>
                </button>
              ))}
              {solution.linkedProblems.length > 3 ? (
                <span className="text-xs text-muted-foreground px-1">
                  +{solution.linkedProblems.length - 3} more
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Tags */}
      {!compact && solution.tags && solution.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1 pt-2 border-t">
          {solution.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {solution.tags.length > 4 ? (
            <Badge variant="secondary" size="sm">
              +{solution.tags.length - 4}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-end text-xs text-muted-foreground pt-2 border-t">
        <time>
          {new Date(solution.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </motion.div>
  );
}

export { SolutionCard, solutionCardVariants, statusConfig };
