# Dashboard Implementation Plan (Initial Summary)

This document summarizes the information gathered for implementing the dashboard per the provided mock-up and research. It is a high-level plan only: no implementation details here—just what we need to do, in what order, and where to look for copy/structure guidance. Detailed technical plans can reference this file and the sources below.

---

## 1. Sources and References

| Source | Location | Use for |
|--------|----------|--------|
| **Mock-up** | Wireframe: Critical Insights (top row, 3 cards), Recent Conversations (left list), Project Snapshot (right, static) | Layout, section boundaries, component roles |
| **Research – dashboard & copy** | `docs/research-raw.txt` § “Dashboard & UI Design Considerations for the MVP” (from ~line 38) | Section titles, copy suggestions, primary action (“Ask AI” / “New Conversation”), trust/transparency cues |
| **Research – use case focus** | `docs/research-raw.txt` § “Choosing the Focus for MVP and Pitch”, “Recommendation” | JAS / data-driven insights as primary; insights list = “Here’s what needs your attention” |
| **Pattern records schema & sample data** | `packages/data-gen/out/pattern_records_seed.json` | Shape of Critical Insights: `scenario`, `entityType`, `entityKey`, `window`, `score`, `record.signals`, `record.hypotheses_hints`, etc. |
| **Current dashboard** | `apps/web/app/(protected)/dashboard/page.tsx` | Existing layout, design-system usage (SummaryPanel, AIInsight, ProblemCard); what to keep vs change |
| **Current design-system** | `packages/design-system` (e.g. `ai-insight.tsx`, `problem-card.tsx`, `confidence-indicator`) | Confidence bar and color usage; avoid duplication of confidence UI |
| **Conversations / threads** | `apps/web/convex/threads.ts`, `apps/web/convex/schema.ts`, `apps/web/features/problems/components/problems-list.tsx` | How threads are stored (by problemId, messages); how to expose “Recent Conversations” for the dashboard |
| **Pattern records API** | `apps/web/app/api/pattern-records/route.ts` | Existing GET with `entityKey`; may need list/top-insights for dashboard |

---

## 2. What We Want to Achieve

- **Focus:** JAS (data-driven insights) as the primary dashboard value: “Here’s what needs your attention.”
- **Layout (per mock-up):**
  - **Top:** One row – **Critical Insights** (e.g. 3 cards: issue / alert / opportunity).
  - **Bottom:** Two columns – **Recent Conversations** (left), **Project Snapshot** (right).
- **Data:**
  - Critical Insights: driven by the **new** pattern-records schema and generation (see seed JSON), not the current mock priorities/problems.
  - Recent Conversations: loaded via **API** from existing databases (Convex threads + problems).
  - Project Snapshot: **static**, hard-coded copy only (no backend).
- **UX fixes (from current implementation):**
  - Improve or simplify **color usage** (research suggests light background, clean lines; avoid heavy or inconsistent colorings).
  - Remove or consolidate **AI confidence** so the big progress bar and repeated confidence indicators don’t duplicate each other (single, clear place if we show confidence at all).

**Keep from current implementation:** Badges, accordions/collapsible sections, and the general idea of compact summary + expandable detail.

---

## 3. Plan Steps (One Step per Mock-up Section)

**General rule:** Each step delivers **one reusable component**. Implement that component, commit it, then move on. Step 4 does **not** add a new component—it only wires the three section components to the current dashboard page and commits that change.

**Base card:** The codebase already has a base card at `apps/web/shared/components/ui/card.tsx` (Card, CardHeader, CardTitle, CardContent, CardFooter). Before implementing each section component, use this as the base (or search the codebase for any other card primitive). If a section needs a different layout, build the section-specific component on top of this Card so users can reuse it later. Do not add a separate “base card” step unless the existing Card is insufficient for all three sections.

---

### Step 1: Critical Insights (top row)

- **Deliverable:** One reusable component for **Critical Insights** (e.g. `CriticalInsightCard` or `InsightCard`) — one card per insight; the dashboard will render a row of N of these. Users can reuse this component elsewhere (e.g. other pages, embeds). **Implement it, then commit.**
- **Goal:** One row of insight cards (e.g. issue, alert, opportunity) based on the **pattern_records** schema and seed data shape (scenario, entity, window, score, signals, hypotheses_hints, etc.).
- **What to do:**
  - Define **final copy** for section title (“Critical Insights”), card types (e.g. “Issue”, “Alert”, “Opportunity”), and any subtitle or empty state. Use research (§ “Insights/Alerts List”) for tone: short snippets, icon or tag per type, one-line description.
  - Define **data shape** for the dashboard: what the app receives from API (e.g. list of pattern records or derived “insights”) and how it maps to 1–3 cards (e.g. by scenario/entity/window or by score).
  - **Component:** Build one reusable card component (e.g. `CriticalInsightCard`) that shows a single insight: minimal summary, optional badge/icon by type, no big confidence bar. Use existing `shared/components/ui/card.tsx` as base if appropriate. Reuse badges/accordions from design-system where it makes sense; avoid duplicating confidence UI.
  - **Suggestions:** Reuse badges and collapsible behavior. Prefer a single, subtle confidence indicator (or none) for the row; avoid a large progress bar plus multiple confidence labels. Align visuals with research: “light background, clean lines,” icons/short labels (e.g. issue, alert, idea). Reference `pattern_records_seed.json` for field names and example values when writing the data spec.

---

### Step 2: Recent Conversations (bottom left)

- **Deliverable:** One reusable component for **Recent Conversations** (e.g. `RecentConversationsList` and a single item sub-component like `RecentConversationItem`, or one `RecentConversationCard` per item) — the component that shows the list of recent conversations so users can reopen them. Users can reuse it elsewhere. **Implement it, then commit.**
- **Goal:** A list of recent AI conversations the user can reopen (like “Query 1”, “Query 2” in the mock-up), backed by **real data** from the database via an API.
- **What to do:**
  - Define **final copy** for section title (“Recent Conversations”), list item format (e.g. “Q: …” or short title + date), and empty state. Use research (§ “Past Conversations/Requests”) for examples: “Q: What were top user complaints last month? – answered 2 days ago.”
  - Define **data source and API**: threads (and optionally problems) in Convex; what the dashboard needs (e.g. last K threads or last K problems with thread activity, with title/preview and date). Specify whether we add a Convex query or a Next API that wraps it.
  - **Component:** Build one reusable component (e.g. `RecentConversationsList` that accepts a list of conversations and renders each as a clickable row/card; or a `RecentConversationCard` used N times). Use existing Card or list patterns; click opens the conversation (e.g. navigate to assistant/problem thread). Optional: small icon or bullet per item, separator between items.
  - **Suggestions:** Reuse list/card patterns from the app; keep each row minimal (title or first line + date). Reference `convex/threads.ts` and `convex/schema.ts` for `threads` (problemId, messages, createdAt, updatedAt) and `problems` for ownership; reference `features/problems/components/problems-list.tsx` for how problems are currently listed.

---

### Step 3: Project Snapshot (bottom right)

- **Deliverable:** One reusable component for **Project Snapshot** (e.g. `ProjectSnapshotCard` or `ProjectSnapshot`) — the panel that shows static project overview copy (sprint progress, next release, key milestones). Users can reuse it elsewhere (e.g. sidebar, other dashboards). **Implement it, then commit.**
- **Goal:** A **static** panel with hard-coded project overview copy (sprint progress, next release, key milestones)—no backend, no API.
- **What to do:**
  - Define **final copy** for section title (“Project Snapshot”) and for each line item, e.g. “Sprint Progress: XX/XX Tasks”, “Next Release: Version X.X”, “Key Milestones”. Use research (§ “Project Overview Widgets”) for tone: “Current Sprint: Week 3 of 2Q2026 – 10/12 tasks completed”, “Upcoming Release: v2.1 on Dec 1”.
  - **Component:** Build one reusable card/panel component that renders the title and the list of 3–5 static items (optional small icon or bullet per row). No data fetching; copy is hard-coded or passed as props. Use existing `shared/components/ui/card.tsx` as base if appropriate.
  - **Suggestions:** Placeholder numbers (e.g. 10/12, v1.0) are fine. Reference research for “visually separated” and “few key project stats” so it doesn’t overpower the rest of the dashboard.

---

### Step 4: Wire components to dashboard page (no new component)

- **Deliverable:** No new component. **Wire** the three section components (Critical Insights, Recent Conversations, Project Snapshot) to the current dashboard page (`apps/web/app/(protected)/dashboard/page.tsx`), add the primary “Ask AI” / “New Conversation” entry point, and commit.
- **Goal:** Compose the three sections into the mock-up layout and add the primary action so the dashboard is usable.
- **What to do:**
  - Define **final copy** for the primary action button (research: “Ask AI”, “New Conversation”, “Ask the Assistant”, or “New Insight Query”) and any tooltip or short hint.
  - **Layout:** Top = full-width row using the Critical Insights component (N cards). Bottom = two columns: left = Recent Conversations component, right = Project Snapshot component. Responsive behavior (stack on small screens or keep columns) to be decided in detailed design.
  - Import and render the three components on the dashboard page; place primary action prominently (e.g. top-right or above the row). Reference research § “Primary Action” and “Dashboard vs Detailed Views” for placement and behavior (e.g. open chat/assistant on click).
  - **Commit** after wiring is done.

---

## 4. Out of Scope for This Plan

- Detailed API request/response shapes, Convex function names, or Prisma/Next route implementations.
- Exact CSS or Tailwind classes.
- Auth or permission checks (assume existing protected route).
- Changes to the landing page (`apps/web/app/page.tsx`) except insofar as we might align terminology or visuals later.

---

## 5. Next Steps for Detailed Plans

- **Workflow:** For Steps 1–3, implement the one component for that step, then commit. For Step 4, wire the three components to the dashboard page, then commit. No new component in Step 4.
- For **Step 1:** Implement the Critical Insights card component (reusable). See `packages/data-gen/out/pattern_records_seed.json` and `apps/web/app/api/pattern-records/route.ts`; use existing `apps/web/shared/components/ui/card.tsx` as base if needed.
- For **Step 2:** Implement the Recent Conversations component (reusable). See `apps/web/convex/threads.ts`, `schema.ts`, and `api.problems.list`; define a recent-threads query/API and the payload for the list.
- For **Step 3:** Implement the Project Snapshot component (reusable); copy only, no backend. Use existing Card as base if needed.
- For **Step 4:** Wire the three components into `apps/web/app/(protected)/dashboard/page.tsx`, add the primary action, then commit. No new component.

This file is the single place to point to for “what we gathered and what we need to implement” before breaking each step into implementation tasks.
