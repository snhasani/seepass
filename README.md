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
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Run the development server
npm run dev
```

## Details

Add anything else you want to share: architecture diagrams, screenshots, challenges faced, future plans, etc.