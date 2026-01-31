"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";

interface UseCreateProblemOptions {
  userId: string | undefined;
  autoCreate?: boolean;
}

export function useCreateProblem({ userId, autoCreate = true }: UseCreateProblemOptions) {
  const createProblem = useMutation(api.problems.create);
  const [problemId, setProblemId] = useState<Id<"problems"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const create = useCallback(async () => {
    if (!userId || isCreating) return null;

    setIsCreating(true);
    try {
      const id = await createProblem({ userId });
      setProblemId(id);
      return id;
    } finally {
      setIsCreating(false);
    }
  }, [userId, isCreating, createProblem]);

  const reset = useCallback(async () => {
    setProblemId(null);
    return create();
  }, [create]);

  useEffect(() => {
    if (autoCreate && userId && !problemId && !isCreating) {
      create();
    }
  }, [autoCreate, userId, problemId, isCreating, create]);

  return {
    problemId,
    isCreating,
    create,
    reset,
  };
}
