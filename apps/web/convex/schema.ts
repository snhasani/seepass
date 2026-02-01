import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  discovers: defineTable({
    userId: v.string(),
    signalId: v.optional(v.id("patternRecords")),
    title: v.optional(v.string()),
    signalContext: v.optional(v.object({
      scenario: v.string(),
      entityKey: v.string(),
      summary: v.string(),
      metrics: v.any(),
    })),
    prePrompts: v.optional(v.array(v.string())),
    messages: v.array(v.any()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_signal", ["signalId"])
    .index("by_status", ["userId", "status"]),

  problems: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("confirmed"),
      v.literal("resolved")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  threads: defineTable({
    problemId: v.id("problems"),
    messages: v.array(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_problem", ["problemId"]),

  patternRecords: defineTable({
    scenario: v.string(),
    entityType: v.string(),
    entityKey: v.string(),
    windowStart: v.string(),
    windowEnd: v.string(),
    score: v.number(),
    record: v.any(),
  })
    .index("by_entity", ["entityKey"])
    .index("by_scenario", ["scenario"])
    .index("by_score", ["score"])
    .index("by_window", ["windowStart", "windowEnd"]),
  
  waitlist: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
