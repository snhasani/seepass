export interface SignalMetric {
  current: number;
  baseline: number;
  delta_pct: number;
  z: number;
}

export interface PatternRecord {
  scenario: string;
  entityType: "surface";
  entityKey: string;
  windowStart: string;
  windowEnd: string;
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
    top_error_signatures: Array<{ sig: string; count: number; example: string }>;
    top_ticket_topics: Array<{ topic: string; count: number; snippets: string[] }>;
    release: { top: string; share: number };
    hypotheses_hints: string[];
  };
}
