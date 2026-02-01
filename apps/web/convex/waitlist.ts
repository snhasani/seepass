import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const join = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing entry with additional info if provided
      if (args.company || args.role) {
        await ctx.db.patch(existing._id, {
          ...(args.company && { company: args.company }),
          ...(args.role && { role: args.role }),
        });
      }
      return { success: true, isUpdate: true, id: existing._id };
    }

    // Create new entry
    const id = await ctx.db.insert("waitlist", {
      name: args.name,
      email: args.email,
      company: args.company,
      role: args.role,
      createdAt: Date.now(),
    });

    return { success: true, isUpdate: false, id };
  },
});

export const updateDetails = mutation({
  args: {
    email: v.string(),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!existing) {
      throw new Error("Entry not found");
    }

    await ctx.db.patch(existing._id, {
      ...(args.company && { company: args.company }),
      ...(args.role && { role: args.role }),
    });

    return { success: true };
  },
});

export const checkEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return { exists: !!existing };
  },
});
