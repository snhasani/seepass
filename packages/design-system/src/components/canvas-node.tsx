"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, PanInfo, useDragControls } from "framer-motion";
import { GripVertical, Lock, MoreHorizontal, Sparkles } from "lucide-react";
import * as React from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../utils/cn";

const canvasNodeVariants = cva(
  [
    "relative flex flex-col rounded-xl border bg-card text-card-foreground",
    "shadow-md transition-shadow duration-200",
    "hover:shadow-lg",
  ],
  {
    variants: {
      variant: {
        default: "border-border",
        problem: "border-[--ds-amber-300] bg-[--ds-problem-bg]",
        solution: "border-[--ds-teal-300] bg-[--ds-signal-bg]",
        aiSuggested: "border-[--ds-violet-300] bg-[--ds-ai-bg]",
        immutable:
          "border-[--ds-teal-400] bg-[--ds-signal-bg] ring-2 ring-[--ds-teal-200]",
      },
      size: {
        sm: "w-48 p-3",
        default: "w-64 p-4",
        lg: "w-80 p-5",
      },
      selected: {
        true: "ring-2 ring-primary ring-offset-2",
        false: "",
      },
      dragging: {
        true: "shadow-xl scale-105 z-50 cursor-grabbing",
        false: "cursor-grab",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      selected: false,
      dragging: false,
    },
  }
);

export interface CanvasNodeData {
  id: string;
  type: "problem" | "solution" | "note";
  title: string;
  description?: string;
  isAiGenerated?: boolean;
  isImmutable?: boolean;
  tags?: string[];
  position: { x: number; y: number };
}

export interface CanvasNodeProps
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
      | "onSelect"
    >,
    Omit<VariantProps<typeof canvasNodeVariants>, "dragging" | "selected"> {
  node: CanvasNodeData;
  selected?: boolean;
  onSelect?: (node: CanvasNodeData) => void;
  onDragEnd?: (
    node: CanvasNodeData,
    position: { x: number; y: number }
  ) => void;
  onMenuClick?: (node: CanvasNodeData) => void;
  draggable?: boolean;
  dragConstraints?: React.RefObject<HTMLElement | null>;
  ref?: React.Ref<HTMLDivElement>;
}

function CanvasNode({
  className,
  node,
  variant,
  size,
  selected = false,
  onSelect,
  onDragEnd,
  onMenuClick,
  draggable = true,
  dragConstraints,
  ref,
  ...props
}: CanvasNodeProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const dragControls = useDragControls();

  const effectiveVariant = node.isImmutable
    ? "immutable"
    : node.isAiGenerated
      ? "aiSuggested"
      : node.type === "problem"
        ? "problem"
        : node.type === "solution"
          ? "solution"
          : variant;

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd(node, {
        x: node.position.x + info.offset.x,
        y: node.position.y + info.offset.y,
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      data-slot="canvas-node"
      data-node-id={node.id}
      data-node-type={node.type}
      drag={draggable && !node.isImmutable}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 1.05 : 1,
        x: node.position.x,
        y: node.position.y,
      }}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      className={cn(
        canvasNodeVariants({
          variant: effectiveVariant,
          size,
          selected,
          dragging: isDragging,
        }),
        "absolute",
        className
      )}
      onClick={() => onSelect?.(node)}
      {...props}
    >
      {/* Drag handle */}
      {draggable && !node.isImmutable ? (
        <div
          className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-md bg-card border p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="size-4 text-muted-foreground" />
        </div>
      ) : null}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {node.isImmutable ? (
            <Lock className="size-3.5 text-[--ds-teal-500]" />
          ) : null}
          {node.isAiGenerated ? (
            <Sparkles className="size-3.5 text-[--ds-violet-500]" />
          ) : null}
          <Badge
            variant={
              node.type === "problem"
                ? "problem"
                : node.type === "solution"
                  ? "signal"
                  : "secondary"
            }
            size="sm"
          >
            {node.type}
          </Badge>
        </div>

        {onMenuClick && !node.isImmutable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(node);
            }}
            className="shrink-0 rounded-md p-1 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm line-clamp-2 mb-1">{node.title}</h4>

      {/* Description */}
      {node.description ? (
        <p className="text-xs text-muted-foreground line-clamp-3">
          {node.description}
        </p>
      ) : null}

      {/* Tags */}
      {node.tags && node.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
          {node.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {node.tags.length > 3 ? (
            <Badge variant="secondary" size="sm">
              +{node.tags.length - 3}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {/* Connection points */}
      <div className="absolute -right-1.5 top-1/2 size-3 rounded-full bg-card border-2 border-border hover:border-primary transition-colors" />
      <div className="absolute -left-1.5 top-1/2 size-3 rounded-full bg-card border-2 border-border hover:border-primary transition-colors" />
    </motion.div>
  );
}

export { CanvasNode, canvasNodeVariants };
