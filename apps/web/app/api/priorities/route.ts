import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const entityType = searchParams.get("entityType");
    const scenario = searchParams.get("scenario");
    const entityKey = searchParams.get("entityKey");

    if (!from || !to || !entityType) {
      return NextResponse.json(
        { error: "Missing required params: from, to, entityType" },
        { status: 400 },
      );
    }

    const where: any = {
      entityType,
      windowEnd: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    if (scenario) where.scenario = scenario;
    if (entityKey) where.entityKey = entityKey;

    const records = await prisma.patternRecord.findMany({
      where,
      orderBy: { score: "desc" },
    });

    return NextResponse.json({
      data: records,
      meta: {
        count: records.length,
        from,
        to,
        entityType,
      },
    });
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
