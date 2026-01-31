import { SeededRNG } from "./rng";
import { SCENARIOS } from "./scenarios";
import { BASELINE_RANGES, getSigma, calculateZ, calculateDeltaPct } from "./baselines";
import type { PatternRecord, SignalMetric } from "./types";
import type { Surface } from "./config";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateScore(
  errorZ: number,
  dropoffZ: number,
  ticketZ: number,
  revenueAtRisk: number,
  affectedAccounts: number
): number {
  return (
    5 * errorZ +
    4 * dropoffZ +
    2 * ticketZ +
    0.001 * revenueAtRisk +
    0.2 * affectedAccounts
  );
}

function createSignalMetric(
  baseline: number,
  current: number,
  signalType: "error_rate" | "dropoff_rate" | "ticket_rate"
): SignalMetric {
  const sigma = getSigma(baseline, signalType);
  const z = calculateZ(current, baseline, sigma);
  const delta_pct = calculateDeltaPct(current, baseline);
  return { baseline, current, delta_pct, z };
}

export function generatePatternRecords(startDate: Date = new Date("2025-11-01")): PatternRecord[] {
  const rng = new SeededRNG(parseInt(process.env.SEED || "42", 10));
  const records: PatternRecord[] = [];

  for (const scenario of SCENARIOS) {
    const endDate = addDays(startDate, 90);

    if (scenario.name === "weekday_seasonality") {
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        const windowEnd = addDays(currentDate, 6);
        for (const surface of scenario.surfaces) {
          if (rng.next() > 0.3) {
            const generated = scenario.generate(rng, surface, currentDate, windowEnd);
            const record = buildRecord(scenario.name, surface, currentDate, windowEnd, generated, rng);
            records.push(record);
          }
        }
        currentDate = addDays(currentDate, 7);
      }
    } else if (scenario.name === "month_cycle_lift") {
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const windowStart = addDays(monthEnd, -3);
        const windowEnd = addDays(monthEnd, 4);
        if (windowStart >= startDate && windowEnd <= endDate) {
          for (const surface of scenario.surfaces) {
            const generated = scenario.generate(rng, surface, windowStart, windowEnd);
            const record = buildRecord(scenario.name, surface, windowStart, windowEnd, generated, rng);
            records.push(record);
          }
        }
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }
    } else if (scenario.name === "gradual_trend") {
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        const windowEnd = addDays(currentDate, 13);
        if (windowEnd <= endDate) {
          for (const surface of scenario.surfaces) {
            const generated = scenario.generate(rng, surface, currentDate, windowEnd);
            const record = buildRecord(scenario.name, surface, currentDate, windowEnd, generated, rng);
            records.push(record);
          }
        }
        currentDate = addDays(currentDate, 14);
      }
    } else {
      const windowDays = rng.int(scenario.windowDays[0], scenario.windowDays[1]);
      const windowStart = new Date(startDate);
      windowStart.setDate(windowStart.getDate() + rng.int(0, 60));
      const windowEnd = addDays(windowStart, windowDays - 1);

      if (windowEnd <= endDate) {
        for (const surface of scenario.surfaces) {
          const generated = scenario.generate(rng, surface, windowStart, windowEnd);
          const record = buildRecord(scenario.name, surface, windowStart, windowEnd, generated, rng);
          records.push(record);
        }
      }
    }
  }

  return records;
}

function buildRecord(
  scenarioName: string,
  surface: Surface,
  windowStart: Date,
  windowEnd: Date,
  generated: ReturnType<typeof SCENARIOS[0]["generate"]>,
  rng: SeededRNG
): PatternRecord {
  const error_rate = generated.error_rate
    ? createSignalMetric(generated.error_rate.baseline, generated.error_rate.current, "error_rate")
    : createSignalMetric(BASELINE_RANGES[surface].error_rate[0], BASELINE_RANGES[surface].error_rate[0], "error_rate");

  const dropoff_rate = createSignalMetric(
    generated.dropoff_rate.baseline,
    generated.dropoff_rate.current,
    "dropoff_rate"
  );

  const ticket_rate = createSignalMetric(
    generated.ticket_rate.baseline,
    generated.ticket_rate.current,
    "ticket_rate"
  );

  const score = calculateScore(
    error_rate.z,
    dropoff_rate.z,
    ticket_rate.z,
    generated.revenue_at_risk,
    generated.affected_accounts
  );

  return {
    scenario: scenarioName,
    entityType: "surface",
    entityKey: surface,
    windowStart: formatDate(windowStart),
    windowEnd: formatDate(windowEnd),
    score: Math.round(score * 10) / 10,
    record: {
      entity_type: "surface",
      entity_key: surface,
      window: {
        start: formatDate(windowStart),
        end: formatDate(windowEnd),
      },
      signals: {
        error_rate,
        dropoff_rate,
        ticket_rate,
        affected_accounts: generated.affected_accounts,
        revenue_at_risk: generated.revenue_at_risk,
      },
      top_error_signatures: generated.top_error_signatures,
      top_ticket_topics: generated.top_ticket_topics,
      release: {
        top: generated.release.top,
        share: Math.round(generated.release.share * 100) / 100,
      },
      hypotheses_hints: generated.hypotheses_hints,
    },
  };
}
