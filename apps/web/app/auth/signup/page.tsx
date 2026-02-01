"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ROLE_OPTIONS = [
  { value: "Product Manager", label: "Product Manager" },
  {
    value: "Head of Product / VP Product",
    label: "Head of Product / VP Product",
  },
  { value: "Chief Product Officer", label: "Chief Product Officer" },
  { value: "Founder / CEO", label: "Founder / CEO" },
  { value: "Product Designer", label: "Product Designer" },
  { value: "Product Owner", label: "Product Owner" },
  {
    value: "Engineering (Product-focused)",
    label: "Engineering (Product-focused)",
  },
  { value: "Other", label: "Other" },
];

const QUALIFIED_ROLES = [
  "Product Manager",
  "Head of Product / VP Product",
  "Chief Product Officer",
  "Founder / CEO",
  "Product Designer",
  "Product Owner",
  "Engineering (Product-focused)",
];

type FormStep = "initial" | "expanded" | "success";

export default function WaitlistPage() {
  const [step, setStep] = useState<FormStep>("initial");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [isQualified, setIsQualified] = useState(false);

  async function handleInitialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to join waitlist");
        return;
      }

      setFormData((prev) => ({ ...prev, name, email }));
      setStep("expanded");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExpandedSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const company = data.get("company") as string;
    const role = formData.role;

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update details");
        return;
      }

      setFormData((prev) => ({ ...prev, company, role }));
      setIsQualified(result.isQualified);
      setStep("success");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSkipToSuccess() {
    setStep("success");
  }

  return (
    <div className="min-h-dvh bg-slate-950">
      <div className="relative min-h-dvh overflow-hidden">
        {/* Dark dot pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] opacity-30 [background-size:24px_24px]" />

        {/* Deep accent blobs */}
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-indigo-900/30 blur-3xl" />
        <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-teal-900/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-900/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col-reverse items-center gap-10 px-6 py-12 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Left side - Marketing content */}
          <div className="flex w-full flex-col justify-center lg:max-w-md">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <Target className="h-4 w-4 text-slate-900" />
              </div>
              <span className="text-lg font-semibold text-white">SeePass</span>
            </Link>

            <div className="mt-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                <Sparkles className="h-3 w-3" />
                Early Access
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Be among the first to transform how you handle customer
                problems.
              </h1>
              <p className="text-base text-slate-400">
                Join product leaders who are tired of endless backlogs and want
                AI that thinks with them, not for them.
              </p>
              <div className="space-y-3 text-sm text-slate-400">
                {[
                  "AI-powered problem clustering & prioritization",
                  "Turn scattered signals into clear decisions",
                  "Zero grooming meetings needed",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 bg-slate-700"
                    >
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">Join 200+ PMs</p>
                  <p className="text-slate-500">on the waitlist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form card */}
          <div className="flex w-full max-w-md flex-col justify-center">
            {step === "initial" && (
              <Card className="border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Join the Waitlist
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Get early access when we launch.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleInitialSubmit}>
                  <CardContent className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-md border border-rose-900/50 bg-rose-950/50 px-3 py-2 text-sm text-rose-400">
                        {error}
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Jane Smith"
                        required
                        className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Work Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Joining..."
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            )}

            {step === "expanded" && (
              <Card className="border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-2xl text-white">
                    You&apos;re on the list!
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Want to help us prioritize? Tell us more about yourself.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleExpandedSubmit}>
                  <CardContent className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-md border border-rose-900/50 bg-rose-950/50 px-3 py-2 text-sm text-rose-400">
                        {error}
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company" className="text-slate-300">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Acme Inc."
                        className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="role" className="text-slate-300">
                        Your Role
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white focus:ring-emerald-500/50 [&>span]:text-slate-500 [&>span]:data-[placeholder]:text-slate-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-900">
                          {ROLE_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-slate-300 focus:bg-slate-800 focus:text-white"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2 flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                        onClick={handleSkipToSuccess}
                      >
                        Skip
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Complete"}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            )}

            {step === "success" && (
              <Card className="border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <CardTitle className="text-2xl text-white">
                    Welcome to the waitlist!
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    We&apos;ll notify you at{" "}
                    <span className="text-emerald-400">{formData.email}</span>{" "}
                    when it&apos;s your turn.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {isQualified && (
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        <span className="font-medium text-indigo-300">
                          Want to skip the line?
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-slate-400">
                        As a product professional, you qualify for a personal
                        intro call. Let&apos;s chat about your workflow!
                      </p>
                      <Button
                        asChild
                        className="w-full bg-indigo-600 font-semibold text-white hover:bg-indigo-500"
                      >
                        <a
                          href="https://cal.com/seepass/15min"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Book a 15-min Call
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <p className="text-sm text-slate-400">
                      <span className="font-medium text-white">
                        What happens next?
                      </span>
                      <br />
                      We&apos;re rolling out access in batches. Product
                      professionals get priority. We&apos;ll reach out soon!
                    </p>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/"
                      className="text-sm text-slate-500 hover:text-slate-300"
                    >
                      ← Back to homepage
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
