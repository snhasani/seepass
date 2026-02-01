"use client";

import { api } from "@/convex/_generated/api";
import { useAuthStore } from "@/features/auth";
import { HybridCanvas } from "@/features/problems";
import { useQuery } from "convex/react";

export default function WorkshopPage() {
  const user = useAuthStore((state) => state.user);
  const problems = useQuery(
    api.problems.list,
    user?.id ? { userId: user.id } : "skip"
  );

  if (!user?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50/50">
      <HybridCanvas className="flex-1" problems={problems ?? []} />
    </div>
  );
}
