import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const where: Record<string, unknown> = {};

    if (scenario) {
      where.scenario = scenario;
    }
    if (entityKey) {
      where.entityKey = entityKey;
    }
    if (entityType) {
      where.entityType = entityType;
    }
    if (startDate) {
      where.windowStart = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.windowEnd = { lte: new Date(endDate) };
    }
    if (minScore) {
      where.score = { gte: parseFloat(minScore) };
    }

    const [records, total] = await Promise.all([
      prisma.patternRecord.findMany({
        where,
        orderBy: { score: "desc" },
        take: limit ? parseInt(limit) : 50,
        skip: offset ? parseInt(offset) : 0,
      }),
      prisma.patternRecord.count({ where }),
    ]);

    const scenarios = await prisma.patternRecord.groupBy({
      by: ["scenario"],
      _count: true,
    });

    const entities = await prisma.patternRecord.groupBy({
      by: ["entityKey"],
      _count: true,
    });

    return NextResponse.json({
      data: records,
      meta: {
        total,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      },
      filters: {
        scenarios: scenarios.map((s) => ({ value: s.scenario, count: s._count })),
        entities: entities.map((e) => ({ value: e.entityKey, count: e._count })),
      },
    });
  } catch (error) {
    console.error("Error fetching signals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
