"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth";
import { useTheme } from "@/shared/providers/theme-provider";

type ProtectedShellProps = {
  children: React.ReactNode;
};

export function ProtectedShell({ children }: ProtectedShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            S
          </span>
          <span className="font-semibold">SeePass</span>
        </div>

        <div className="relative flex items-center" data-slot="user-menu">
          <div className="group relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open user menu"
              className="rounded-full p-0"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs font-semibold">
                  {(user?.name || user?.email || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>

            <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-56 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-md border bg-background p-1">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  <div className="text-sm font-medium text-foreground">
                    {user?.name || "User"}
                  </div>
                  <div className="truncate">{user?.email}</div>
                </div>
                <div className="my-1 h-px bg-border" />
                <div className="px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  Theme
                </div>
                <div className="flex items-center gap-1 px-1 pb-1">
                  <Button
                    variant={theme === "light" ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label="Light theme"
                    aria-pressed={theme === "light"}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label="Dark theme"
                    aria-pressed={theme === "dark"}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === "system" ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label="System theme"
                    aria-pressed={theme === "system"}
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
                {theme === "system" ? (
                  <div className="px-2 pb-1 text-xs text-muted-foreground">
                    Using system:{" "}
                    <span className="font-medium text-foreground">
                      {resolvedTheme === "dark" ? "Dark" : "Light"}
                    </span>
                  </div>
                ) : null}
                <div className="my-1 h-px bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 text-sm">
        <Link
          href="/dashboard"
          className={`rounded-full px-3 py-1.5 transition ${
            pathname === "/dashboard"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/assistant"
          className={`rounded-full px-3 py-1.5 transition ${
            pathname === "/assistant"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Problem Assistant
        </Link>
      </nav>

      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
    </div>
  );
}
