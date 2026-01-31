"use client";

import { ProblemThread } from "@/components/assistant-ui/problem-thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";

export const ProblemDiscoveryAssistant = () => {
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
          <ProblemThread />
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
};
