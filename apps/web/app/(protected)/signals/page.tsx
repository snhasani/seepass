"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  AlertTriangle,
  ArrowDownUp,
  ChevronDown,
  Eye,
  Lightbulb,
  Loader2,
  X,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface Signal {
  _id: Id<"patternRecords">;
  scenario: string;
  entityType: string;
  entityKey: string;
  windowStart: string;
  windowEnd: string;
  score: number;
  record: {
    signals: {
      error_rate?: {
        baseline: number;
        current: number;
        delta_pct: number;
        z: number;
      };
      dropoff_rate?: {
        baseline: number;
        current: number;
        delta_pct: number;
        z: number;
      };
      ticket_rate?: {
        baseline: number;
        current: number;
        delta_pct: number;
        z: number;
      };
      affected_accounts?: number;
      revenue_at_risk?: number;
    };
    hypotheses_hints?: string[];
    release?: { top: string; share: number };
    top_error_signatures?: string[];
    top_ticket_topics?: string[];
  };
}

interface FilterOption {
  value: string;
  count: number;
}

type SignalType = "investigate" | "watch" | "opportunity";

const investigateScenarios = [
  "shipping_tax_bug",
  "inventory_sync_incident",
  "backend_latency_regression",
  "frontend_js_crash_pdp",
  "fraud_3ds_false_positive",
  "checkout_payment_timeout",
  "analytics_outage",
  "event_schema_change",
];

const opportunityScenarios = [
  "speed_improvement",
  "payment_method_added",
  "cart_recovery_push",
];

function scenarioToType(scenario: string): SignalType {
  if (investigateScenarios.includes(scenario)) return "investigate";
  if (opportunityScenarios.includes(scenario)) return "opportunity";
  if (
    scenario.includes("bug") ||
    scenario.includes("crash") ||
    scenario.includes("incident") ||
    scenario.includes("regression") ||
    scenario.includes("outage") ||
    scenario.includes("timeout")
  )
    return "investigate";
  if (
    scenario.includes("improvement") ||
    scenario.includes("added") ||
    scenario.includes("recovery")
  )
    return "opportunity";
  return "watch";
}

const typeConfig: Record<
  SignalType,
  { label: string; icon: typeof AlertTriangle; colors: string }
> = {
  investigate: {
    label: "Investigate",
    icon: AlertTriangle,
    colors: "bg-rose-100 text-rose-700 border-rose-300",
  },
  watch: {
    label: "Watch",
    icon: Eye,
    colors: "bg-amber-100 text-amber-700 border-amber-300",
  },
  opportunity: {
    label: "Opportunity",
    icon: Lightbulb,
    colors: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
};

function entityKeyToTitle(entityKey: string): string {
  return (
    entityKey
      .replace(/^\//, "")
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || entityKey
  );
}

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${new Date(start).toLocaleDateString("en-US", opts)} – ${new Date(end).toLocaleDateString("en-US", opts)}`;
}

function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatCurrency(value: number): string {
  return value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`;
}

function SignalRow({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const type = scenarioToType(signal.scenario);
  const config = typeConfig[type];
  const Icon = config.icon;
  const { signals, hypotheses_hints, release } = signal.record;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-foreground">
            {entityKeyToTitle(signal.entityKey)}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              config.colors
            )}
          >
            <Icon className="size-3" />
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateRange(signal.windowStart, signal.windowEnd)}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded p-1 transition-colors hover:bg-slate-100"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                expanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <p className="flex-1 text-sm text-slate-600 line-clamp-2">
          {hypotheses_hints?.[0] || signal.scenario.replace(/_/g, " ")}
        </p>
        <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
          {signals.affected_accounts !== undefined && (
            <span>
              <span className="font-medium text-foreground">
                {signals.affected_accounts}
              </span>{" "}
              accounts
            </span>
          )}
          {signals.revenue_at_risk !== undefined && (
            <span>
              <span className="font-medium text-foreground">
                {formatCurrency(signals.revenue_at_risk)}
              </span>{" "}
              at risk
            </span>
          )}
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {signal.score.toFixed(1)}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {signals.error_rate && (
              <div>
                <p className="text-xs text-muted-foreground">Error Rate</p>
                <p className="mt-1 font-medium">
                  {(signals.error_rate.current * 100).toFixed(2)}%
                  <span
                    className={cn(
                      "ml-2 text-sm",
                      signals.error_rate.delta_pct > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                    )}
                  >
                    {formatPercent(signals.error_rate.delta_pct)}
                  </span>
                </p>
              </div>
            )}
            {signals.dropoff_rate && (
              <div>
                <p className="text-xs text-muted-foreground">Dropoff Rate</p>
                <p className="mt-1 font-medium">
                  {(signals.dropoff_rate.current * 100).toFixed(1)}%
                  <span
                    className={cn(
                      "ml-2 text-sm",
                      signals.dropoff_rate.delta_pct > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                    )}
                  >
                    {formatPercent(signals.dropoff_rate.delta_pct)}
                  </span>
                </p>
              </div>
            )}
            {signals.ticket_rate && (
              <div>
                <p className="text-xs text-muted-foreground">Ticket Rate</p>
                <p className="mt-1 font-medium">
                  {(signals.ticket_rate.current * 100).toFixed(3)}%
                  <span
                    className={cn(
                      "ml-2 text-sm",
                      signals.ticket_rate.delta_pct > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                    )}
                  >
                    {formatPercent(signals.ticket_rate.delta_pct)}
                  </span>
                </p>
              </div>
            )}
            {release && (
              <div>
                <p className="text-xs text-muted-foreground">Top Release</p>
                <p className="mt-1 font-medium">
                  {release.top}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({(release.share * 100).toFixed(0)}%)
                  </span>
                </p>
              </div>
            )}
          </div>

          {hypotheses_hints && hypotheses_hints.length > 1 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Hypotheses</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {hypotheses_hints.slice(1).map((hint, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs text-slate-700"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Entity: {signal.entityKey}</span>
            <span>Type: {signal.entityType}</span>
            <span>Trend: {signal.scenario.replace(/_/g, " ")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignalsPage() {
  const [trend, setTrend] = useState("");
  const [entityKey, setEntityKey] = useState("");
  const [minScore, setMinScore] = useState("");
  const [badge, setBadge] = useState("");
  const [sortBy, setSortBy] = useState<
    "score" | "date" | "accounts" | "revenue" | "badge"
  >("score");

  const signalsData = useQuery(api.patternRecords.list, {
    scenario: trend || undefined,
    entityKey: entityKey || undefined,
    minScore: minScore ? parseFloat(minScore) : undefined,
  });

  const aggregatesData = useQuery(api.patternRecords.aggregates);

  const signals = useMemo(() => {
    if (!signalsData?.data) return [];
    let filtered = [...signalsData.data];
    if (badge) {
      filtered = filtered.filter((s) => scenarioToType(s.scenario) === badge);
    }
    const badgeOrder: Record<SignalType, number> = {
      investigate: 0,
      watch: 1,
      opportunity: 2,
    };
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.windowEnd).getTime() - new Date(a.windowEnd).getTime()
          );
        case "accounts":
          return (
            (b.record.signals.affected_accounts ?? 0) -
            (a.record.signals.affected_accounts ?? 0)
          );
        case "revenue":
          return (
            (b.record.signals.revenue_at_risk ?? 0) -
            (a.record.signals.revenue_at_risk ?? 0)
          );
        case "badge":
          return (
            badgeOrder[scenarioToType(a.scenario)] -
            badgeOrder[scenarioToType(b.scenario)]
          );
        default:
          return b.score - a.score;
      }
    });
    return filtered;
  }, [signalsData, badge, sortBy]);

  const filterOptions = useMemo(() => {
    if (!aggregatesData) return null;
    return {
      scenarios: aggregatesData.scenarios,
      entities: aggregatesData.entities,
    };
  }, [aggregatesData]);

  const loading = signalsData === undefined || aggregatesData === undefined;
  const total = signalsData?.meta.total ?? 0;

  const clearFilters = () => {
    setTrend("");
    setEntityKey("");
    setMinScore("");
    setBadge("");
  };

  const hasFilters = trend || entityKey || minScore || badge;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Signals</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} detected trends and anomalies
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[130px]">
              <Label htmlFor="trend" className="text-xs text-muted-foreground">
                Trend
              </Label>
              <select
                id="trend"
                value={trend}
                onChange={(e) => setTrend(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              >
                <option value="">All trends</option>
                {filterOptions?.scenarios.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value.replace(/_/g, " ")} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[110px]">
              <Label htmlFor="badge" className="text-xs text-muted-foreground">
                Badge
              </Label>
              <select
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              >
                <option value="">All</option>
                <option value="investigate">Investigate</option>
                <option value="watch">Watch</option>
                <option value="opportunity">Opportunity</option>
              </select>
            </div>

            <div className="min-w-[120px]">
              <Label htmlFor="entity" className="text-xs text-muted-foreground">
                Entity
              </Label>
              <select
                id="entity"
                value={entityKey}
                onChange={(e) => setEntityKey(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              >
                <option value="">All entities</option>
                {filterOptions?.entities.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.value} ({e.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[90px]">
              <Label
                htmlFor="minScore"
                className="text-xs text-muted-foreground"
              >
                Min Score
              </Label>
              <Input
                id="minScore"
                type="number"
                placeholder="0"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="mt-1"
              />
            </div>

            {hasFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <X className="size-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
            <ArrowDownUp className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Sort by</span>
            <div className="flex gap-1">
              {(["score", "date", "accounts", "revenue", "badge"] as const).map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSortBy(opt)}
                    className={cn(
                      "rounded px-2 py-1 text-xs transition-colors",
                      sortBy === opt
                        ? "bg-slate-200 font-medium text-slate-900"
                        : "text-muted-foreground hover:bg-slate-100"
                    )}
                  >
                    {opt === "score" && "Score"}
                    {opt === "date" && "Date"}
                    {opt === "accounts" && "Accounts"}
                    {opt === "revenue" && "Revenue"}
                    {opt === "badge" && "Type"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : signals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center text-sm text-muted-foreground">
            No signals found
          </div>
        ) : (
          <div className="space-y-3">
            {signals.map((signal) => (
              <SignalRow key={signal._id} signal={signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
