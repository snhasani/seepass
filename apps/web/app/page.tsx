import { CanvasShowcase } from "@/shared/components/landing/canvas-showcase";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Eye,
  GitBranch,
  Inbox,
  Layers,
  Lightbulb,
  MessageSquare,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "indigo",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: "indigo" | "teal" | "amber" | "rose";
}) {
  const accentStyles = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div
        className={`mb-4 inline-flex rounded-xl p-3 transition-colors ${accentStyles[accent]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

function PrincipleCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Target className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              SeePass
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-slate-900 hover:bg-slate-800">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-24">
        {/* Subtle background pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-50 [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            AI-native product management
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Understand problems first.
            <br />
            <span className="text-slate-500">Build solutions second.</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
            The AI platform that treats customer problems as the primary unit of
            work. Make confident product decisions grounded in real customer
            pain—not endless tickets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-44 gap-2 bg-slate-900 text-base hover:bg-slate-800"
            >
              <Link href="/auth/signup">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-44 text-base"
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>

        {/* Hero Visual - Problem Cards Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-2xl shadow-slate-200/50">
            <div className="rounded-xl bg-white">
              {/* Mock toolbar */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                    <div className="h-3 w-3 rounded-full bg-slate-200" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">
                    Problem Discovery
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    AI Active
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div className="grid gap-4 p-6 md:grid-cols-3">
                {/* AI Insight Card */}
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      AI Insight
                    </span>
                  </div>
                  <p className="mb-3 text-sm font-medium text-slate-800">
                    3 problems share a common root cause
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">
                      Navigation
                    </span>
                    <span>cluster detected</span>
                  </div>
                </div>

                {/* Problem Card 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                      High Priority
                    </span>
                    <span className="text-xs text-slate-400">24 signals</span>
                  </div>
                  <p className="mb-2 text-sm font-medium text-slate-800">
                    Users struggle to find account settings
                  </p>
                  <div className="flex gap-1.5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      UX
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      Navigation
                    </span>
                  </div>
                </div>

                {/* Problem Card 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Medium
                    </span>
                    <span className="text-xs text-slate-400">12 signals</span>
                  </div>
                  <p className="mb-2 text-sm font-medium text-slate-800">
                    Data export takes too long for large datasets
                  </p>
                  <div className="flex gap-1.5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      Performance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -left-4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute -right-4 top-1/3 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Product teams are overwhelmed
            </h2>
            <p className="text-slate-600">
              Building software is no longer the bottleneck—deciding what to
              build is.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <Inbox className="mb-3 h-6 w-6 text-slate-400" />
              <h3 className="mb-1 font-semibold text-slate-900">
                Endless Backlogs
              </h3>
              <p className="text-sm text-slate-500">
                Tickets pile up and never get cleaned
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <Workflow className="mb-3 h-6 w-6 text-slate-400" />
              <h3 className="mb-1 font-semibold text-slate-900">
                Scattered Signals
              </h3>
              <p className="text-sm text-slate-500">
                Feedback across 5+ different tools
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <ArrowUpRight className="mb-3 h-6 w-6 text-slate-400" />
              <h3 className="mb-1 font-semibold text-slate-900">
                Solution Bias
              </h3>
              <p className="text-sm text-slate-500">
                Jumping to features before understanding pain
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <BarChart3 className="mb-3 h-6 w-6 text-slate-400" />
              <h3 className="mb-1 font-semibold text-slate-900">
                Decision Fatigue
              </h3>
              <p className="text-sm text-slate-500">
                High cognitive load deciding what matters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              How it works
            </p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Problems first. Solutions second.
            </h2>
            <p className="text-slate-600">
              AI continuously organizes and prioritizes customer signals while
              you provide strategic judgment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={MessageSquare}
              title="Capture Problems"
              description="Ingest raw customer problems from Slack, support tickets, interviews, and team observations. Structured and searchable."
              accent="teal"
            />
            <FeatureCard
              icon={Brain}
              title="AI Analysis"
              description="AI identifies patterns, clusters related issues, detects trends, and flags duplicates—turning noise into signal."
              accent="indigo"
            />
            <FeatureCard
              icon={Target}
              title="Smart Prioritization"
              description="AI proposes priorities based on frequency, severity, and strategy. Override with reasoning—the system learns."
              accent="amber"
            />
            <FeatureCard
              icon={Layers}
              title="Visual Canvas"
              description="A workspace where problems are highlighted. Group, annotate, and adjust importance with full reasoning trails."
              accent="teal"
            />
            <FeatureCard
              icon={Lightbulb}
              title="Solution Mapping"
              description="Only after problems are understood does AI propose solutions. Problem-solution fit stays explicit."
              accent="indigo"
            />
            <FeatureCard
              icon={Zap}
              title="Reality Checks"
              description="AI estimates complexity while you estimate independently. Large gaps trigger discussion early."
              accent="rose"
            />
          </div>
        </div>
      </section>

      {/* Canvas Showcase - Animated Demo */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              See It In Action
            </p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Watch problems become clarity
            </h2>
            <p className="text-slate-600">
              AI continuously surfaces patterns and highlights what matters
              most.
            </p>
          </div>
          <CanvasShowcase />
        </div>
      </section>

      {/* How It Works - Steps */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-slate-50 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              The Process
            </p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              From scattered signals to confident decisions
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 hidden h-full w-px bg-slate-200 md:block" />

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Connect Your Sources",
                  description:
                    "Link Slack, support tools, email, and more. Problems flow in automatically and get structured by AI.",
                },
                {
                  step: "02",
                  title: "AI Surfaces Patterns",
                  description:
                    "Watch as AI clusters related issues, identifies trends, and highlights what's gaining momentum.",
                },
                {
                  step: "03",
                  title: "Collaborate & Prioritize",
                  description:
                    "Use the visual canvas to group problems, add context, and align with your team. Override AI with reasoning.",
                },
                {
                  step: "04",
                  title: "Decide with Confidence",
                  description:
                    "Get 'what matters now' summaries, prioritized lists, and clear decision trails explaining every choice.",
                },
              ].map((item, index) => (
                <div key={item.step} className="flex gap-6">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-sm font-bold text-slate-900">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Philosophy
              </p>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                AI that thinks with you, not for you
              </h2>
              <p className="mb-8 text-lg text-slate-600">
                Every recommendation is explainable. No black-box
                prioritization. Human judgment always wins—and the AI learns
                from it.
              </p>

              <div className="space-y-4">
                {[
                  "Problems come before features or solutions",
                  "Every decision traces back to real customer pain",
                  "Override AI with context—it learns from you",
                  "Full transparency on how priorities are calculated",
                  "Works alongside your existing tools",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <PrincipleCard
                icon={Users}
                title="Human-in-the-Loop"
                description="AI proposes, you decide. Every override makes the system smarter over time."
              />
              <PrincipleCard
                icon={Eye}
                title="Full Transparency"
                description="See exactly why something was prioritized. No mystery scores or hidden logic."
              />
              <PrincipleCard
                icon={GitBranch}
                title="Repo-Native Option"
                description="Problems can live in your repository. Version control provides the audit trail."
              />
              <PrincipleCard
                icon={Zap}
                title="Learns Over Time"
                description="Your strategic context shapes how AI prioritizes future problems."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-y border-slate-200 bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            What changes when you use SeePass
          </h2>
          <p className="mb-12 text-slate-400">
            Less time grooming, more time building what actually matters.
          </p>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold text-white">Zero</div>
              <p className="text-slate-400">Grooming meetings needed</p>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-white">100%</div>
              <p className="text-slate-400">Decisions grounded in data</p>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-white">Faster</div>
              <p className="text-slate-400">Team alignment on priorities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to understand what really matters?
          </h2>
          <p className="mb-10 text-lg text-slate-600">
            Join product teams making confident, high-impact decisions—before
            writing code, before creating tickets, before filling another
            backlog.
          </p>

          <Button
            asChild
            size="lg"
            className="min-w-48 gap-2 bg-slate-900 text-base hover:bg-slate-800"
          >
            <Link href="/auth/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <Target className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-600">SeePass</span>
          </Link>
          <p className="text-sm text-slate-500">
            AI-native product management. Problems first.
          </p>
        </div>
      </footer>
    </div>
  );
}
