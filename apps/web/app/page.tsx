import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  MessageSquare,
  Target,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Eye,
  GitBranch,
  Users,
  TrendingUp,
  Shield,
  Lightbulb,
} from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.07]">
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3">
        <Icon className="h-6 w-6 text-purple-300" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
          {number}
        </div>
        <div className="mt-2 h-full w-px bg-gradient-to-b from-purple-500/50 to-transparent" />
      </div>
      <div className="pb-12">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
        <Check className="h-3 w-3 text-emerald-400" />
      </div>
      <span className="text-slate-300">{children}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-1/3 top-2/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Target className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">SeePass</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-white font-medium text-slate-900 hover:bg-white/90"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pb-20 pt-20 md:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-purple-200 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-300" />
            </span>
            AI-Native Product Management
          </div>

          {/* Headline */}
          <h1 className="mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text font-sans text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Stop managing backlogs.
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-blue-300 bg-clip-text">
              Start understanding problems.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-300/90 sm:text-xl">
            The AI-native platform that treats customer problems as the primary
            unit of work. Make confident product decisions grounded in real
            customer pain—not endless tickets.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-48 gap-2 bg-white font-semibold text-slate-900 hover:bg-white/90"
            >
              <Link href="/auth/signup">
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-48 border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Social proof hint */}
          <p className="mt-8 text-sm text-slate-500">
            Built for product teams who believe deciding what to build is the
            real bottleneck.
          </p>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="relative z-10 border-y border-white/5 bg-black/20 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Product teams are drowning
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Building software isn&apos;t the bottleneck anymore—deciding what
              to build is.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="mb-3 text-3xl font-bold text-red-400">∞</div>
              <h3 className="mb-1 font-medium text-white">Growing Backlogs</h3>
              <p className="text-sm text-slate-400">
                Endless tickets that never get cleaned up
              </p>
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
              <div className="mb-3 text-3xl font-bold text-orange-400">5+</div>
              <h3 className="mb-1 font-medium text-white">Scattered Signals</h3>
              <p className="text-sm text-slate-400">
                Feedback across Slack, support, interviews, docs
              </p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <div className="mb-3 text-3xl font-bold text-yellow-400">→</div>
              <h3 className="mb-1 font-medium text-white">
                Solution Bias
              </h3>
              <p className="text-sm text-slate-400">
                Jumping to features before understanding pain
              </p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="mb-3 text-3xl font-bold text-purple-400">↑</div>
              <h3 className="mb-1 font-medium text-white">Cognitive Load</h3>
              <p className="text-sm text-slate-400">
                High mental overhead deciding what matters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-300">
              <Sparkles className="h-4 w-4" />
              AI-Native by Design
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Problems first. Solutions second.
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              AI continuously organizes, clusters, and prioritizes raw customer
              signals—while you provide strategic judgment and context.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={MessageSquare}
              title="Problem Capture"
              description="Ingest raw customer problems from Slack, support tickets, interviews, and team observations. Structured, searchable, and separate from solutions."
            />
            <FeatureCard
              icon={Brain}
              title="AI Analysis & Clustering"
              description="AI identifies recurring problems, clusters related issues, detects emerging trends, and flags duplicates—turning scattered signals into a coherent landscape."
            />
            <FeatureCard
              icon={Target}
              title="Smart Prioritization"
              description="AI proposes priorities based on frequency, severity, and strategic relevance. Override with reasoning and watch the system learn from your decisions."
            />
            <FeatureCard
              icon={Layers}
              title="Visual Canvas"
              description="A Miro-like workspace where AI-identified problems are highlighted. Group, annotate, and adjust importance with full reasoning trails."
            />
            <FeatureCard
              icon={Lightbulb}
              title="Solution Exploration"
              description="Only after problems are understood does AI propose solution directions. Problem-solution fit stays explicit and reviewable."
            />
            <FeatureCard
              icon={Zap}
              title="Reality Checks"
              description="AI estimates complexity while humans provide independent estimates. Large discrepancies trigger discussion and surface hidden risks early."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 border-y border-white/5 bg-black/20 px-6 py-24 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              How SeePass Works
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              From scattered signals to confident decisions—here&apos;s the
              journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <StepCard
                number="1"
                title="Capture Problems"
                description="Connect your signal sources—Slack, support tools, email. Problems flow in automatically and get structured by AI."
              />
              <StepCard
                number="2"
                title="AI Surfaces Patterns"
                description="Watch as AI clusters related issues, identifies trends, and highlights what's gaining momentum across your customer base."
              />
              <StepCard
                number="3"
                title="Collaborate & Prioritize"
                description="Use the visual canvas to group problems, add context, and align with your team. Override AI suggestions with reasoning."
              />
              <StepCard
                number="4"
                title="Decide with Confidence"
                description="Get 'What matters right now' summaries, prioritized problem lists, and clear decision trails explaining every choice."
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Mock UI Preview */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
                      <Eye className="h-4 w-4 text-purple-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          AI Insight
                        </div>
                        <div className="text-xs text-slate-400">
                          3 related problems detected
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-medium text-amber-300">
                          High
                        </span>
                        <span className="text-xs text-slate-500">
                          12 signals
                        </span>
                      </div>
                      <div className="text-sm text-white">
                        Users can&apos;t find settings
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-xs font-medium text-teal-300">
                          Medium
                        </span>
                        <span className="text-xs text-slate-500">8 signals</span>
                      </div>
                      <div className="text-sm text-white">
                        Export takes too long
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
                <Shield className="h-4 w-4" />
                Core Principles
              </div>
              <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                AI that thinks with you,
                <br />
                not for you
              </h2>
              <p className="mb-8 text-slate-400">
                Every recommendation is explainable. No black-box
                prioritization. Human judgment always wins—and the AI learns
                from it.
              </p>

              <div className="space-y-4">
                <BenefitItem>
                  Problems come before features or solutions
                </BenefitItem>
                <BenefitItem>
                  Every decision traces back to real customer pain
                </BenefitItem>
                <BenefitItem>
                  Override AI with context—it learns from you
                </BenefitItem>
                <BenefitItem>
                  Full transparency on how priorities are calculated
                </BenefitItem>
                <BenefitItem>
                  Works alongside your existing tools, not against them
                </BenefitItem>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Users className="mb-3 h-8 w-8 text-purple-400" />
                <h3 className="mb-2 font-semibold text-white">
                  Human-in-the-Loop
                </h3>
                <p className="text-sm text-slate-400">
                  AI proposes, you decide. Every override makes the system
                  smarter.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <TrendingUp className="mb-3 h-8 w-8 text-blue-400" />
                <h3 className="mb-2 font-semibold text-white">
                  Learns Over Time
                </h3>
                <p className="text-sm text-slate-400">
                  Your strategic context shapes how AI prioritizes future
                  problems.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Eye className="mb-3 h-8 w-8 text-teal-400" />
                <h3 className="mb-2 font-semibold text-white">
                  Full Transparency
                </h3>
                <p className="text-sm text-slate-400">
                  See exactly why something was prioritized. No mystery scores.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <GitBranch className="mb-3 h-8 w-8 text-fuchsia-400" />
                <h3 className="mb-2 font-semibold text-white">Repo-Native</h3>
                <p className="text-sm text-slate-400">
                  Problems can live in your repo. Version control provides the
                  audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="relative z-10 border-y border-white/5 bg-black/20 px-6 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            What changes when you use SeePass
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-slate-400">
            Less time grooming, more time building what actually matters.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="mb-2 text-2xl font-bold text-emerald-400">0</div>
              <p className="text-sm text-slate-300">Grooming meetings needed</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="mb-2 text-2xl font-bold text-blue-400">100%</div>
              <p className="text-sm text-slate-300">
                Decisions grounded in data
              </p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
              <div className="mb-2 text-2xl font-bold text-purple-400">↓</div>
              <p className="text-sm text-slate-300">Mental overhead reduced</p>
            </div>
            <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-6">
              <div className="mb-2 text-2xl font-bold text-fuchsia-400">↑</div>
              <p className="text-sm text-slate-300">Team alignment improved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Ready to understand
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
              what really matters?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
            Join product teams who make confident, high-impact decisions—before
            writing code, before creating tickets, before filling another
            backlog.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-48 gap-2 bg-white font-semibold text-slate-900 hover:bg-white/90"
            >
              <Link href="/auth/signup">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-blue-500">
              <Target className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-400">SeePass</span>
          </div>
          <p className="text-sm text-slate-500">
            AI-native product management. Problems first.
          </p>
        </div>
      </footer>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
}
