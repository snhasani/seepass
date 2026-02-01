# Step 1: What's Surfacing Card Component

## Deliverable
One reusable component: `SurfacingCard` in `apps/web/shared/components/dashboard/surfacing-card.tsx`

Commit after implementation.

---

## Final Copies

| Element | Copy |
|---------|------|
| Section title | "What's Surfacing" |
| Type labels | Investigate / Monitor / Note |
| Empty state | "All clear—nothing urgent" |

---

## Data Shape (from pattern_records)

```ts
// Input from API/seed
interface PatternRecord {
  scenario: string;           // e.g. "error_spike", "weekday_seasonality"
  entityType: string;         // e.g. "surface"
  entityKey: string;          // e.g. "/checkout", "/pdp"
  windowStart: string;        // ISO date
  windowEnd: string;          // ISO date
  score: number;              // priority score
  record: {
    signals: {
      error_rate: { baseline: number; current: number; delta_pct: number; z: number };
      dropoff_rate: { baseline: number; current: number; delta_pct: number; z: number };
      ticket_rate: { baseline: number; current: number; delta_pct: number; z: number };
      affected_accounts: number;
      revenue_at_risk: number;
    };
    hypotheses_hints: string[];
    release: { top: string; share: number };
  };
}
```

---

## Component Props

```ts
type SurfacingType = "investigate" | "monitor" | "note";

interface SurfacingCardProps {
  type: SurfacingType;
  title: string;                    // derived from entityKey (e.g. "Checkout" from "/checkout")
  description: string;              // from hypotheses_hints[0] or generated
  score?: number;                   // optional, for sorting/display
  affectedAccounts?: number;
  revenueAtRisk?: number;
  windowStart?: string;
  windowEnd?: string;
  onClick?: () => void;
  className?: string;
}
```

---

## Scenario → Type Mapping

| Scenario | Type |
|----------|------|
| `error_spike` | investigate |
| `release_regression` | investigate |
| `dropoff_spike` | investigate |
| `ticket_spike` | monitor |
| `gradual_degradation` | monitor |
| `weekday_seasonality` | note |
| `stable` | note |
| (default) | note |

---

## Component Structure

```
SurfacingCard
├── Type badge (Investigate/Monitor/Note) — top-left, colored
├── Title — entityKey humanized (e.g. "/checkout" → "Checkout")
├── Description — hypotheses_hints[0] or fallback
├── Metrics row (optional)
│   ├── Affected accounts
│   └── Revenue at risk
└── Window dates (subtle, bottom)
```

**Base:** Use `apps/web/shared/components/ui/card.tsx` (Card, CardHeader, CardContent)

**Colors:**
- Investigate: rose/red tones
- Monitor: amber/yellow tones
- Note: slate/neutral tones

---

## File Location

```
apps/web/shared/components/dashboard/
├── surfacing-card.tsx      ← new
└── index.ts                ← export
```

---

## Implementation Checklist

- [ ] Create `apps/web/shared/components/dashboard/` folder
- [ ] Create `surfacing-card.tsx` with props interface and component
- [ ] Add type badge with color variants
- [ ] Add title, description, optional metrics
- [ ] Export from `index.ts`
- [ ] Test with mock data
- [ ] Commit: `feat(dashboard): add SurfacingCard component`

---

## References

- Pattern records seed: `packages/data-gen/out/pattern_records_seed.json`
- Base card: `apps/web/shared/components/ui/card.tsx`
- Research (copy tone): `docs/research-raw.txt` § "Insights/Alerts List"
