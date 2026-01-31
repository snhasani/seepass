# Seepass MVP: Pattern Engine + LLM Explainer (Aggregates-First)

## Goal
Turn noisy multi-source signals (product usage + support + backend errors + frontend errors) into:
- “what to fix/work on next”
- ranked, explainable, drilldown-able
- demo-ready end-to-end with fake data

## Problem
Data scattered:
- PostHog: product events (pageviews/actions/dropoffs)
- Intercom: user complaints/support messages
- Node.js API logs: backend failures/latency
- Sentry: frontend exceptions
Hard to:
- relate signals across sources
- detect spikes + co-occurrence
- explain impact (users, accounts, revenue risk)
- prioritize fast

## Solution (minimal, hackathon)
Skip ingest/warehouse. Start at “aggregates + patterns”.

Pipeline:
1) Fake data gen → `events` table (or jsonl)
2) Aggregator job → `daily_surface_metrics` (+ topK lists)
3) Pattern detector → emits `pattern_records` (JSON)
4) LLM consumes pattern_records → returns summary + hypotheses + actions
5) Demo UI: ranked list + drilldown charts + example snippets

Key idea:
- deterministic math finds anomalies/relations
- LLM does narrative + recommendations (no heavy math)

---

## Minimal data (normalized)
Single event shape (for seeding):
- `ts` datetime
- `source` enum: `posthog|intercom|api_log|sentry`
- `type` enum: `pageview|action|dropoff|ticket|error|revenue`
- `account` text (nullable)
- `user` text (nullable)
- `surface` text (route/page; ex `/checkout`)
- `severity` int (nullable)
- `value` float (nullable; revenue/mrr)
- `meta` json (error_code, ticket_topic, release, request_id, etc.)

---

## Minimal tables (SQLite/Postgres)
### `events`
Store seeded/fake unified events (above fields).

### `daily_surface_metrics`
PK (`date`,`surface`)
- `date` date
- `surface` text
- `pageviews` int
- `actions` int
- `dropoffs` int
- `errors` int
- `tickets` int
- `affected_accounts` int
- `affected_users` int
- `revenue_at_risk` float (optional)
- `top_error_signatures` json  // topK: [{sig,count,example}]
- `top_ticket_topics` json     // topK: [{topic,count,snippets[]}]

### `priorities`
- `date` date
- `entity_type` text  // `surface|error_signature`
- `entity_key` text   // `/checkout` or `PAYMENT_TIMEOUT`
- `score` float
- `drivers` json      // explainable metrics
- `pattern_record` json

---

## Pattern detection (non-LLM)
Compute per surface/day:
- `error_rate = errors / pageviews`
- `dropoff_rate = dropoffs / pageviews`
- `ticket_rate = tickets / pageviews`

Rules (cheap, effective):
1) Spike:
- metric_today > rolling_mean + 3*rolling_std
OR
- metric_today / rolling_mean > 2.0

2) Co-occurrence:
- spike(errors) AND spike(dropoffs) same surface same day
- spike(errors) AND spike(tickets) same surface same day

3) Lag:
- spike(errors) at D AND spike(dropoffs) at D+1 (optional)

4) Concentration:
- top error signature share > 0.6 (dominant root cause candidate)

Output: a structured pattern record (below). Save to `priorities`.

---

## Minimal “pattern record” (LLM-ready)
Purpose: compact evidence + context, no raw firehose.

```json
{
  "entity_type": "surface",
  "entity_key": "/checkout",
  "window": {"start":"2026-01-24","end":"2026-01-31"},
  "signals": {
    "pageviews": 12450,
    "error_rate": {"current":0.083, "baseline":0.012, "delta_pct":592, "z":6.1},
    "dropoff_rate": {"current":0.41, "baseline":0.28, "delta_pct":46, "z":3.0},
    "ticket_rate": {"current":0.019, "baseline":0.004, "delta_pct":375, "z":4.2},
    "affected_accounts": 37,
    "revenue_at_risk": 12800
  },
  "top_error_signatures": [
    {"sig":"PAYMENT_PROVIDER_TIMEOUT", "count":214, "example":"Upstream timeout during confirmPayment"}
  ],
  "top_ticket_topics": [
    {"topic":"checkout error", "count":42, "snippets":["Can't subscribe, error on checkout", "Payment fails after submit"]}
  ],
  "context": {
    "release_top": "web@1.42.0",
    "release_share": 0.71,
    "env": "prod"
  },
  "hints": [
    "errors+dropoffs co-occur",
    "concentrated signature",
    "release correlated"
  ]
}