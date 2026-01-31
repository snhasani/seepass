"use client";

import { api } from "@/convex/_generated/api";
import { Button } from "@/shared/components/ui/button";
import { useQuery } from "convex/react";
import { Plus, MessageSquare, LayoutGrid } from "lucide-react";

interface ProblemsListProps {
  userId: string;
  onNewProblem: () => void;
  onStartWorkshop: () => void;
}

export function ProblemsList({
  userId,
  onNewProblem,
  onStartWorkshop,
}: ProblemsListProps) {
  const problems = useQuery(api.problems.list, { userId });

  if (!problems) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No problems yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start by discovering a new problem or begin a workshop session.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onNewProblem} className="gap-2">
            <Plus className="size-4" />
            New Problem
          </Button>
          <Button onClick={onStartWorkshop} variant="outline" className="gap-2">
            <LayoutGrid className="size-4" />
            Start Workshop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem, index) => (
          <div
            key={problem._id}
            className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground">
                  {problem.title ?? "Draft problem"}
                </h3>
                {problem.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {problem.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  problem.status === "confirmed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {problem.status === "confirmed" ? "Confirmed" : "In progress"}
              </span>
              <Button size="sm" variant="ghost" className="gap-1.5">
                <MessageSquare className="size-3.5" />
                Discuss
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
