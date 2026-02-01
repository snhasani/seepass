"use client";

import { useAuthStore } from "@/features/auth";
import {
  ProblemCanvas,
  ProblemDiscoveryAssistant,
  ProblemsList,
} from "@/features/problems";
import type { Problem } from "@/features/problems/types";
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, LayoutGrid, List, Plus } from "lucide-react";
import { useCallback, useState } from "react";

type ViewMode = "list" | "chat" | "workshop";

export default function AssistantProblemPage() {
  const user = useAuthStore((state) => state.user);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [scheduledProblems, setScheduledProblems] = useState<Problem[]>([]);

  const handleProblemConfirmed = useCallback(() => {
    setKey((k) => k + 1);
    setViewMode("list");
  }, []);

  const handleNewProblem = useCallback(() => {
    setKey((k) => k + 1);
    setViewMode("chat");
  }, []);

  const handleStartWorkshop = useCallback((problems: Problem[]) => {
    setScheduledProblems(problems);
    setViewMode("workshop");
  }, []);

  if (!user?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      {/* View toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center rounded-lg border bg-muted p-1">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <List className="size-4" />
            Problems
          </Button>
          <Button
            variant={viewMode === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("chat")}
            className="gap-2"
          >
            <MessageSquare className="size-4" />
            Chat
          </Button>
          <Button
            variant={viewMode === "workshop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("workshop")}
            className="gap-2"
          >
            <LayoutGrid className="size-4" />
            Workshop
          </Button>
        </div>
        {viewMode === "list" && (
          <Button onClick={handleNewProblem} className="gap-2">
            <Plus className="size-4" />
            New Problem
          </Button>
        )}
      </div>

      {/* Content area */}
      {viewMode === "list" && (
        <div className="flex min-h-0 flex-1">
          <ProblemsList
            userId={user.id}
            onNewProblem={handleNewProblem}
            onStartWorkshop={handleStartWorkshop}
          />
        </div>
      )}
      {viewMode === "chat" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <ProblemDiscoveryAssistant
            key={key}
            userId={user.id}
            onProblemConfirmed={handleProblemConfirmed}
          />
        </div>
      )}
      {viewMode === "workshop" && (
        <div className="flex min-h-0 flex-1">
          <ProblemCanvas
            className="flex-1"
            scheduledProblems={scheduledProblems}
          />
        </div>
      )}
    </div>
  );
}
