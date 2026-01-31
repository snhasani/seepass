"use client";

import { motion } from "framer-motion";
import {
  Headphones,
  MessageSquare,
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  type NodeSource,
  type ShowcaseNodeData,
  SPRING_EASING,
} from "./animation-config";

const sourceConfig: Record<
  NodeSource,
  { icon: LucideIcon; label: string; bgClass: string }
> = {
  support: {
    icon: Headphones,
    label: "Support",
    bgClass: "bg-amber-500",
  },
  slack: {
    icon: MessageSquare,
    label: "Slack",
    bgClass: "bg-[#4A154B]",
  },
  email: {
    icon: Mail,
    label: "Email",
    bgClass: "bg-teal-500",
  },
  interview: {
    icon: Users,
    label: "Interview",
    bgClass: "bg-violet-500",
  },
};

interface ShowcaseNodeProps {
  node: ShowcaseNodeData;
  isVisible: boolean;
  isClustering: boolean;
  viewportWidth: number;
  viewportHeight: number;
  className?: string;
}

export function ShowcaseNode({
  node,
  isVisible,
  isClustering,
  viewportWidth,
  viewportHeight,
  className,
}: ShowcaseNodeProps) {
  const config = sourceConfig[node.source];
  const Icon = config.icon;

  // Calculate pixel positions
  const targetPosition =
    isClustering && node.clusteredPosition
      ? node.clusteredPosition
      : node.initialPosition;

  const x = targetPosition.x * viewportWidth;
  const y = targetPosition.y * viewportHeight;

  // Entry position based on direction
  const getEntryPosition = () => {
    switch (node.entryFrom) {
      case "left":
        return { x: -200, y };
      case "right":
        return { x: viewportWidth + 200, y };
      case "top":
        return { x, y: -200 };
      case "bottom":
        return { x, y: viewportHeight + 200 };
    }
  };

  const entryPosition = getEntryPosition();

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute",
        "w-[160px] sm:w-[180px]",
        className,
      )}
      style={{
        left: 0,
        top: 0,
      }}
      initial={{
        x: entryPosition.x,
        y: entryPosition.y,
        opacity: 0,
        scale: 0.5,
      }}
      animate={
        isVisible
          ? {
              x: x - 80, // Center the node (half of width)
              y: y - 40, // Center the node (approximate half of height)
              opacity: 1,
              scale: 1,
            }
          : {
              x: entryPosition.x,
              y: entryPosition.y,
              opacity: 0,
              scale: 0.5,
            }
      }
      transition={{
        duration: 0.6,
        ease: SPRING_EASING as unknown as [number, number, number, number],
      }}
    >
      <div
        className={cn(
          "rounded-xl border-2 border-amber-300 bg-white p-3 shadow-lg",
          "transition-shadow duration-300",
        )}
      >
        {/* Source badge */}
        <div
          className={cn(
            "mb-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-[10px] text-white",
            config.bgClass,
          )}
        >
          <Icon className="size-3" />
          <span>{config.label}</span>
        </div>

        {/* Title */}
        <p className="font-medium text-slate-800 text-xs leading-tight">
          {node.title}
        </p>
      </div>
    </motion.div>
  );
}
