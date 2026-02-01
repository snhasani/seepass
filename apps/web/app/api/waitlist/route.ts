import { api } from "@/convex/_generated/api";
import { getConvexClient } from "../convex-client";
import { NextResponse } from "next/server";

// Qualified roles that can book a call
const QUALIFIED_ROLES = [
  "Product Manager",
  "Head of Product / VP Product",
  "Chief Product Officer",
  "Founder / CEO",
  "Product Designer",
  "Product Owner",
  "Engineering (Product-focused)",
];

export async function POST(request: Request) {
  const convex = getConvexClient();
  if (!convex) {
    return NextResponse.json(
      { error: "Convex not configured" },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { name, email, company, role } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(api.waitlist.join, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: company?.trim() || undefined,
      role: role || undefined,
    });

    // Determine if user is qualified for booking
    const isQualified = role ? QUALIFIED_ROLES.includes(role) : false;

    return NextResponse.json({
      success: true,
      isUpdate: result.isUpdate,
      isQualified,
      bookingUrl: isQualified ? "https://cal.com/seepass/15min" : null,
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
