import type { PatternRecord } from "./types";

export function validateRecord(record: PatternRecord): string[] {
  const errors: string[] = [];

  if (!record.scenario) errors.push("Missing scenario");
  if (record.entityType !== "surface") errors.push(`Invalid entityType: ${record.entityType}`);
  if (!record.entityKey) errors.push("Missing entityKey");
  if (!record.windowStart || !/^\d{4}-\d{2}-\d{2}$/.test(record.windowStart)) {
    errors.push(`Invalid windowStart: ${record.windowStart}`);
  }
  if (!record.windowEnd || !/^\d{4}-\d{2}-\d{2}$/.test(record.windowEnd)) {
    errors.push(`Invalid windowEnd: ${record.windowEnd}`);
  }
  if (typeof record.score !== "number") errors.push("Invalid score");

  if (!record.record) {
    errors.push("Missing record");
    return errors;
  }

  if (record.record.entity_type !== "surface") errors.push("Invalid record.entity_type");
  if (record.record.entity_key !== record.entityKey) errors.push("entity_key mismatch");

  if (!record.record.signals) {
    errors.push("Missing signals");
    return errors;
  }

  const signals = record.record.signals;
  ["error_rate", "dropoff_rate", "ticket_rate"].forEach((key) => {
    const signal = signals[key as keyof typeof signals];
    if (!signal || typeof signal !== "object") {
      errors.push(`Missing or invalid ${key}`);
      return;
    }
    if (typeof signal.baseline !== "number") errors.push(`Invalid ${key}.baseline`);
    if (typeof signal.current !== "number") errors.push(`Invalid ${key}.current`);
    if (typeof signal.delta_pct !== "number") errors.push(`Invalid ${key}.delta_pct`);
    if (typeof signal.z !== "number") errors.push(`Invalid ${key}.z`);
  });

  if (typeof signals.affected_accounts !== "number") errors.push("Invalid affected_accounts");
  if (typeof signals.revenue_at_risk !== "number") errors.push("Invalid revenue_at_risk");

  if (!Array.isArray(record.record.top_error_signatures)) {
    errors.push("top_error_signatures must be array");
  }
  if (!Array.isArray(record.record.top_ticket_topics)) {
    errors.push("top_ticket_topics must be array");
  }
  if (!Array.isArray(record.record.hypotheses_hints)) {
    errors.push("hypotheses_hints must be array");
  }

  if (!record.record.release || typeof record.record.release.top !== "string" || typeof record.record.release.share !== "number") {
    errors.push("Invalid release");
  }

  return errors;
}

export function validateAll(records: PatternRecord[]): { valid: boolean; errors: Array<{ index: number; errors: string[] }> } {
  const validationErrors: Array<{ index: number; errors: string[] }> = [];

  records.forEach((record, index) => {
    const errors = validateRecord(record);
    if (errors.length > 0) {
      validationErrors.push({ index, errors });
    }
  });

  return {
    valid: validationErrors.length === 0,
    errors: validationErrors,
  };
}
