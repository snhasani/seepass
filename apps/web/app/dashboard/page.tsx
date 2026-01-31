"use client";

import {
  MetricCard,
  SummaryPanel,
  ProblemCard,
  AIInsight,
  TrendList,
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

const mockTrends = [
  { id: "t1", title: "Mobile checkout issues", trend: "hot" as const, count: 47, isNew: false },
  { id: "t2", title: "iOS 18 compatibility", trend: "emerging" as const, count: 32, isNew: true },
  { id: "t3", title: "Enterprise performance", trend: "rising" as const, count: 28 },
  { id: "t4", title: "Pricing confusion", trend: "emerging" as const, count: 19, isNew: true },
  { id: "t5", title: "API rate limits", trend: "stable" as const, count: 15 },
  { id: "t6", title: "Documentation gaps", trend: "declining" as const, count: 8 },
];

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      {/* Sidebar with metrics and trends */}
      <aside className="w-80 shrink-0 border-r bg-muted/30 p-4 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide px-1">
            Overview
          </h2>
          
          <MetricCard
            title="Total Problems"
            value={156}
            previousValue={142}
            trend="up"
            trendIsPositive={false}
            icon={AlertTriangle}
            variant="warning"
            size="sm"
          />
          
          <MetricCard
            title="Critical Issues"
            value={3}
            previousValue={1}
            trend="up"
            trendIsPositive={false}
            icon={AlertTriangle}
            variant="warning"
            size="sm"
          />
          
          <MetricCard
            title="Signals This Week"
            value={234}
            previousValue={198}
            trend="up"
            icon={MessageSquare}
            variant="highlighted"
            size="sm"
          />
          
          <MetricCard
            title="AI Insights"
            value={12}
            description="New patterns detected"
            icon={Sparkles}
            variant="ai"
            size="sm"
          />
          
          <MetricCard
            title="Active Users Affected"
            value="2.4K"
            previousValue={1800}
            trend="up"
            trendIsPositive={false}
            icon={Users}
            size="sm"
          />
        </div>

        <div className="mt-6">
          <TrendList
            trends={mockTrends}
            title="Trending Topics"
            maxItems={6}
          />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary Panel */}
          <SummaryPanel
            title="What Matters Right Now"
            subtitle="AI-prioritized based on signal analysis and business impact"
            priorities={mockPriorities}
            lastUpdated={new Date()}
            maxItems={5}
          />

          {/* AI Insight */}
          <AIInsight
            type="pattern"
            title="Payment issues cluster detected"
            description="We've identified a pattern: 78% of checkout abandonment reports mention discount code application. This suggests a specific bug rather than general UX issues."
            confidence={0.87}
            explanation="This insight is based on semantic analysis of 47 support tickets, 12 Slack mentions, and 8 user interviews from the past 7 days. The discount code correlation was identified by our clustering algorithm."
            relatedProblems={[
              "Users can't complete checkout on mobile",
              "Discount codes not applying correctly",
              "Cart total not updating",
            ]}
            expandable
            defaultExpanded={false}
          />

          {/* Problem Cards */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Top Problems</h2>
            <div className="grid gap-4">
              {mockProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
