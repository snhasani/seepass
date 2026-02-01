"use client";

import { useAuthStore } from "@/features/auth";
import {
  ProblemDiscoveryAssistant,
  clearDiscoveryChat,
} from "@/features/problems";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function SignalContextHeader({ discover }: { discover: NonNullable<ReturnType<typeof useDiscover>> }) {
  const signal = discover.signal;
  if (!signal) return null;

  const scenarioLabel = signal.scenario.replace(/_/g, " ");
  const entityLabel = signal.entityKey.replace(/^\//, "").split(/[-_]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="border-b bg-background px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Link href="/signals" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="size-3" />
          Back to Signals
        </Link>
        <span>•</span>
        <span className="capitalize">{scenarioLabel}</span>
      </div>
      <h1 className="text-sm font-semibold text-foreground">Exploring: {entityLabel}</h1>
      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
        {signal.record?.signals?.affected_accounts && (
          <span>{signal.record.signals.affected_accounts} accounts affected</span>
        )}
        {signal.record?.signals?.revenue_at_risk && (
          <span>${(signal.record.signals.revenue_at_risk / 1000).toFixed(1)}k at risk</span>
        )}
        <span>Score: {signal.score.toFixed(1)}</span>
      </div>
    </div>
  );
}

function RelatedDiscoversSidebar({ currentId, discovers }: { currentId: string; discovers: Array<{ _id: Id<"discovers">; title?: string; signalContext?: { scenario: string; entityKey: string } }> }) {
  const otherDiscovers = discovers.filter(d => d._id !== currentId).slice(0, 5);
  if (otherDiscovers.length === 0) return null;

  return (
    <div className="w-64 shrink-0 border-l bg-slate-50/50 p-4 overflow-y-auto hidden lg:block">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Recent Discoveries
      </h3>
      <div className="space-y-2">
        {otherDiscovers.map((discover) => {
          const title = discover.title || "Untitled";
          return (
            <Link
              key={discover._id}
              href={`/assistant/discover/${discover._id}`}
              className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="size-3.5 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{title}</p>
                  {discover.signalContext && (
                    <p className="text-xs text-muted-foreground truncate capitalize">
                      {discover.signalContext.scenario.replace(/_/g, " ")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function useDiscover(discoverId: Id<"discovers">) {
  return useQuery(api.discovers.getById, { id: discoverId });
}

export default function DiscoverDetailPage() {
  const router = useRouter();
  const params = useParams();
  const discoverId = params.discoverId as Id<"discovers">;
  const user = useAuthStore((state) => state.user);
  const [chatKey, setChatKey] = useState(0);

  const discover = useDiscover(discoverId);
  const userDiscovers = useQuery(
    api.discovers.listByUser,
    user?.id ? { userId: user.id, limit: 10 } : "skip"
  );

  const handleProblemConfirmed = useCallback(() => {
    clearDiscoveryChat();
    router.push("/assistant/workshop");
  }, [router]);

  if (!user?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (discover === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (discover === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Discovery not found</p>
      </div>
    );
  }

  const signalContext = discover.signalContext ? {
    id: discover.signalId || "",
    scenario: discover.signalContext.scenario,
    entityKey: discover.signalContext.entityKey,
    summary: discover.signalContext.summary,
    metrics: discover.signalContext.metrics,
  } : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50/50">
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 min-h-0 flex-col">
          {discover.signal && <SignalContextHeader discover={discover} />}
          <div className="flex-1 min-h-0">
            <ProblemDiscoveryAssistant
              key={chatKey}
              userId={user.id}
              onProblemConfirmed={handleProblemConfirmed}
              signalContext={signalContext}
              prePrompts={discover.prePrompts ?? undefined}
              discoverId={discoverId}
            />
          </div>
        </div>
        {userDiscovers && (
          <RelatedDiscoversSidebar
            currentId={discover._id}
            discovers={userDiscovers}
          />
        )}
      </div>
    </div>
  );
}
