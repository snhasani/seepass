"use client";

import { useAuthStore } from "@/features/auth";
import {
  ProblemDiscoveryAssistant,
  clearDiscoveryChat,
} from "@/features/problems";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight, RotateCcw, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function DiscoverPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [chatKey, setChatKey] = useState(0);

  const handleProblemConfirmed = useCallback(() => {
    clearDiscoveryChat();
    router.push("/assistant/workshop");
  }, [router]);

  const handleNewChat = useCallback(() => {
    clearDiscoveryChat();
    setChatKey((k) => k + 1);
  }, []);

  if (!user?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50/50">
      <div className="border-b bg-background px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="size-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Discover Problem</h1>
              <p className="text-xs text-muted-foreground">
                Chat with AI to identify and refine a customer problem
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <Button
            onClick={handleNewChat}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="size-3.5" />
            New Chat
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/assistant/workshop">
              Go to Workshop
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ProblemDiscoveryAssistant
          key={chatKey}
          userId={user.id}
          onProblemConfirmed={handleProblemConfirmed}
        />
      </div>
    </div>
  );
}
