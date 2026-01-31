import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  problems: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("confirmed"), v.literal("resolved")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  threads: defineTable({
    problemId: v.id("problems"),
    messages: v.array(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_problem", ["problemId"]),
});
