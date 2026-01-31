"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/auth-store";
import { CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const success = await signIn(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="relative min-h-dvh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-50 [background-size:24px_24px]" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute -right-16 top-1/4 h-64 w-64 rounded-full bg-teal-100/60 blur-3xl" />

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col-reverse items-center gap-10 px-6 py-12 lg:flex-row lg:items-stretch lg:gap-16">
          <div className="flex w-full flex-col justify-center lg:max-w-md">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                SeePass
              </span>
            </Link>

            <div className="mt-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Welcome back
              </div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Sign in to keep the problem trail intact.
              </h1>
              <p className="text-base text-slate-600">
                Pick up where you left off with structured insights, prioritized
                pain points, and the reasoning behind every decision.
              </p>
              <div className="space-y-3 text-sm text-slate-600">
                {[
                  "See the latest AI-surfaced trends",
                  "Review decisions with full context",
                  "Keep the entire team aligned",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col justify-center">
            <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  Sign in
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Use your SeePass account to continue.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className="text-slate-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-400"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-slate-900 font-semibold text-white hover:bg-slate-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="font-semibold text-slate-900 underline-offset-4 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
