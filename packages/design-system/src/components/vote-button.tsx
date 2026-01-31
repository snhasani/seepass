"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { cn } from "../utils/cn";

const voteButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        agree:
          "bg-[--ds-status-active-bg] text-[--ds-status-active] hover:bg-[--ds-status-active]/20 border border-[--ds-status-active]/20",
        disagree:
          "bg-[--ds-severity-critical-bg] text-[--ds-severity-critical] hover:bg-[--ds-severity-critical]/20 border border-[--ds-severity-critical]/20",
        neutral:
          "bg-muted text-muted-foreground hover:bg-muted/80 border border-border",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      selected: {
        true: "ring-2 ring-offset-2",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "agree",
        selected: true,
        className: "ring-[--ds-status-active] bg-[--ds-status-active] text-white",
      },
      {
        variant: "disagree",
        selected: true,
        className:
          "ring-[--ds-severity-critical] bg-[--ds-severity-critical] text-white",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "default",
      selected: false,
    },
  }
);

export interface VoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof voteButtonVariants>, "selected"> {
  voteType: "agree" | "disagree";
  isSelected?: boolean;
  count?: number;
  showIcon?: boolean;
  showLabel?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function VoteButton({
  className,
  voteType,
  isSelected = false,
  count,
  showIcon = true,
  showLabel = true,
  size,
  ref,
  ...props
}: VoteButtonProps) {
    const Icon = voteType === "agree" ? ThumbsUp : ThumbsDown;
    const label = voteType === "agree" ? "Agree" : "Disagree";

    return (
      <motion.button
        ref={ref}
        data-slot="vote-button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          voteButtonVariants({
            variant: voteType,
            size,
            selected: isSelected,
          }),
          className
        )}
        {...props}
      >
        {showIcon && (
          <Icon
            className={cn(
              size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4"
            )}
          />
        )}
        {showLabel && <span>{label}</span>}
        {count !== undefined && (
          <span
            className={cn(
              "ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
              isSelected ? "bg-white/20" : "bg-current/10"
            )}
          >
            {count}
          </span>
        )}
      </motion.button>
    );
}

// Vote pair component for agree/disagree together
interface VotePairProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: "agree" | "disagree" | null;
  onChange: (vote: "agree" | "disagree" | null) => void;
  agreeCount?: number;
  disagreeCount?: number;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

function VotePair({
  className,
  value,
  onChange,
  agreeCount,
  disagreeCount,
  size = "default",
  disabled = false,
  ref,
  ...props
}: VotePairProps) {
    const handleVote = (voteType: "agree" | "disagree") => {
      onChange(value === voteType ? null : voteType);
    };

    return (
      <div
        ref={ref}
        data-slot="vote-pair"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <VoteButton
          voteType="agree"
          isSelected={value === "agree"}
          count={agreeCount}
          size={size}
          onClick={() => handleVote("agree")}
          disabled={disabled}
        />
        <VoteButton
          voteType="disagree"
          isSelected={value === "disagree"}
          count={disagreeCount}
          size={size}
          onClick={() => handleVote("disagree")}
          disabled={disabled}
        />
      </div>
    );
}

// Simple toggle for quick agreement
interface AgreementToggleProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
  value: boolean | null;
  onChange: (agreed: boolean | null) => void;
  label?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function AgreementToggle({
  className,
  value,
  onChange,
  label = "I agree with this assessment",
  disabled = false,
  ref,
  ...props
}: AgreementToggleProps) {
    const handleClick = () => {
      if (value === true) onChange(false);
      else if (value === false) onChange(null);
      else onChange(true);
    };

    return (
      <button
        ref={ref}
        data-slot="agreement-toggle"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all duration-200",
          value === true &&
            "border-[--ds-status-active] bg-[--ds-status-active-bg]",
          value === false &&
            "border-[--ds-severity-critical] bg-[--ds-severity-critical-bg]",
          value === null && "border-border bg-muted/30 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full transition-colors",
            value === true && "bg-[--ds-status-active] text-white",
            value === false && "bg-[--ds-severity-critical] text-white",
            value === null && "bg-muted"
          )}
        >
          {value === true && <Check className="size-3" />}
          {value === false && <X className="size-3" />}
        </div>
        <span className={cn(value !== null && "font-medium")}>{label}</span>
      </button>
    );
}

export { VoteButton, VotePair, AgreementToggle, voteButtonVariants };
