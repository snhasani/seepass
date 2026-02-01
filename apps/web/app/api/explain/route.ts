import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
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
