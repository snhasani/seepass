"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  Link2,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import * as React from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../utils/cn";
import { FrequencyIndicator } from "./frequency-indicator";
import { SeverityBadge, type SeverityLevel } from "./severity-badge";
import { SignalSource, type SignalSourceType } from "./signal-source";

const problemCardVariants = cva(
  [
    "relative flex flex-col rounded-xl border bg-card text-card-foreground transition-all duration-300",
    "hover:shadow-lg",
  ],
  {
    variants: {
      variant: {
        default: "border-border hover:border-[--ds-amber-300]",
        highlighted:
          "border-[--ds-amber-400] bg-[--ds-problem-bg] shadow-md ring-2 ring-[--ds-problem]/10",
        aiSuggested:
          "border-[--ds-violet-300] bg-[--ds-ai-bg] ring-2 ring-[--ds-ai]/10",
        immutable:
          "border-[--ds-teal-300] bg-[--ds-signal-bg] cursor-not-allowed",
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

export interface Problem {
  id: string;
  title: string;
  description?: string;
  severity: SeverityLevel;
  sources: Array<{
    type: SignalSourceType;
    timestamp?: Date | string;
    link?: string;
  }>;
  frequency: number;
  previousFrequency?: number;
  tags?: string[];
  clusterId?: string;
  clusterName?: string;
  aiConfidence?: number;
  isImmutable?: boolean;
  linkedSolutions?: number;
  comments?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ProblemCardProps
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
    VariantProps<typeof problemCardVariants> {
  problem: Problem;
  onSelect?: (problem: Problem) => void;
  onMenuClick?: (problem: Problem) => void;
  selected?: boolean;
  compact?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function ProblemCard({
  className,
  problem,
  variant,
  size,
  onSelect,
  onMenuClick,
  selected,
  compact = false,
  ref,
  ...props
}: ProblemCardProps) {
  const effectiveVariant = problem.isImmutable
    ? "immutable"
    : problem.aiConfidence
      ? "aiSuggested"
      : variant;

  return (
    <motion.div
      ref={ref}
      data-slot="problem-card"
      data-problem-id={problem.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        problemCardVariants({ variant: effectiveVariant, size }),
        selected && "ring-2 ring-primary",
        onSelect && "cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(problem)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {problem.isImmutable ? (
              <Lock className="size-3.5 text-[--ds-teal-500]" />
            ) : null}
            {problem.aiConfidence !== undefined ? (
              <Sparkles className="size-3.5 text-[--ds-violet-500]" />
            ) : null}
            <h3 className="font-semibold truncate">{problem.title}</h3>
          </div>
          {!compact && problem.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {problem.description}
            </p>
          ) : null}
        </div>

        {onMenuClick ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(problem);
            }}
            className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors"
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={problem.severity} size="sm" />

        {problem.clusterName ? (
          <Badge variant="signal" size="sm">
            {problem.clusterName}
          </Badge>
        ) : null}

        {problem.aiConfidence !== undefined ? (
          <Badge variant="ai" size="sm">
            {Math.round(problem.aiConfidence * 100)}% confidence
          </Badge>
        ) : null}
      </div>

      {/* Frequency */}
      {!compact ? (
        <FrequencyIndicator
          count={problem.frequency}
          previousCount={problem.previousFrequency}
          size="sm"
        />
      ) : null}

      {/* Sources */}
      <div className="flex flex-wrap items-center gap-1.5">
        {problem.sources.slice(0, compact ? 2 : 4).map((source, idx) => (
          <SignalSource
            key={idx}
            source={source.type}
            timestamp={source.timestamp}
            link={source.link}
            size="sm"
            showLabel={!compact}
          />
        ))}
        {problem.sources.length > (compact ? 2 : 4) ? (
          <span className="text-xs text-muted-foreground">
            +{problem.sources.length - (compact ? 2 : 4)} more
          </span>
        ) : null}
      </div>

      {/* Tags */}
      {!compact && problem.tags && problem.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {problem.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {problem.tags.length > 4 ? (
            <Badge variant="secondary" size="sm">
              +{problem.tags.length - 4}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {problem.linkedSolutions !== undefined &&
          problem.linkedSolutions > 0 ? (
            <span className="flex items-center gap-1">
              <Link2 className="size-3" />
              {problem.linkedSolutions}
            </span>
          ) : null}
          {problem.comments !== undefined && problem.comments > 0 ? (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              {problem.comments}
            </span>
          ) : null}
        </div>
        <time>
          {new Date(problem.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </motion.div>
  );
}

export { ProblemCard, problemCardVariants };
