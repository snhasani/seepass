import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("problems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const listRecent = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("problems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 5);
  },
});

export const get = query({
  args: { id: v.id("problems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("problems", {
      userId: args.userId,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createConfirmed = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("problems", {
      userId: args.userId,
      title: args.title,
      description: args.description,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const confirm = mutation({
  args: {
    id: v.id("problems"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, title, description } = args;
    await ctx.db.patch(id, {
      title,
      description,
      status: "confirmed",
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("problems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
