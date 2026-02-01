import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scenario = searchParams.get("scenario");
    const entityKey = searchParams.get("entityKey");
    const entityType = searchParams.get("entityType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minScore = searchParams.get("minScore");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Fetch records and aggregates from Convex
    const [recordsResult, aggregates] = await Promise.all([
      convex.query(api.patternRecords.list, {
        scenario: scenario || undefined,
        entityKey: entityKey || undefined,
        entityType: entityType || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minScore: minScore ? parseFloat(minScore) : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      }),
      convex.query(api.patternRecords.aggregates, {}),
    ]);

    return NextResponse.json({
      data: recordsResult.data,
      meta: recordsResult.meta,
      filters: {
        scenarios: aggregates.scenarios,
        entities: aggregates.entities,
      },
    });
  } catch (error) {
    console.error("Error fetching signals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
