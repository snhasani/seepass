# Seepass Web App

Next.js app for the Seepass AI Product Assistant: dashboard, signals, and assistant (Discover + Workshop).

## Setup

1. **Copy env from example**

   ```bash
   cp .env.example .env.local
   ```

2. **Fill in `.env.local`**

   | Variable | Where to get it |
   |----------|-----------------|
   | `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings → Deploy Key |
   | `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard (e.g. `https://your-project.convex.cloud`) |
   | `OPENAI_API_KEY` | OpenAI API keys |

3. **Install and run**

   ```bash
   pnpm install
   pnpm dev
   ```

   For Convex backend (separate terminal):

   ```bash
   pnpm dev:convex
   ```

4. **Optional: seed pattern records**

   ```bash
   pnpm db:seed
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js dev server (Turbopack) |
| `pnpm dev:convex` | Convex dev (sync schema + run functions) |
| `pnpm build` | Production build |
| `pnpm db:seed` | Seed Convex `patternRecords` if empty |
| `pnpm db:seed:replace` | Replace `patternRecords` from `convex/seed-data.json` |

## Structure

* `app/(protected)/` — Dashboard, Signals, Assistant (Discover, Workshop), auth-gated layout
* `app/api/` — Routes: chat, explain, problem-chat, signals, waitlist
* `app/auth/` — Sign-in, sign-up
* `convex/` — Convex schema, functions, seed data
* `features/` — Auth store, problems (discovery + workshop canvas)
* `shared/` — UI components, dashboard blocks, layouts, providers
