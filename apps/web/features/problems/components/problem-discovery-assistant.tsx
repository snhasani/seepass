"use client";

import { AssistantRuntimeProvider, useThread } from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useProblemThreadSync } from "../hooks/use-problem-thread-sync";
import { ProblemThread } from "./problem-thread";

const STORAGE_KEY = "seepass:discovery-chat";

interface SignalContext {
  id: string;
  scenario: string;
  entityKey: string;
  summary: string;
  metrics: Record<string, unknown>;
}

interface ProblemDiscoveryAssistantProps {
  userId: string | undefined;
  onProblemConfirmed?: () => void;
  signalContext?: SignalContext;
  prePrompts?: string[];
  discoverId?: Id<"discovers">;
}

interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function saveMessagesToStorage(messages: StoredMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
  }
}

export function clearDiscoveryChat(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

export function ProblemDiscoveryAssistant({
  userId,
  onProblemConfirmed,
  signalContext,
  prePrompts,
  discoverId,
}: ProblemDiscoveryAssistantProps) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/problem-chat",
      body: signalContext ? { signalContext } : undefined,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div className="flex h-full w-full min-h-0 flex-col">
          <ThreadSync userId={userId} onProblemConfirmed={onProblemConfirmed} />
          <MessagePersistence discoverId={discoverId} />
          <ProblemThread prePrompts={prePrompts} signalContext={signalContext} />
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

function MessagePersistence({ discoverId }: { discoverId?: Id<"discovers"> }) {
  const thread = useThread();
  const prevMessagesRef = useRef<string>("");
  const updateMessages = useMutation(api.discovers.updateMessages);

  useEffect(() => {
    if (thread.isRunning) return;

    const messages = thread.messages;
    if (messages.length === 0) return;

    const messagesToStore: StoredMessage[] = messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content:
        typeof m.content === "string"
          ? m.content
          : m.content
              .filter(
                (p): p is { type: "text"; text: string } => p.type === "text"
              )
              .map((p) => p.text)
              .join("\n"),
    }));

    const messagesKey = JSON.stringify(messagesToStore);
    if (messagesKey !== prevMessagesRef.current) {
      prevMessagesRef.current = messagesKey;
      if (discoverId) {
        updateMessages({ id: discoverId, messages: messagesToStore });
      } else {
        saveMessagesToStorage(messagesToStore);
      }
    }
  }, [thread.messages, thread.isRunning, discoverId, updateMessages]);

  return null;
}
