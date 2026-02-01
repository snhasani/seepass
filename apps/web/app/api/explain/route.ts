import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "../convex-client";

export async function POST(request: NextRequest) {
  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json(
      { error: "Convex not configured" },
      { status: 503 }
    );
  }
  try {
    const { patternRecordId } = await request.json();

    if (!patternRecordId) {
      return NextResponse.json(
        { error: "Missing patternRecordId" },
        { status: 400 },
      );
    }

    const record = await convex.query(api.patternRecords.getById, {
      id: patternRecordId as Id<"patternRecords">,
    });

    if (!record) {
      return NextResponse.json(
        { error: "PatternRecord not found" },
        { status: 404 },
      );
    }

    const explanation = await explainPatternRecord(record.record);

    return NextResponse.json(explanation);
  } catch (error) {
    console.error("Error explaining pattern record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function explainPatternRecord(_record: any) {
  return {
    summary: "Placeholder",
    causes: [],
    actions: [],
    validate: [],
    confidence: 0.5,
  };
}
