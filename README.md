# Seepass

AI Product Assistant for mid-size product teams: surfaces data-driven insights (signals, alerts, opportunities) and supports the full lifecycle from problem discovery to ideation. Integrates with your product data to answer questions like “What are users complaining about?” or “What should we prioritize?” and provides an AI-assisted workshop for brainstorming and refining ideas.

**Current app areas:**

* **Dashboard** — Surfacing cards (investigate / watch / opportunity), recent conversations, project context
* **Signals** — Pattern records with filters (scenario, entity, date); investigate, watch, and opportunity views
* **Assistant — Discover** — Chat to identify and refine customer problems
* **Assistant — Workshop** — Hybrid canvas for ideas and problems
* **Auth** — Sign-in and sign-up

## Tech Stack

* App: Next.js (App Router) + TypeScript
* UI: Tailwind CSS; canvas in Workshop (hybrid canvas for problems/ideas)
* API: Next.js API routes (chat, explain, problem-chat, signals, waitlist)
* AI: OpenAI via AI SDK (chat, explain, problem discovery; no custom embeddings)
* Data/Realtime: Convex (single source of truth for data + realtime)
* Infrastructure: Next.js deployment + Convex backend

## How to Run

Step-by-step instructions to run the project locally, including everything that needs to be set up.

```bash
# Clone the repo
git clone https://github.com/safer-spaces/seepass.git
cd seepass

# Install dependencies
pnpm install

# Set up environment variables (Convex + OpenAI)
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local: set NEXT_PUBLIC_CONVEX_URL, CONVEX_DEPLOY_KEY, OPENAI_API_KEY

# Run Convex backend (separate terminal)
cd apps/web && pnpm dev:convex

# Seed pattern records (optional; run from apps/web)
cd apps/web && pnpm db:seed

# Run the development server (from repo root)
pnpm dev
```

Optional: generate pattern records from `packages/data-gen` then import into Convex: run `pnpm gen:patterns` from `packages/data-gen`, then in `apps/web`: `pnpm db:seed:replace`.

### Data & Convex

- **Seed (Convex)**: `cd apps/web && pnpm db:seed` (runs `patternRecords:seedIfEmpty`)
- **Replace seed data**: `cd apps/web && pnpm db:seed:replace` (imports from `convex/seed-data.json`)
- **Convex dashboard**: Use your Convex project URL for data and function logs

## Details

Add anything else you want to share: architecture diagrams, screenshots, challenges faced, future plans, etc.
