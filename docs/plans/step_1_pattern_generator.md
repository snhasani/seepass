# Step 1: PatternRecord Generator Script

## Objective
Generate deterministic fake aggregate PatternRecords matching the schema in `patternrecords.json`. Output JSON array ready for database seeding.

## Location
`packages/data-gen/` (new package in monorepo)

## Output Schema (from patternrecords.json)

```typescript
interface PatternRecord {
  scenario: string;           // e.g. "checkout_payment_timeout"
  entityType: "surface";
  entityKey: string;          // "/checkout", "/pdp", "/cart", "/payment", "/shipping", "/order-confirm", "/search"
  windowStart: string;        // "YYYY-MM-DD"
  windowEnd: string;          // "YYYY-MM-DD"
  score: number;
  record: {
    entity_type: "surface";
    entity_key: string;
    window: { start: string; end: string };
    signals: {
      error_rate: SignalMetric;
      dropoff_rate: SignalMetric;
      ticket_rate: SignalMetric;
      affected_accounts: number;
      revenue_at_risk: number;
    };
    top_error_signatures: Array<{sig: string; count: number; example: string}>;
    top_ticket_topics: Array<{topic: string; count: number; snippets: string[]}>;
    release: { top: string; share: number };
    hypotheses_hints: string[];
  };
}

interface SignalMetric {
  current: number;
  baseline: number;
  delta_pct: number;
  z: number;
}
```

## Surfaces (must match patternrecords.json)
`/checkout`, `/pdp`, `/cart`, `/payment`, `/shipping`, `/order-confirm`, `/search`

## Scenarios (15 total)

### Long-window patterns (90d baseline)
- `weekday_seasonality` - 7d slices across 90d
- `month_cycle_lift` - 6-8d windows around month boundaries
- `gradual_trend` - 14d slices across 90d

### Success/wins
- `promo_week` - 7d
- `cart_recovery_push` - 10d
- `speed_improvement` - 14d
- `payment_method_added` - 21d

### Incidents
- `checkout_payment_timeout` - 2-4d
- `backend_latency_regression` - 1-3d
- `frontend_js_crash_pdp` - 1-2d
- `shipping_tax_bug` - 3-7d
- `inventory_sync_incident` - 1-3d
- `fraud_3ds_false_positive` - 5-10d

### Data quality
- `analytics_outage` - 1-2d
- `event_schema_change` - 1d

## Core Logic

### Seeded RNG
Use deterministic RNG (mulberry32 or xorshift32) seeded from env `SEED=42` (default). Same seed = same output.

### Baseline Ranges (per surface)

**CRITICAL**: Use these exact ranges. Do NOT use values outside these ranges.

- `/checkout`
  - error_rate baseline: 0.003–0.015
  - dropoff_rate baseline: 0.65–0.80 (NOT 0.28 - that's /pdp range)
  - ticket_rate baseline: 0.0008–0.004
- `/pdp`
  - error_rate baseline: 0.002–0.012
  - dropoff_rate baseline: 0.35–0.60
  - ticket_rate baseline: 0.0002–0.0012
- `/cart`
  - error_rate baseline: 0.002–0.010
  - dropoff_rate baseline: 0.45–0.70
  - ticket_rate baseline: 0.0003–0.0015
- `/payment`
  - error_rate baseline: 0.003–0.012
  - dropoff_rate baseline: 0.65–0.80
  - ticket_rate baseline: 0.001–0.004
- `/shipping`
  - error_rate baseline: 0.002–0.010
  - dropoff_rate baseline: 0.65–0.80
  - ticket_rate baseline: 0.001–0.004
- `/order-confirm`
  - error_rate baseline: 0.002–0.010
  - dropoff_rate baseline: 0.65–0.80
  - ticket_rate baseline: 0.001–0.004
- `/search`
  - error_rate baseline: 0.001–0.006
  - dropoff_rate baseline: 0.40–0.65
  - ticket_rate baseline: 0.0001–0.0008

### Signal Calculation

1. Sample baseline from surface-specific range
2. Calculate current based on scenario multipliers (see ranges doc)
3. Compute delta_pct: `((current - baseline) / baseline) * 100`
4. Compute z-score: `(current - baseline) / sigma`
   - error_rate sigma = baseline * 0.25
   - dropoff_rate sigma = baseline * 0.10
   - ticket_rate sigma = baseline * 0.30

### Score Formula (MUST match exactly)

```typescript
score = 5 * z_error + 4 * z_dropoff + 2 * z_ticket + 0.001 * revenue_at_risk + 0.2 * affected_accounts
```

**Validation**: For `checkout_payment_timeout` example:
- z_error=23.7, z_dropoff=4.6, z_ticket=12.5, rev=12800, affected=37
- Expected: 5(23.7) + 4(4.6) + 2(12.5) + 12.8 + 7.4 = **182.1**
- If score differs significantly, formula is wrong

### Z-Score Ranges (per scenario type)

- Normal patterns: z 0–2 (all signals)
- Success/wins: z -3 to +2 (negative for improvements)
- Incidents:
  - error_rate: z 4–12
  - dropoff_rate: z 3–10
  - ticket_rate: z 2–12
- Data quality: z 0–2 (stable, hints indicate issue)

### Release Correlation

- Release versions: `"web@1.40.0"`, `"web@1.41.2"`, `"web@1.42.0"`, `"web@1.42.1"`
- Normal scenarios: share 0.10–0.35
- Incident scenarios: share 0.65–0.85

### TopK Lists

**Error signatures** (only for incident scenarios):
- 1 dominant signature with 60–80% share
- Count ranges per scenario (see ranges doc)
- Example: `PAYMENT_PROVIDER_TIMEOUT`, `PDP_RENDER_CRASH`, `3DS_CHALLENGE_FAILED`

**Ticket topics** (only for incidents + some success scenarios):
- 1–2 topics with realistic snippets (2–3 strings each)
- Count ranges per scenario

**Empty arrays** for:
- Normal patterns (weekday_seasonality, gradual_trend)
- Some success scenarios (speed_improvement, cart_recovery_push)
- Data quality scenarios (analytics_outage)

### Hypotheses Hints

Always include 2–3 hints per scenario. See `PatternRecord_Seed_Pack_exact_ranges.md` for scenario-specific hints.

## Implementation Structure

```
packages/data-gen/
  src/
    config.ts           // SEED, date ranges, scenario configs
    types.ts            // PatternRecord interfaces
    rng.ts              // Seeded RNG helpers
    baselines.ts        // Surface baseline ranges
    scenarios.ts        // Scenario definitions + multipliers
    generate.ts         // Main generation pipeline
    validate.ts         // Schema validation
    index.ts            // CLI entry
  package.json
  tsconfig.json
```

## Generation Pipeline

1. Initialize RNG with seed
2. For each scenario:
   - Determine surfaces and window dates
   - For each (scenario, surface, window):
     - Sample baselines from surface ranges
     - Apply scenario multipliers to get current values
     - Calculate delta_pct and z-scores
     - Generate topK lists (if applicable)
     - Sample release version and share
     - Calculate score using formula
     - Build record JSON
3. Validate all records against schema
4. Write JSON array to `out/pattern_records_seed.json`

## CLI

```bash
pnpm gen:patterns
# Reads SEED from env (default: 42)
# Outputs: packages/data-gen/out/pattern_records_seed.json
```

## Validation & Testing

### Schema Validation
- All required fields present
- Types match (strings, numbers, arrays)
- Date strings parseable (YYYY-MM-DD)
- Score formula verified for sample records

### Test Script

```bash
# Generate data
pnpm gen:patterns

# Validate JSON schema
node -e "const data = require('./out/pattern_records_seed.json'); console.log('Records:', data.length);"

# Check score formula for first incident
node -e "
const data = require('./out/pattern_records_seed.json');
const incident = data.find(r => r.scenario === 'checkout_payment_timeout');
if (incident) {
  const s = incident.record.signals;
  const expected = 5*s.error_rate.z + 4*s.dropoff_rate.z + 2*s.ticket_rate.z + 0.001*s.revenue_at_risk + 0.2*s.affected_accounts;
  console.log('Expected score:', expected);
  console.log('Actual score:', incident.score);
  console.log('Match:', Math.abs(expected - incident.score) < 0.1);
}
"
```

## References

- Schema source: `docs/plans/patternrecords.json`
- Scenario ranges: `docs/plans/PatternRecord_Seed_Pack_exact_ranges.md`
- Scenario descriptions: `docs/plans/ecommerce_scenario_pack.md`
