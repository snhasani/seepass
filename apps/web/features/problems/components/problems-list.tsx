"use client";

import { api } from "@/convex/_generated/api";
import type { Problem } from "../types";
import { Button } from "@/shared/components/ui/button";
import { useQuery } from "convex/react";
import {
  Plus,
  MessageSquare,
  LayoutGrid,
  CalendarCheck,
  Archive,
} from "lucide-react";
import { useMemo } from "react";

interface ProblemsListProps {
  userId: string;
  onNewProblem: () => void;
  onStartWorkshop: (scheduledProblems: Problem[]) => void;
}

function ProblemCard({
  problem,
  index,
}: {
  problem: Problem;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50">
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
  );
}

export function ProblemsList({
  userId,
  onNewProblem,
  onStartWorkshop,
}: ProblemsListProps) {
  const problems = useQuery(api.problems.list, { userId });

  // Split problems 50/50 between scheduled and backlog (mock for now)
  const { scheduled, backlog } = useMemo(() => {
    if (!problems) return { scheduled: [], backlog: [] };
    const midpoint = Math.ceil(problems.length / 2);
    return {
      scheduled: problems.slice(0, midpoint),
      backlog: problems.slice(midpoint),
    };
  }, [problems]);

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
          <Button
            onClick={() => onStartWorkshop([])}
            variant="outline"
            className="gap-2"
          >
            <LayoutGrid className="size-4" />
            Start Workshop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto">
      {/* Scheduled for Next Iteration */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-semibold">Scheduled for Next Iteration</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {scheduled.length}
            </span>
          </div>
          {scheduled.length > 0 && (
            <Button
              onClick={() => onStartWorkshop(scheduled)}
              size="sm"
              className="gap-2"
            >
              <LayoutGrid className="size-4" />
              Plan Iteration
            </Button>
          )}
        </div>
        {scheduled.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scheduled.map((problem, index) => (
              <ProblemCard key={problem._id} problem={problem} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No problems scheduled yet. Add problems from the backlog below.
            </p>
          </div>
        )}
      </section>

      {/* Backlog */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Archive className="size-5 text-slate-500 dark:text-slate-400" />
          <h2 className="text-lg font-semibold">Backlog</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {backlog.length}
          </span>
        </div>
        {backlog.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {backlog.map((problem, index) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                index={scheduled.length + index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Backlog is empty. All problems are scheduled!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
