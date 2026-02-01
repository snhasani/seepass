"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthStore } from "@/features/auth";
import {
  SurfacingCard,
  SurfacingEmptyState,
  RecentChatsList,
  ProjectStatusCard,
  type SurfacingType,
  type ChatItem,
} from "@/shared/components/dashboard";
import { ArrowRight } from "lucide-react";

const mockSurfacingItems: Array<{
  type: SurfacingType;
  title: string;
  description: string;
  affectedAccounts?: number;
  revenueAtRisk?: number;
  windowStart?: string;
  windowEnd?: string;
}> = [
  {
    type: "investigate",
    title: "Checkout",
    description: "Error spike detected — 3x baseline rate affecting payment flow",
    affectedAccounts: 83,
    revenueAtRisk: 1299,
    windowStart: "2025-11-01",
    windowEnd: "2025-11-07",
  },
  {
    type: "monitor",
    title: "Product Page",
    description: "Dropoff rate trending up, ticket volume steady",
    affectedAccounts: 44,
    revenueAtRisk: 969,
    windowStart: "2025-11-08",
    windowEnd: "2025-11-14",
  },
  {
    type: "note",
    title: "Search",
    description: "Weekday seasonality pattern — stable baseline, no action needed",
    windowStart: "2025-11-01",
    windowEnd: "2025-11-07",
  },
];

function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = "View all",
}: {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const problems = useQuery(
    api.problems.listRecent,
    user?.id ? { userId: user.id, limit: 5 } : "skip"
  );

  const recentChats: ChatItem[] =
    problems?.map((p) => ({
      id: p._id,
      title: p.title || "Draft problem",
      updatedAt: p.updatedAt,
      status: p.status,
    })) ?? [];

  const handleSelectChat = (id: string) => {
    router.push(`/assistant?problem=${id}`);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <section>
          <SectionHeader title="What's Surfacing" viewAllHref="/insights" />
          {mockSurfacingItems.length === 0 ? (
            <SurfacingEmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockSurfacingItems.map((item, idx) => (
                <SurfacingCard key={idx} {...item} />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col">
            <SectionHeader title="Recent Chats" viewAllHref="/assistant" viewAllLabel="View all chats" />
            <RecentChatsList
              chats={recentChats}
              onSelect={handleSelectChat}
              className="flex-1"
            />
          </div>
          <div className="flex flex-col">
            <SectionHeader title="Where Things Stand" viewAllHref="/project" viewAllLabel="View project" />
            <ProjectStatusCard className="flex-1" />
          </div>
        </section>
      </div>
    </div>
  );
}
