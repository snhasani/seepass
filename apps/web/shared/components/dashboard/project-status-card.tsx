"use client";

import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface StatusItem {
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
}

export interface ProjectStatusCardProps {
  title?: string;
  items: StatusItem[];
  className?: string;
}

function StatusRow({ item }: { item: StatusItem }) {
  const content = (
    <>
      <span className="size-2 shrink-0 rounded-sm bg-slate-300" />
      <span className="flex-1 text-sm">
        <span className="font-medium text-foreground">{item.label}</span>
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
    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50";

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
  title = "Where Things Stand",
  items = defaultItems,
  className,
}: ProjectStatusCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0.5">
          {items.map((item, idx) => (
            <StatusRow key={idx} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
