# Plan: Postgres/Prisma → Convex Migration

## 1. Convex Schema Update

Add `patternRecords` table to `apps/web/convex/schema.ts`:

```ts
patternRecords: defineTable({
  scenario: v.string(),
  entityType: v.string(),
  entityKey: v.string(),
  windowStart: v.string(),
  windowEnd: v.string(),
  score: v.number(),
  record: v.any(),
  createdAt: v.number(),
})
  .index("by_entity", ["entityKey"])
  .index("by_scenario", ["scenario"])
  .index("by_score", ["score"])
  .index("by_window", ["windowStart", "windowEnd"])
```

## 2. Convex Functions

Create `apps/web/convex/patternRecords.ts`:

- `list` — paginated query w/ filters (scenario, entityKey, entityType, date range, minScore)
- `getById` — single record
- `getByEntity` — records for entity (timeline)
- `aggregates` — scenario/entity counts for filters
- `seed` — bulk insert mutation

## 3. Seed Script

Create `apps/web/scripts/seed-convex.ts`:

- Read `packages/data-gen/out/pattern_records_seed.json`
- Call Convex `patternRecords.seed` mutation via HTTP client or `npx convex run` CLI

## 4. Refactor API Routes

Replace Prisma calls w/ Convex queries.

**Option A: Keep REST routes** (minimal change)

- Use `fetchQuery`/`fetchMutation` from `convex/nextjs` in route handlers
- Same URLs, same response shape

**Option B: Direct Convex** (recommended, less code)

- Delete `/api/pattern-records`, `/api/signals`, `/api/priorities`
- Use `useQuery`/`useMutation` hooks directly in components
- Keep `/api/explain` (needs LLM logic)

## 5. Files to Delete

- `packages/database/` (entire package)
- `docker-compose.yml`
- `scripts/db-*.sh`
- `.env` vars: `DATABASE_URL`

## 6. Cleanup

- Remove `@repo/database` from `apps/web/package.json`
- Remove `db:*` scripts from root `package.json`
- Delete `apps/web/lib/prisma.ts` (if exists)

## 7. Dependency Order

1. Schema → deploy convex
2. Seed script → populate data
3. Convex functions → test queries
4. Refactor routes/components
5. Delete postgres artifacts

## Effort Summary

| Step           | Files      |
|----------------|------------|
| Schema         | 1          |
| Convex fns     | 1          |
| Seed script    | 1          |
| Route refactor | 5 routes   |
| Delete         | ~15 files  |
