import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const record = await prisma.patternRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: "PatternRecord not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching pattern record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
