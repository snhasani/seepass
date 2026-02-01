# Signals Page – High-Level Plan

**Branch:** `feat/signals-page` (off `feat/deashboard`)

**Route:** `/signals` (or `/insights`)

---

## Purpose

Full view of all pattern records/signals with filtering and exploration capabilities.

---

## Data Source

- **API:** `apps/web/app/api/pattern-records/route.ts`
- **Schema:** `packages/database/prisma/schema.prisma` (PatternRecord)
- **Sample data:** `packages/data-gen/out/pattern_records_seed.json`

**Key fields for filtering:**
- `scenario` (error_spike, release_regression, dropoff_spike, etc.)
- `entityType` (surface)
- `entityKey` (/checkout, /pdp, /search, etc.)
- `windowStart` / `windowEnd` (date range)
- `score` (priority)
- `record.signals` (error_rate, dropoff_rate, ticket_rate, affected_accounts, revenue_at_risk)

---

## Page Structure

1. **Header:** Title + filters bar
2. **Filters:** scenario, entity, date range, score threshold
3. **List/Grid:** Reuse `SurfacingCard` or table view
4. **Detail view:** Click to expand or navigate to detail

---

## Implementation Steps

1. Create branch `feat/signals-page`
2. Add route `/signals/page.tsx`
3. Extend API for list/filter (or use existing + client filter)
4. Build filter UI (dropdowns, date picker)
5. Render list using existing card components
6. Add navigation from dashboard "View all" link

---

## References

- Dashboard components: `apps/web/shared/components/dashboard/`
- Pattern records API: `apps/web/app/api/pattern-records/route.ts`
- Seed data shape: `packages/data-gen/out/pattern_records_seed.json`
- Research: `docs/research-raw.txt`

---

**Next:** Start new conversation with this doc for detailed planning and implementation.
