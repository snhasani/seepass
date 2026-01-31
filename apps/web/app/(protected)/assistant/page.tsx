"use client";

import { useAuthStore } from "@/features/auth";
import {
  ProblemCanvas,
  ProblemDiscoveryAssistant,
  ProblemsSidebar,
} from "@/features/problems";
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, LayoutGrid } from "lucide-react";
import { useCallback, useState } from "react";

type ViewMode = "chat" | "canvas";

export default function AssistantProblemPage() {
  const user = useAuthStore((state) => state.user);
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("chat");

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
    <div className="flex h-full min-h-0 flex-col p-4">
      {/* View toggle */}
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex items-center rounded-lg border bg-muted p-1">
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
            variant={viewMode === "canvas" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("canvas")}
            className="gap-2"
          >
            <LayoutGrid className="size-4" />
            Canvas
          </Button>
        </div>
      </div>

      {/* Content area */}
      {viewMode === "chat" ? (
        <div className="flex min-h-0 flex-1 gap-6">
          <div className="flex min-w-0 flex-1 flex-col">
            <ProblemDiscoveryAssistant
              key={key}
              userId={user.id}
              onProblemConfirmed={handleProblemConfirmed}
            />
          </div>
          <ProblemsSidebar userId={user.id} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <ProblemCanvas className="flex-1" />
        </div>
      )}
    </div>
  );
}
