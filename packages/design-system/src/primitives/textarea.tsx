"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const textareaVariants = cva(
  [
    "flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm",
    "ring-offset-background transition-all duration-200",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "border-input",
        problem: "border-[var(--ds-amber-300)] focus-visible:ring-[var(--ds-problem)]",
        ai: "border-[var(--ds-violet-300)] focus-visible:ring-[var(--ds-ai)]",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      resize: "vertical",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  hint?: string;
  error?: string;
  charCount?: boolean;
  maxLength?: number;
  ref?: React.Ref<HTMLTextAreaElement>;
}

function Textarea({
  className,
  variant,
  resize,
  label,
  hint,
  error,
  charCount,
  maxLength,
  value,
  ref,
  ...props
}: TextareaProps) {
  const [charLength, setCharLength] = React.useState(
    typeof value === "string" ? value.length : 0
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharLength(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium">{label}</label>
      )}
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          textareaVariants({ variant, resize }),
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
        {(hint || error) && (
          <span className={cn(error && "text-destructive")}>
            {error || hint}
          </span>
        )}
        {charCount && maxLength && (
          <span
            className={cn(
              "ml-auto tabular-nums",
              charLength > maxLength * 0.9 && "text-[var(--ds-status-pending)]",
              charLength >= maxLength && "text-destructive"
            )}
          >
            {charLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export { Textarea, textareaVariants };
