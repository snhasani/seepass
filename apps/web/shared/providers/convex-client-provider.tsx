"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const url =
  process.env.NEXT_PUBLIC_CONVEX_URL?.startsWith("http") === true
    ? process.env.NEXT_PUBLIC_CONVEX_URL
    : "https://placeholder.convex.cloud";

const convex = new ConvexReactClient(url);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
