"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface ProblemsSidebarProps {
  userId: string | undefined;
}

export function ProblemsSidebar({ userId }: ProblemsSidebarProps) {
  const problems = useQuery(
    api.problems.list,
    userId ? { userId } : "skip"
  );

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Problems
        </h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {problems && problems.length > 0 ? (
          problems.map((problem, index) => (
            <div
              key={problem._id}
              className="flex items-start gap-3 rounded-xl border px-3 py-2 text-sm"
            >
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <div className="space-y-1">
                <div className="font-medium text-foreground">
                  {problem.title ?? "Draft problem"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {problem.status === "confirmed"
                    ? "Confirmed"
                    : "In progress"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed px-3 py-4 text-xs text-muted-foreground">
            No problems yet.
          </div>
        )}
      </div>
    </aside>
  );
}
