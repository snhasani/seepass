"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useThread } from "@assistant-ui/react";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseProblemThreadSyncOptions {
  problemId: Id<"problems">;
  onProblemConfirmed?: () => void;
}

export function useProblemThreadSync({
  problemId,
  onProblemConfirmed,
}: UseProblemThreadSyncOptions) {
  const thread = useThread();
  const saveMessages = useMutation(api.threads.saveMessages);
  const confirmProblem = useMutation(api.problems.confirm);
  const lastSavedRef = useRef<string>("");
  const confirmedRef = useRef(false);
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

      if (!confirmedRef.current) {
        const confirmedSummary = findConfirmedProblemSummary(messages);
        if (confirmedSummary) {
          await confirmProblem({
            id: problemId,
            title: confirmedSummary.title,
            description: confirmedSummary.description,
          });
          confirmedRef.current = true;
          onProblemConfirmed?.();
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    thread.messages,
    thread.isRunning,
    isSaving,
    problemId,
    saveMessages,
    confirmProblem,
    onProblemConfirmed,
  ]);

  useEffect(() => {
    save();
  }, [save]);

  return { isSaving };
}

interface ConfirmedSummary {
  title: string;
  description: string;
}

function findConfirmedProblemSummary(
  messages: readonly { role: string; content: readonly unknown[] }[]
): ConfirmedSummary | null {
  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.content) {
      if (!isToolCallPart(part)) continue;
      if (part.toolName !== "problem_summary") continue;

      const { args, result } = part;
      if (
        args?.title &&
        args?.description &&
        result &&
        typeof result === "object" &&
        "confirmed" in result &&
        result.confirmed === true
      ) {
        return {
          title: String(args.title),
          description: String(args.description),
        };
      }
    }
  }
  return null;
}

function isToolCallPart(
  part: unknown
): part is { type: "tool-call"; toolName: string; args?: Record<string, unknown>; result?: unknown } {
  return (
    typeof part === "object" &&
    part !== null &&
    "type" in part &&
    part.type === "tool-call"
  );
}
