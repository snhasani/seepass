"use client";

import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface StatusItem {
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
}

export interface ProjectStatusCardProps {
  items?: StatusItem[];
  className?: string;
}

function StatusRow({ item }: { item: StatusItem }) {
  const content = (
    <>
      <span className="size-2 shrink-0 rounded-sm bg-slate-300" />
      <span className="flex-1 text-sm text-slate-700">
        <span className="font-medium">{item.label}</span>
        {item.value && (
          <span className="text-muted-foreground">: {item.value}</span>
        )}
      </span>
      {(item.href || item.onClick) && (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const rowClass =
    "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-slate-100";

  if (item.href) {
    return (
      <Link href={item.href} className={rowClass}>
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} className={cn(rowClass, "w-full text-left")}>
        {content}
      </button>
    );
  }

  return (
    <div className={cn(rowClass, "cursor-default hover:bg-transparent")}>
      {content}
    </div>
  );
}

const defaultItems: StatusItem[] = [
  { label: "Sprint Progress", value: "8/12 tasks", href: "/sprints" },
  { label: "Next Release", value: "v1.2", href: "/releases" },
  { label: "Key Milestones", href: "/milestones" },
];

export function ProjectStatusCard({
  items = defaultItems,
  className,
}: ProjectStatusCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {items.map((item, idx) => (
          <StatusRow key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
