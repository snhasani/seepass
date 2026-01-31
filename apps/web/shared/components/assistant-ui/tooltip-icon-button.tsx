"use client";

import { ComponentPropsWithRef } from "react";
import { Slottable } from "@radix-ui/react-slot";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export type TooltipIconButtonProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
  ref?: React.Ref<HTMLButtonElement>;
};

export function TooltipIconButton({
  children,
  tooltip,
  side = "bottom",
  className,
  ref,
  ...rest
}: TooltipIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          {...rest}
          className={cn("aui-button-icon size-6 p-1", className)}
          ref={ref}
        >
          <Slottable>{children}</Slottable>
          <span className="aui-sr-only sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
