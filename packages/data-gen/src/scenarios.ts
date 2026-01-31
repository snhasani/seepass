import type { Surface, ReleaseVersion } from "./config";
import type { SeededRNG } from "./rng";
import { BASELINE_RANGES, getSigma, calculateZ, calculateDeltaPct } from "./baselines";

export interface ScenarioConfig {
  name: string;
  surfaces: Surface[];
  windowDays: [number, number];
  generate: (rng: SeededRNG, surface: Surface, windowStart: Date, windowEnd: Date) => {
    error_rate?: { baseline: number; current: number };
    dropoff_rate: { baseline: number; current: number };
    ticket_rate: { baseline: number; current: number };
    affected_accounts: number;
    revenue_at_risk: number;
    top_error_signatures: Array<{ sig: string; count: number; example: string }>;
    top_ticket_topics: Array<{ topic: string; count: number; snippets: string[] }>;
    release: { top: ReleaseVersion; share: number };
    hypotheses_hints: string[];
  };
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    name: "weekday_seasonality",
    surfaces: ["/checkout", "/pdp"],
    windowDays: [7, 7],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline * 0.8, error_baseline * 1.2);
      const dropoff_current = rng.float(dropoff_baseline * 0.9, dropoff_baseline * 1.1);
      const ticket_current = rng.float(ticket_baseline * 0.75, ticket_baseline * 1.25);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(20, 120),
        revenue_at_risk: rng.int(0, 1500),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.41.2", "web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["weekday seasonality", "stable baseline", "not incident"],
      };
    },
  },
  {
    name: "month_cycle_lift",
    surfaces: ["/checkout", "/pdp"],
    windowDays: [6, 8],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline * 0.9, error_baseline * 1.1);
      const dropoff_current = rng.float(dropoff_baseline * 0.88, dropoff_baseline * 0.95);
      const ticket_current = rng.float(ticket_baseline * 0.9, ticket_baseline * 1.1);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(15, 25),
        revenue_at_risk: rng.int(0, 800),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["month-cycle demand", "marketing/calendar effect", "no bug indicated"],
      };
    },
  },
  {
    name: "gradual_trend",
    surfaces: ["/search"],
    windowDays: [14, 14],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      return {
        error_rate: { baseline: error_baseline, current: error_baseline },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_baseline },
        ticket_rate: { baseline: ticket_baseline, current: ticket_baseline },
        affected_accounts: rng.int(15, 30),
        revenue_at_risk: rng.int(0, 1200),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.41.2"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["slow trend", "monitor channel mix", "not incident"],
      };
    },
  },
  {
    name: "promo_week",
    surfaces: ["/pdp", "/cart", "/checkout"],
    windowDays: [7, 7],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline * 0.9, error_baseline * 1.15);
      const dropoff_current = rng.float(dropoff_baseline * 0.85, dropoff_baseline * 0.95);
      const ticket_current = rng.float(ticket_baseline, ticket_baseline * 1.2);

      const topics: Array<{ topic: string; count: number; snippets: string[] }> = [];
      if (surface === "/pdp" && rng.next() > 0.5) {
        topics.push({
          topic: "promo question",
          count: rng.int(10, 25),
          snippets: ["Does code apply to bundles?", "Promo not working on mobile."],
        });
      }

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(30, 45),
        revenue_at_risk: rng.int(0, 500),
        top_error_signatures: [],
        top_ticket_topics: topics,
        release: { top: rng.pick(["web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["campaign-driven lift", "monitor support volume", "no technical incident"],
      };
    },
  },
  {
    name: "cart_recovery_push",
    surfaces: ["/cart", "/checkout"],
    windowDays: [10, 10],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = error_baseline;
      const dropoff_current = rng.float(dropoff_baseline * 0.75, dropoff_baseline * 0.90);
      const ticket_current = rng.float(ticket_baseline * 0.9, ticket_baseline * 1.1);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(30, 40),
        revenue_at_risk: rng.int(0, 800),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.42.1"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["dropoff decreased", "recovery flow effective", "keep variant"],
      };
    },
  },
  {
    name: "speed_improvement",
    surfaces: ["/pdp", "/checkout"],
    windowDays: [14, 14],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline * 0.85, error_baseline);
      const dropoff_current = rng.float(dropoff_baseline * 0.80, dropoff_baseline * 0.95);
      const ticket_current = rng.float(ticket_baseline * 0.85, ticket_baseline);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(40, 50),
        revenue_at_risk: rng.int(0, 500),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.41.2"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["dropoff improved without error spike", "performance regression reversed", "confirm latency dashboards"],
      };
    },
  },
  {
    name: "payment_method_added",
    surfaces: ["/payment", "/checkout"],
    windowDays: [21, 21],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline * 0.75, error_baseline);
      const dropoff_current = rng.float(dropoff_baseline * 0.85, dropoff_baseline * 0.95);
      const ticket_current = rng.float(ticket_baseline * 0.6, ticket_baseline * 0.9);

      const topics: Array<{ topic: string; count: number; snippets: string[] }> = [];
      if (surface === "/payment") {
        topics.push({
          topic: "payment failed",
          count: rng.int(15, 30),
          snippets: ["Card rejected unexpectedly.", "3DS challenge stuck."],
        });
      }

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(50, 60),
        revenue_at_risk: rng.int(0, 800),
        top_error_signatures: [],
        top_ticket_topics: topics,
        release: { top: rng.pick(["web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["payment friction reduced", "fewer payment complaints", "consider expanding markets"],
      };
    },
  },
  {
    name: "checkout_payment_timeout",
    surfaces: ["/checkout"],
    windowDays: [2, 4],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(0.004, 0.012);
      const dropoff_baseline = rng.float(0.68, 0.78);
      const ticket_baseline = rng.float(0.001, 0.004);

      const error_current = rng.float(0.040, 0.120);
      const dropoff_current = rng.float(0.78, 0.92);
      const ticket_current = rng.float(0.008, 0.030);

      const sigCount = rng.int(120, 900);
      const topicCount = rng.int(20, 200);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(25, 120),
        revenue_at_risk: rng.int(8000, 60000),
        top_error_signatures: [{
          sig: "PAYMENT_PROVIDER_TIMEOUT",
          count: sigCount,
          example: "Upstream timeout during confirmPayment",
        }],
        top_ticket_topics: [{
          topic: "checkout error",
          count: topicCount,
          snippets: ["Can't subscribe, error on checkout", "Payment fails after submit", "Stuck on processing payment"],
        }],
        release: { top: "web@1.42.0", share: rng.float(0.65, 0.85) },
        hypotheses_hints: ["errors+dropoffs co-occur", "concentrated in one signature", "release correlated"],
      };
    },
  },
  {
    name: "backend_latency_regression",
    surfaces: ["/checkout", "/pdp"],
    windowDays: [1, 3],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      const error_current = rng.float(error_baseline, error_baseline * 1.2);
      const dropoff_current = surface === "/checkout"
        ? rng.float(0.78, 0.88)
        : rng.float(0.55, 0.70);
      const ticket_current = rng.float(0.002, 0.010);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(100, 150),
        revenue_at_risk: rng.int(5000, 40000),
        top_error_signatures: [],
        top_ticket_topics: [{
          topic: "site slow",
          count: rng.int(15, 40),
          snippets: ["Pages take forever to load.", "Checkout spinning for a long time."],
        }],
        release: { top: rng.pick(["web@1.42.1"]), share: rng.float(0.60, 0.75) },
        hypotheses_hints: ["dropoff spike without big error spike", "suspect latency regression", "check p95 and rollback"],
      };
    },
  },
  {
    name: "frontend_js_crash_pdp",
    surfaces: ["/pdp"],
    windowDays: [1, 2],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(0.002, 0.010);
      const dropoff_baseline = rng.float(0.40, 0.60);
      const ticket_baseline = rng.float(0.0002, 0.0012);

      const error_current = rng.float(0.040, 0.180);
      const dropoff_current = rng.float(0.55, 0.80);
      const ticket_current = rng.float(0.002, 0.015);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(30, 200),
        revenue_at_risk: rng.int(3000, 30000),
        top_error_signatures: [{
          sig: "PDP_RENDER_CRASH",
          count: rng.int(150, 1200),
          example: "TypeError: Cannot read properties of undefined",
        }],
        top_ticket_topics: [{
          topic: "product page broken",
          count: rng.int(30, 60),
          snippets: ["Product page is blank.", "Add to cart button missing."],
        }],
        release: { top: rng.pick(["web@1.42.0"]), share: rng.float(0.70, 0.90) },
        hypotheses_hints: ["frontend crash blocks early funnel", "release correlated", "rollback or hotfix"],
      };
    },
  },
  {
    name: "shipping_tax_bug",
    surfaces: ["/shipping", "/checkout"],
    windowDays: [3, 7],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(0.68, 0.78);
      const ticket_baseline = rng.float(0.001, 0.004);

      const error_current = rng.float(error_baseline, error_baseline * 1.3);
      const dropoff_current = rng.float(0.80, 0.93);
      const ticket_current = rng.float(0.005, 0.020);

      const topics: Array<{ topic: string; count: number; snippets: string[] }> = [
        {
          topic: "shipping too high",
          count: rng.int(50, 80),
          snippets: ["Shipping costs look wrong.", "Why is shipping €25?"],
        },
      ];
      if (rng.next() > 0.7) {
        topics.push({
          topic: "wrong tax",
          count: rng.int(10, 25),
          snippets: ["VAT calculated twice.", "Tax seems incorrect for my address."],
        });
      }

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(50, 80),
        revenue_at_risk: rng.int(6000, 50000),
        top_error_signatures: [],
        top_ticket_topics: topics,
        release: { top: rng.pick(["web@1.42.1"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["late-step friction", "pricing/shipping logic issue", "errors not primary signal"],
      };
    },
  },
  {
    name: "inventory_sync_incident",
    surfaces: ["/checkout", "/order-confirm"],
    windowDays: [1, 3],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(0.68, 0.78);
      const ticket_baseline = rng.float(0.001, 0.004);

      const error_current = rng.float(error_baseline, error_baseline * 1.5);
      const dropoff_current = rng.float(0.82, 0.95);
      const ticket_current = rng.float(0.006, 0.030);

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(40, 70),
        revenue_at_risk: rng.int(8000, 70000),
        top_error_signatures: [],
        top_ticket_topics: [{
          topic: "out of stock after checkout",
          count: rng.int(30, 50),
          snippets: ["Item was available then vanished.", "Order canceled due to stock."],
        }],
        release: { top: rng.pick(["web@1.41.2", "web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["purchase fails late funnel", "inventory/fulfillment sync issue", "check stock sync jobs"],
      };
    },
  },
  {
    name: "fraud_3ds_false_positive",
    surfaces: ["/payment"],
    windowDays: [5, 10],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(0.003, 0.012);
      const dropoff_baseline = rng.float(0.65, 0.80);
      const ticket_baseline = rng.float(0.001, 0.004);

      const error_current = rng.float(0.020, 0.090);
      const dropoff_current = rng.float(0.78, 0.93);
      const ticket_current = rng.float(0.004, 0.020);

      const sigs: Array<{ sig: string; count: number; example: string }> = [];
      if (rng.next() > 0.5) {
        sigs.push({
          sig: "3DS_CHALLENGE_FAILED",
          count: rng.int(200, 400),
          example: "3DS challenge loop / auth failed",
        });
      } else {
        sigs.push({
          sig: "FRAUD_REJECTED",
          count: rng.int(100, 200),
          example: "Transaction rejected by fraud rules",
        });
      }

      return {
        error_rate: { baseline: error_baseline, current: error_current },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_current },
        ticket_rate: { baseline: ticket_baseline, current: ticket_current },
        affected_accounts: rng.int(10, 80),
        revenue_at_risk: rng.int(10000, 90000),
        top_error_signatures: sigs,
        top_ticket_topics: [{
          topic: "payment rejected",
          count: rng.int(20, 35),
          snippets: ["Payment rejected repeatedly.", "3DS keeps looping."],
        }],
        release: { top: rng.pick(["web@1.41.2", "web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["segment concentrated (country=DE, device=iOS)", "fraud/3DS false positives", "review risk rules"],
      };
    },
  },
  {
    name: "analytics_outage",
    surfaces: ["/checkout"],
    windowDays: [1, 2],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      return {
        error_rate: { baseline: error_baseline, current: error_baseline },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_baseline },
        ticket_rate: { baseline: ticket_baseline, current: ticket_baseline },
        affected_accounts: rng.int(15, 25),
        revenue_at_risk: rng.int(0, 1000),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.41.2", "web@1.42.0"]), share: rng.float(0.10, 0.35) },
        hypotheses_hints: ["tracking/pixel outage likely", "business signals stable", "check instrumentation deploy"],
      };
    },
  },
  {
    name: "event_schema_change",
    surfaces: ["/cart"],
    windowDays: [1, 1],
    generate: (rng, surface, windowStart, windowEnd) => {
      const baselines = BASELINE_RANGES[surface];
      const error_baseline = rng.float(baselines.error_rate[0], baselines.error_rate[1]);
      const dropoff_baseline = rng.float(baselines.dropoff_rate[0], baselines.dropoff_rate[1]);
      const ticket_baseline = rng.float(baselines.ticket_rate[0], baselines.ticket_rate[1]);

      return {
        error_rate: { baseline: error_baseline, current: error_baseline },
        dropoff_rate: { baseline: dropoff_baseline, current: dropoff_baseline },
        ticket_rate: { baseline: ticket_baseline, current: ticket_baseline },
        affected_accounts: rng.int(20, 30),
        revenue_at_risk: rng.int(0, 500),
        top_error_signatures: [],
        top_ticket_topics: [],
        release: { top: rng.pick(["web@1.41.2"]), share: rng.float(0.30, 0.50) },
        hypotheses_hints: ["one key event missing", "schema/SDK deploy", "validate event pipeline"],
      };
    },
  },
];
