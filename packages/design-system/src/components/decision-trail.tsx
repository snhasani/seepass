"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  User,
  Sparkles,
  ArrowRight,
  MessageSquare,
  GitCommit,
  Calendar,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "../primitives/badge";

const decisionItemVariants = cva(
  "relative flex gap-4 pb-8 last:pb-0",
  {
    variants: {
      type: {
        ai: "",
        human: "",
        override: "",
        comment: "",
      },
    },
    defaultVariants: {
      type: "human",
    },
  }
);

export type DecisionType = "ai" | "human" | "override" | "comment";

export interface Decision {
  id: string;
  type: DecisionType;
  title: string;
  description?: string;
  author?: string;
  timestamp: Date | string;
  metadata?: {
    previousValue?: string;
    newValue?: string;
    confidence?: number;
    reasoning?: string;
  };
}

interface DecisionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof decisionItemVariants> {
  decision: Decision;
  isLast?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function DecisionItem({
  className,
  decision,
  type,
  isLast = false,
  ref,
  ...props
}: DecisionItemProps) {
    const effectiveType = type || decision.type;

    const iconConfig = {
      ai: {
        icon: Sparkles,
        color: "bg-[--ds-ai-bg] text-[--ds-violet-600]",
        lineColor: "bg-[--ds-violet-200]",
      },
      human: {
        icon: User,
        color: "bg-[--ds-signal-bg] text-[--ds-teal-600]",
        lineColor: "bg-[--ds-teal-200]",
      },
      override: {
        icon: ArrowRight,
        color: "bg-[--ds-problem-bg] text-[--ds-amber-600]",
        lineColor: "bg-[--ds-amber-200]",
      },
      comment: {
        icon: MessageSquare,
        color: "bg-muted text-muted-foreground",
        lineColor: "bg-border",
      },
    };

    const config = iconConfig[effectiveType];
    const Icon = config.icon;

    const formattedTime = new Date(decision.timestamp).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

    return (
      <motion.div
        ref={ref}
        data-slot="decision-item"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(decisionItemVariants({ type: effectiveType }), className)}
        {...props}
      >
        {/* Timeline line */}
        {!isLast && (
          <div
            className={cn(
              "absolute left-5 top-10 h-full w-0.5",
              config.lineColor
            )}
          />
        )}

        {/* Icon */}
        <div
          className={cn(
            "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
            config.color
          )}
        >
          <Icon className="size-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-medium text-sm">{decision.title}</span>
            {decision.type === "ai" && (
              <Badge variant="ai" size="sm">
                AI
              </Badge>
            )}
            {decision.type === "override" && (
              <Badge variant="warning" size="sm">
                Override
              </Badge>
            )}
          </div>

          {decision.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {decision.description}
            </p>
          )}

          {/* Override details */}
          {decision.metadata &&
            decision.metadata.previousValue &&
            decision.metadata.newValue && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="px-2 py-0.5 rounded bg-muted line-through text-muted-foreground">
                  {decision.metadata.previousValue}
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span className="px-2 py-0.5 rounded bg-[--ds-status-active-bg] text-[--ds-status-active] font-medium">
                  {decision.metadata.newValue}
                </span>
              </div>
            )}

          {/* Reasoning */}
          {decision.metadata?.reasoning && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground mb-2">
              <span className="font-medium text-foreground">Reasoning: </span>
              {decision.metadata.reasoning}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {decision.author && (
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {decision.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formattedTime}
            </span>
            {decision.metadata?.confidence !== undefined && (
              <span>
                {Math.round(decision.metadata.confidence * 100)}% confidence
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
}

// Full decision trail component
interface DecisionTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  decisions: Decision[];
  maxItems?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

function DecisionTrail({
  className,
  decisions,
  maxItems,
  showLoadMore = false,
  onLoadMore,
  ref,
  ...props
}: DecisionTrailProps) {
    const displayedDecisions = maxItems
      ? decisions.slice(0, maxItems)
      : decisions;
    const hasMore = maxItems && decisions.length > maxItems;

    return (
      <div
        ref={ref}
        data-slot="decision-trail"
        className={cn("relative", className)}
        {...props}
      >
        <div className="flex items-center gap-2 mb-6">
          <GitCommit className="size-5 text-muted-foreground" />
          <h3 className="font-semibold">Decision Trail</h3>
          <Badge variant="secondary" size="sm">
            {decisions.length} entries
          </Badge>
        </div>

        <div className="space-y-0">
          {displayedDecisions.map((decision, index) => (
            <DecisionItem
              key={decision.id}
              decision={decision}
              isLast={index === displayedDecisions.length - 1 && !hasMore}
            />
          ))}
        </div>

        {(showLoadMore || hasMore) && onLoadMore && (
          <button
            onClick={onLoadMore}
            className="mt-4 ml-14 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Load more decisions...
          </button>
        )}
      </div>
    );
}

export { DecisionTrail, DecisionItem };
