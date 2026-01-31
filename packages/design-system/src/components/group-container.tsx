"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { FolderOpen, Lock, MoreHorizontal, ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";
import { Badge } from "../primitives/badge";

const groupContainerVariants = cva(
  [
    "relative rounded-2xl border-2 border-dashed transition-all duration-200",
    "min-h-[200px] min-w-[300px]",
  ],
  {
    variants: {
      variant: {
        default: "border-border/50 bg-muted/20",
        problems:
          "border-[--ds-amber-200] bg-[--ds-problem-bg]/30 dark:border-[--ds-amber-700]",
        solutions:
          "border-[--ds-teal-200] bg-[--ds-signal-bg]/30 dark:border-[--ds-teal-700]",
        cluster:
          "border-[--ds-violet-200] bg-[--ds-ai-bg]/30 dark:border-[--ds-violet-700]",
      },
      collapsed: {
        true: "min-h-0 h-auto",
        false: "",
      },
      dropTarget: {
        true: "border-solid border-primary bg-primary/5 scale-[1.02]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
      dropTarget: false,
    },
  }
);

export interface GroupContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof groupContainerVariants>, "dropTarget" | "collapsed"> {
  title: string;
  description?: string;
  itemCount?: number;
  isLocked?: boolean;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  isDropTarget?: boolean;
  onTitleChange?: (title: string) => void;
  onMenuClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

function GroupContainer({
  className,
  title,
  description,
  itemCount,
  variant,
  isLocked = false,
  isCollapsible = true,
  defaultCollapsed = false,
  isDropTarget = false,
  onTitleChange,
  onMenuClick,
  children,
  ref,
  ...props
}: GroupContainerProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(title);

    const handleTitleSubmit = () => {
      if (editTitle.trim() && editTitle !== title) {
        onTitleChange?.(editTitle.trim());
      } else {
        setEditTitle(title);
      }
      setIsEditing(false);
    };

    return (
      <motion.div
        ref={ref}
        data-slot="group-container"
        layout
        className={cn(
          groupContainerVariants({
            variant,
            collapsed: isCollapsed,
            dropTarget: isDropTarget,
          }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 pb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FolderOpen
              className={cn(
                "size-5 shrink-0",
                variant === "problems" && "text-[--ds-amber-500]",
                variant === "solutions" && "text-[--ds-teal-500]",
                variant === "cluster" && "text-[--ds-violet-500]"
              )}
            />

            {isEditing && !isLocked ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit();
                  if (e.key === "Escape") {
                    setEditTitle(title);
                    setIsEditing(false);
                  }
                }}
                className="flex-1 bg-transparent border-b border-primary outline-none font-semibold"
                autoFocus
              />
            ) : (
              <h3
                className={cn(
                  "font-semibold truncate",
                  !isLocked && onTitleChange && "cursor-text hover:text-primary"
                )}
                onClick={() => !isLocked && onTitleChange && setIsEditing(true)}
              >
                {title}
              </h3>
            )}

            {isLocked && <Lock className="size-4 text-muted-foreground" />}

            {itemCount !== undefined && (
              <Badge variant="secondary" size="sm">
                {itemCount}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onMenuClick && !isLocked && (
              <button
                onClick={onMenuClick}
                className="rounded-md p-1 hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </button>
            )}

            {isCollapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="rounded-md p-1 hover:bg-muted transition-colors"
              >
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    isCollapsed && "-rotate-90"
                  )}
                />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {description && !isCollapsed && (
          <p className="px-4 pb-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* Content */}
        <motion.div
          initial={false}
          animate={{
            height: isCollapsed ? 0 : "auto",
            opacity: isCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-4 pt-2">{children}</div>
        </motion.div>
      </motion.div>
    );
}

export { GroupContainer, groupContainerVariants };
