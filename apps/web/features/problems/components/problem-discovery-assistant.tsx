"use client";

import { AssistantRuntimeProvider, useThread } from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import type { Message } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProblemThreadSync } from "../hooks/use-problem-thread-sync";
import { ProblemThread } from "./problem-thread";

const STORAGE_KEY = "seepass:discovery-chat";

interface ProblemDiscoveryAssistantProps {
  userId: string | undefined;
  onProblemConfirmed?: () => void;
}

// Load messages from localStorage
function loadMessagesFromStorage(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Validate the shape
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (m) =>
          m &&
          typeof m === "object" &&
          "id" in m &&
          "role" in m &&
          "content" in m
      );
    }
    return [];
  } catch {
    return [];
  }
}

// Save messages to localStorage
function saveMessagesToStorage(messages: Message[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage errors
  }
}

// Clear messages from localStorage
export function clearDiscoveryChat(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function ProblemDiscoveryAssistant({
  userId,
  onProblemConfirmed,
}: ProblemDiscoveryAssistantProps) {
  const [initialMessages] = useState<Message[]>(() => loadMessagesFromStorage());

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/problem-chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    initialMessages,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <div className="flex h-full w-full min-h-0 flex-col">
          <ThreadSync userId={userId} onProblemConfirmed={onProblemConfirmed} />
          <MessagePersistence />
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

// Component to handle message persistence
function MessagePersistence() {
  const thread = useThread();
  const prevMessagesRef = useRef<string>("");

  useEffect(() => {
    // Don't save while running to avoid partial state
    if (thread.isRunning) return;

    const messages = thread.messages;
    if (messages.length === 0) return;

    // Convert to AI SDK format for storage
    const messagesToStore: Message[] = messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content:
        typeof m.content === "string"
          ? m.content
          : m.content
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("\n"),
    }));

    // Only save if messages changed
    const messagesKey = JSON.stringify(messagesToStore);
    if (messagesKey !== prevMessagesRef.current) {
      prevMessagesRef.current = messagesKey;
      saveMessagesToStorage(messagesToStore);
    }
  }, [thread.messages, thread.isRunning]);

  return null;
}
