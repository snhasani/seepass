"use client";

import { useAuthStore } from "@/features/auth";
import {
  ProblemDiscoveryAssistant,
  useCreateProblem,
} from "@/features/problems";
import { useCallback, useState } from "react";

export default function AssistantProblemPage() {
  const user = useAuthStore((state) => state.user);
  const { problemId, reset } = useCreateProblem({ userId: user?.id });
  const [key, setKey] = useState(0);

  const handleProblemConfirmed = useCallback(() => {
    reset().then(() => setKey((k) => k + 1));
  }, [reset]);

  if (!problemId) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <ProblemDiscoveryAssistant
      key={key}
      problemId={problemId}
      onProblemConfirmed={handleProblemConfirmed}
    />
  );
}
