import type { Id } from "@/convex/_generated/dataModel";

export type ProblemStatus = "draft" | "confirmed" | "resolved";

export interface Problem {
  _id: Id<"problems">;
  userId: string;
  title?: string;
  description?: string;
  status: ProblemStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ProblemSummary {
  title: string;
  description: string;
  confidence?: number;
}

export interface ProblemQuestion {
  question: string;
  options?: string[];
  allowFreeText?: boolean;
  helperText?: string;
}
