import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityKey = searchParams.get("entityKey");

    if (!entityKey) {
      return NextResponse.json(
        { error: "Missing required param: entityKey" },
        { status: 400 },
      );
    }

    const records = await prisma.patternRecord.findMany({
      where: { entityKey },
      orderBy: { windowStart: "asc" },
    });

    return NextResponse.json({
      data: records,
      meta: {
        entityKey,
        count: records.length,
      },
    });
  } catch (error) {
    console.error("Error fetching pattern records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
