"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useProblemThreadSync } from "../hooks/use-problem-thread-sync";
import { ProblemThread } from "./problem-thread";

interface ProblemDiscoveryAssistantProps {
  userId: string | undefined;
  onProblemConfirmed?: () => void;
}

export function ProblemDiscoveryAssistant({
  userId,
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
        <div className="flex h-full min-h-0 flex-col">
          <ThreadSync
            userId={userId}
            onProblemConfirmed={onProblemConfirmed}
          />
          <ProblemThread />
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
}

function ThreadSync({
  userId,
  onProblemConfirmed,
}: {
  userId: string | undefined;
  onProblemConfirmed?: () => void;
}) {
  useProblemThreadSync({ userId, onProblemConfirmed });
  return null;
}
