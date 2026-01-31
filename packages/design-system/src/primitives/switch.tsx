"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=unchecked]:bg-input",
  ],
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-[--ds-teal-500]",
        problem: "data-[state=checked]:bg-[--ds-problem]",
        ai: "data-[state=checked]:bg-[--ds-ai]",
        success: "data-[state=checked]:bg-[--ds-status-active]",
        danger: "data-[state=checked]:bg-[--ds-severity-critical]",
      },
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-background shadow-lg ring-0",
    "transition-transform duration-200",
  ],
  {
    variants: {
      size: {
        sm: "size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        default:
          "size-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "size-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  label?: string;
  description?: string;
  ref?: React.Ref<React.ElementRef<typeof SwitchPrimitive.Root>>;
}

function Switch({
  className,
  variant,
  size,
  label,
  description,
  ref,
  ...props
}: SwitchProps) {
  const switchElement = (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(thumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );

  if (label || description) {
    return (
      <label className="flex cursor-pointer items-start gap-3">
        {switchElement}
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-medium">{label}</span>}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </label>
    );
  }

  return switchElement;
}

export { Switch };
