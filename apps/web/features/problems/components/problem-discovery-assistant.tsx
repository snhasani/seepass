"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useProblemThreadSync } from "../hooks/use-problem-thread-sync";
import { ProblemThread } from "./problem-thread";

interface ProblemDiscoveryAssistantProps {
  problemId: Id<"problems">;
  onProblemConfirmed?: () => void;
}

export function ProblemDiscoveryAssistant({
  problemId,
  onProblemConfirmed,
}: ProblemDiscoveryAssistantProps) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/problem-chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div className="h-dvh">
          <ThreadSync problemId={problemId} onProblemConfirmed={onProblemConfirmed} />
          <ProblemThread />
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
}

function ThreadSync({
  problemId,
  onProblemConfirmed,
}: {
  problemId: Id<"problems">;
  onProblemConfirmed?: () => void;
}) {
  useProblemThreadSync({ problemId, onProblemConfirmed });
  return null;
}
