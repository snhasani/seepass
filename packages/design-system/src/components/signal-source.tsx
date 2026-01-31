"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  FileText,
  GitBranch,
  Headphones,
  Mail,
  MessageSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

const sourceConfig: Record<
  string,
  { icon: LucideIcon; label: string; color: string }
> = {
  slack: {
    icon: MessageSquare,
    label: "Slack",
    color: "bg-[#4A154B] text-white",
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "bg-[--ds-teal-500] text-white",
  },
  support: {
    icon: Headphones,
    label: "Support",
    color: "bg-[--ds-amber-500] text-white",
  },
  interview: {
    icon: Users,
    label: "Interview",
    color: "bg-[--ds-violet-500] text-white",
  },
  document: {
    icon: FileText,
    label: "Document",
    color: "bg-slate-500 text-white",
  },
  repo: {
    icon: GitBranch,
    label: "Repository",
    color: "bg-slate-700 text-white",
  },
};

const signalSourceVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md font-medium transition-all duration-200",
  {
    variants: {
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        default: "px-2 py-1 text-xs",
        lg: "px-2.5 py-1.5 text-sm",
      },
      showLabel: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      showLabel: true,
    },
  }
);

export type SignalSourceType = keyof typeof sourceConfig;

export interface SignalSourceProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof signalSourceVariants> {
  source: SignalSourceType;
  timestamp?: Date | string;
  link?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

function SignalSource({
  className,
  source,
  size,
  showLabel,
  timestamp,
  link,
  ref,
  ...props
}: SignalSourceProps) {
  const config = sourceConfig[source] || sourceConfig.document;
  const Icon = config.icon;

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const content = (
    <span
      ref={ref}
      data-slot="signal-source"
      className={cn(
        signalSourceVariants({ size, showLabel }),
        config.color,
        className
      )}
      {...props}
    >
      <Icon
        className={cn(
          size === "sm" ? "size-3" : size === "lg" ? "size-4" : "size-3.5"
        )}
      />
      {showLabel && <span>{config.label}</span>}
      {formattedTime && <span className="opacity-75">· {formattedTime}</span>}
    </span>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
}

export { SignalSource, sourceConfig };
