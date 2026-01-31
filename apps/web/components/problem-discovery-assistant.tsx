"use client";

import { ProblemThread } from "@/components/assistant-ui/problem-thread";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AssistantRuntimeProvider, useThread } from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useMutation } from "convex/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProblemDiscoveryAssistantProps {
  problemId: Id<"problems">;
}

export const ProblemDiscoveryAssistant = ({
  problemId,
}: ProblemDiscoveryAssistantProps) => {
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
          <ConvexSync problemId={problemId} />
          <ProblemThread />
        </div>
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
};

function ConvexSync({ problemId }: { problemId: Id<"problems"> }) {
  const thread = useThread();
  const saveMessages = useMutation(api.threads.saveMessages);
  const confirmProblem = useMutation(api.problems.confirm);
  const lastSavedRef = useRef<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(async () => {
    if (thread.isRunning || isSaving) return;

    const messages = thread.messages;
    const serialized = JSON.stringify(messages);

    if (serialized === lastSavedRef.current) return;

    setIsSaving(true);
    try {
      await saveMessages({ problemId, messages: [...messages] });
      lastSavedRef.current = serialized;

      // Check if problem_summary was called and extract title/description
      for (const message of messages) {
        if (message.role === "assistant") {
          for (const part of message.content) {
            if (
              part.type === "tool-call" &&
              part.toolName === "problem_summary" &&
              part.args?.title &&
              part.args?.description
            ) {
              await confirmProblem({
                id: problemId,
                title: part.args.title as string,
                description: part.args.description as string,
              });
            }
          }
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [thread.messages, thread.isRunning, isSaving, problemId, saveMessages, confirmProblem]);

  useEffect(() => {
    save();
  }, [save]);

  return null;
}
