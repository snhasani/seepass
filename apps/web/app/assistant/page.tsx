"use client";

import { ProblemDiscoveryAssistant } from "@/components/problem-discovery-assistant";
import { api } from "@/convex/_generated/api";
import { useAuthStore } from "@/lib/auth-store";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

export default function AssistantProblemPage() {
  const user = useAuthStore((state) => state.user);
  const createProblem = useMutation(api.problems.create);
  const [problemId, setProblemId] = useState<Id<"problems"> | null>(null);

  useEffect(() => {
    if (!user || problemId) return;

    createProblem({ userId: user.id }).then((id) => {
      setProblemId(id);
    });
  }, [user, problemId, createProblem]);

  if (!problemId) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <ProblemDiscoveryAssistant problemId={problemId} />;
}
