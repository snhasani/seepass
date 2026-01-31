"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback } from "react";

export function useProblem(problemId: Id<"problems">) {
  const problem = useQuery(api.problems.get, { id: problemId });
  const confirmProblem = useMutation(api.problems.confirm);

  const confirm = useCallback(
    async (title: string, description: string) => {
      await confirmProblem({ id: problemId, title, description });
    },
    [problemId, confirmProblem]
  );

  return {
    problem,
    confirm,
  };
}
