# Seepass

AI-Native Product Management Tool

## Tech Stack

MVP Architecture Summary

* App: Next.js (App Router) + TypeScript
* UI: Tailwind CSS, Canvas option A: React Flow; option B: custom canvas
* API: Next.js API routes + server actions (no separate service)
* AI: External LLMs for core workflows (no custom embeddings)
* Data/Realtime: Convex (single source of truth for data + realtime)
* Integrations: Manual entry + CSV import only
* Repo-Native Mode: Deferred
* Infrastructure: Single Next.js deployment + Convex backend
* Observability: Structured logs + Sentry

## How to Run

Step-by-step instructions to run the project locally, including everything that needs to be set up.

```bash
# Clone the repo
git clone https://github.com/your-team/your-project.git
cd your-project

# Install dependencies
pnpm install

# Start PostgreSQL database (Docker required)
./scripts/db-start.sh
# Or: docker-compose up -d postgres

# Set up environment variables
cp .env.example apps/web/.env.local
# DATABASE_URL is already configured for docker-compose setup

# Generate pattern records
pnpm gen:patterns

# Run database migrations
cd apps/web && pnpm db:migrate

# Seed the database
pnpm db:seed

# Run the development server
pnpm dev
```

### Database Management

- **Start database**: `./scripts/db-start.sh` or `docker-compose up -d postgres`
- **Stop database**: `./scripts/db-stop.sh` or `docker-compose down`
- **View logs**: `./scripts/db-logs.sh` or `docker-compose logs -f postgres`
- **Database Studio**: `cd apps/web && pnpm db:studio` (opens Prisma Studio)

## Details

Add anything else you want to share: architecture diagrams, screenshots, challenges faced, future plans, etc.