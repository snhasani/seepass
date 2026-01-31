"use client";

import { useAuthStore } from "@/features/auth";
import { ProblemDiscoveryAssistant, ProblemsSidebar } from "@/features/problems";
import { useCallback, useState } from "react";

export default function AssistantProblemPage() {
  const user = useAuthStore((state) => state.user);
  const [key, setKey] = useState(0);

  const handleProblemConfirmed = useCallback(() => {
    setKey((k) => k + 1);
  }, []);

  if (!user?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 gap-6 p-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <ProblemDiscoveryAssistant
          key={key}
          userId={user.id}
          onProblemConfirmed={handleProblemConfirmed}
        />
      </div>
      <ProblemsSidebar userId={user.id} />
    </div>
  );
}
