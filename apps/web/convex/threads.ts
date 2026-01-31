import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByProblem = query({
  args: { problemId: v.id("problems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_problem", (q) => q.eq("problemId", args.problemId))
      .first();
  },
});

export const create = mutation({
  args: {
    problemId: v.id("problems"),
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("threads", {
      problemId: args.problemId,
      messages: args.messages,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const saveMessages = mutation({
  args: {
    problemId: v.id("problems"),
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("threads")
      .withIndex("by_problem", (q) => q.eq("problemId", args.problemId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: args.messages,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      const now = Date.now();
      return await ctx.db.insert("threads", {
        problemId: args.problemId,
        messages: args.messages,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
