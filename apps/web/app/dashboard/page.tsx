"use client";

import {
  AIInsight,
  ProblemCard,
  StatPill,
  SummaryPanel,
  type PriorityItem,
  type Problem,
} from "@repo/design-system";
import {
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";

// Mock data for the dashboard
const mockPriorities: PriorityItem[] = [
  {
    id: "1",
    title: "Checkout flow abandonment spike",
    description: "Users are dropping off at the payment step at 3x the normal rate",
    severity: "critical",
    signalCount: 47,
    reason: "High impact on revenue, affecting 12% of all transactions",
    isAiSuggested: true,
  },
  {
    id: "2",
    title: "Mobile app crashes on iOS 18",
    severity: "high",
    signalCount: 32,
    reason: "Increasing trend, 85% of affected users are premium subscribers",
    isAiSuggested: true,
  },
  {
    id: "3",
    title: "Slow search performance",
    description: "Search queries taking 5+ seconds on average",
    severity: "medium",
    signalCount: 28,
    reason: "Consistently mentioned in support tickets this week",
  },
  {
    id: "4",
    title: "Confusing pricing page layout",
    severity: "medium",
    signalCount: 19,
    reason: "New pattern emerging from user interviews",
    isAiSuggested: true,
  },
  {
    id: "5",
    title: "Email notification delays",
    severity: "low",
    signalCount: 12,
    reason: "Long-standing issue with stable signal count",
  },
];

const mockProblems: Problem[] = [
  {
    id: "prob-1",
    title: "Users can't complete checkout on mobile",
    description: "Multiple reports of the checkout button being unresponsive on mobile devices, particularly after applying discount codes.",
    severity: "critical",
    sources: [
      { type: "support", timestamp: new Date("2026-01-30T14:22:00") },
      { type: "slack", timestamp: new Date("2026-01-30T11:05:00") },
      { type: "intercom", timestamp: new Date("2026-01-29T16:45:00") },
    ],
    frequency: 47,
    previousFrequency: 23,
    tags: ["mobile", "checkout", "payments"],
    clusterName: "Payment Issues",
    aiConfidence: 0.92,
    linkedSolutions: 2,
    comments: 8,
    createdAt: new Date("2026-01-28T09:00:00"),
  },
  {
    id: "prob-2",
    title: "Dashboard loading extremely slowly",
    description: "Enterprise customers reporting 10+ second load times on their main dashboard view.",
    severity: "high",
    sources: [
      { type: "email", timestamp: new Date("2026-01-30T09:15:00") },
      { type: "zendesk", timestamp: new Date("2026-01-29T14:30:00") },
    ],
    frequency: 32,
    previousFrequency: 28,
    tags: ["performance", "enterprise", "dashboard"],
    linkedSolutions: 1,
    comments: 5,
    createdAt: new Date("2026-01-25T11:30:00"),
  },
  {
    id: "prob-3",
    title: "Confusing onboarding flow for teams",
    description: "New team admins struggling to understand how to invite members and set up permissions.",
    severity: "medium",
    sources: [
      { type: "survey", timestamp: new Date("2026-01-29T10:00:00") },
      { type: "interview", timestamp: new Date("2026-01-28T15:00:00") },
      { type: "analytics", timestamp: new Date("2026-01-27T12:00:00") },
    ],
    frequency: 24,
    previousFrequency: 30,
    tags: ["onboarding", "teams", "UX"],
    clusterName: "Onboarding",
    aiConfidence: 0.78,
    linkedSolutions: 3,
    comments: 12,
    createdAt: new Date("2026-01-20T14:00:00"),
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Compact Stats Header Bar */}
      <header className="flex items-center gap-4 px-6 py-3 border-b bg-muted/30 overflow-x-auto">
        <StatPill
          icon={AlertTriangle}
          label="Problems"
          value={156}
          trend="+10%"
          negative
        />
        <StatPill
          icon={AlertTriangle}
          label="Critical"
          value={3}
          variant="critical"
        />
        <StatPill
          icon={MessageSquare}
          label="Signals"
          value={234}
          trend="+18%"
          variant="signal"
        />
        <StatPill
          icon={Sparkles}
          label="AI Insights"
          value={12}
          variant="ai"
        />
        <StatPill
          icon={Users}
          label="Users Affected"
          value="2.4K"
          trend="+33%"
          negative
        />
      </header>

      {/* Main content area - full width */}
      <main className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Summary Panel - now compact by default */}
          <SummaryPanel
            title="What Matters Right Now"
            subtitle="AI-prioritized based on signal analysis"
            priorities={mockPriorities}
            lastUpdated={new Date()}
            maxItems={5}
            compact
          />

          {/* AI Insight - collapsible */}
          <AIInsight
            type="pattern"
            title="Payment issues cluster detected"
            description="78% of checkout abandonment reports mention discount code application. This suggests a specific bug rather than general UX issues."
            confidence={0.87}
            explanation="Based on semantic analysis of 47 support tickets, 12 Slack mentions, and 8 user interviews from the past 7 days."
            relatedProblems={[
              "Users can't complete checkout on mobile",
              "Discount codes not applying correctly",
              "Cart total not updating",
            ]}
            expandable
            defaultExpanded={false}
          />

          {/* Problem Cards - collapsible */}
          <div className="space-y-2">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide px-1">
              Top Problems
            </h2>
            <div className="space-y-2">
              {mockProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  collapsible
                  defaultExpanded={false}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
