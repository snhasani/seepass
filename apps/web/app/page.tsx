import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
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

      {/* Content */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-purple-200 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-300" />
            </span>
            AI-Powered Assistant
          </div>

          {/* Headline */}
          <h1 className="mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text font-sans text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            Your intelligent
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-blue-300 bg-clip-text">
              assistant awaits
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-12 max-w-xl text-lg text-slate-300/80 sm:text-xl">
            Experience the future of productivity with SeePass. Intelligent conversations,
            seamless workflows, and powerful insights—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-40 bg-white font-semibold text-slate-900 hover:bg-white/90"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-40 border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>
    </div>
  );
}
