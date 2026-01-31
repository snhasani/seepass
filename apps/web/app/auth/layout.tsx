import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
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

      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-20 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-fuchsia-500 text-sm font-bold">
            S
          </span>
          SeePass
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-20">
        {children}
      </div>
    </div>
  );
}
