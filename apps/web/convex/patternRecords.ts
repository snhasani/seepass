import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import seedData from "./seed-data.json";

export const list = query({
  args: {
    scenario: v.optional(v.string()),
    entityKey: v.optional(v.string()),
    entityType: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    minScore: v.optional(v.number()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;
    const entityKey = args.entityKey;
    const scenario = args.scenario;

    if (entityKey) {
      results = await ctx.db
        .query("patternRecords")
        .withIndex("by_entity", (q) => q.eq("entityKey", entityKey))
        .order("desc")
        .collect();
    } else if (scenario) {
      results = await ctx.db
        .query("patternRecords")
        .withIndex("by_scenario", (q) => q.eq("scenario", scenario))
        .order("desc")
        .collect();
    } else {
      results = await ctx.db
        .query("patternRecords")
        .withIndex("by_score")
        .order("desc")
        .collect();
    }

    if (args.entityType) {
      results = results.filter((r) => r.entityType === args.entityType);
    }
    if (args.startDate) {
      results = results.filter((r) => r.windowStart >= args.startDate!);
    }
    if (args.endDate) {
      results = results.filter((r) => r.windowEnd <= args.endDate!);
    }
    if (args.minScore !== undefined) {
      results = results.filter((r) => r.score >= args.minScore!);
    }

    const total = results.length;
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 50;
    const paginated = results.slice(offset, offset + limit);

    return {
      data: paginated,
      meta: {
        total,
        limit,
        offset,
      },
    };
  },
});

export const getById = query({
  args: { id: v.id("patternRecords") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByEntity = query({
  args: { entityKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patternRecords")
      .withIndex("by_entity", (q) => q.eq("entityKey", args.entityKey))
      .order("asc")
      .collect();
  },
});

export const aggregates = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("patternRecords").collect();

    const scenarios = new Map<string, number>();
    const entities = new Map<string, number>();

    for (const record of all) {
      scenarios.set(record.scenario, (scenarios.get(record.scenario) ?? 0) + 1);
      entities.set(record.entityKey, (entities.get(record.entityKey) ?? 0) + 1);
    }

    return {
      scenarios: Array.from(scenarios.entries()).map(([value, count]) => ({
        value,
        count,
      })),
      entities: Array.from(entities.entries()).map(([value, count]) => ({
        value,
        count,
      })),
    };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("patternRecords").collect();
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
    return all.length;
  },
});

export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("patternRecords").first();
    if (existing) return { seeded: false, reason: "already has data" };
    for (const record of seedData) {
      await ctx.db.insert("patternRecords", record as any);
    }
    return { seeded: true, count: seedData.length };
  },
});
