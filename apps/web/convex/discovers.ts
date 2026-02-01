import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    signalId: v.optional(v.id("patternRecords")),
  },
  handler: async (ctx, args) => {
    let signalContext = undefined;
    let prePrompts: string[] = [];
    let title = "New Discovery";

    if (args.signalId) {
      const signal = await ctx.db.get(args.signalId);
      if (signal) {
        const scenarioLabel = signal.scenario.replace(/_/g, " ");
        const entityLabel = signal.entityKey
          .replace(/^\//, "")
          .split(/[-_]/)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        title = `${entityLabel} - ${scenarioLabel}`;

        signalContext = {
          scenario: signal.scenario,
          entityKey: signal.entityKey,
          summary: signal.record?.hypotheses_hints?.[0] || scenarioLabel,
          metrics: signal.record?.signals || {},
        };

        const signals = signal.record?.signals || {};
        const release = signal.record?.release;
        const hypotheses_hints = signal.record?.hypotheses_hints;
        const top_ticket_topics = signal.record?.top_ticket_topics;
        const entityLabelLower = signal.entityKey.replace(/^\//, "").replace(/[-_]/g, " ");

        if (signals.error_rate?.delta_pct > 0) {
          prePrompts.push(`What's causing the ${signals.error_rate.delta_pct.toFixed(0)}% error rate spike on ${entityLabelLower}?`);
        }
        if (signals.dropoff_rate?.delta_pct > 0) {
          prePrompts.push(`Why are users dropping off ${signals.dropoff_rate.delta_pct.toFixed(0)}% more on this flow?`);
        }
        if (signals.affected_accounts) {
          prePrompts.push(`Which of the ${signals.affected_accounts} affected accounts should we prioritize?`);
        }
        if (signals.revenue_at_risk) {
          prePrompts.push(`How can we mitigate the $${(signals.revenue_at_risk / 1000).toFixed(1)}k revenue at risk?`);
        }
        if (release?.top) {
          prePrompts.push(`Is release ${release.top} correlated with this ${scenarioLabel}?`);
        }
        if (hypotheses_hints?.length > 0) {
          prePrompts.push(`Can you validate: "${hypotheses_hints[0]}"?`);
        }
        if (top_ticket_topics?.length > 0) {
          prePrompts.push(`Show me support tickets about "${top_ticket_topics[0]}"`);
        }
        prePrompts.push(`What's the root cause of this ${scenarioLabel}?`);
        prePrompts.push(`What should we do next to fix this issue?`);
        prePrompts = prePrompts.slice(0, 5);
      }
    }

    const now = Date.now();
    const id = await ctx.db.insert("discovers", {
      userId: args.userId,
      signalId: args.signalId,
      title,
      signalContext,
      prePrompts: prePrompts.length > 0 ? prePrompts : undefined,
      messages: [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const getById = query({
  args: { id: v.id("discovers") },
  handler: async (ctx, args) => {
    const discover = await ctx.db.get(args.id);
    if (!discover) return null;

    let signal = null;
    if (discover.signalId) {
      signal = await ctx.db.get(discover.signalId);
    }

    return { ...discover, signal };
  },
});

export const listByUser = query({
  args: { 
    userId: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("archived"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;
    if (args.status) {
      results = await ctx.db
        .query("discovers")
        .withIndex("by_status", (q) => q.eq("userId", args.userId).eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      results = await ctx.db
        .query("discovers")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }

    if (args.limit) {
      results = results.slice(0, args.limit);
    }

    return results;
  },
});

export const updateMessages = mutation({
  args: {
    id: v.id("discovers"),
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      messages: args.messages,
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("discovers"),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("discovers"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});
