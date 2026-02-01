# Signal → Discover Deep-Dive Flow

## Implementation (DONE)

**Goal:** Each discovery session is a first-class entity in the database with signal context, pre-prompts, and message history.

### Database Schema

New `discovers` table:
- `userId` - owner
- `signalId` - optional link to patternRecords
- `title` - auto-generated from signal or "New Discovery"
- `signalContext` - { scenario, entityKey, summary, metrics }
- `prePrompts` - generated contextual questions
- `messages` - chat history
- `status` - active | completed | archived
- `createdAt`, `updatedAt`

### Routes

- `/assistant/discover` - generic discover (no signal)
- `/assistant/discover/{discoverId}` - specific discovery session

### Flow

1. User clicks "Discover" on signal in `/signals`
2. Creates new `discovers` record with signal context + pre-prompts
3. Redirects to `/assistant/discover/{discoverId}`
4. Page loads discover data, shows signal header, pre-prompts
5. Messages are persisted to discovers table

### Files Modified

- `convex/schema.ts` - added discovers table
- `convex/discovers.ts` - CRUD mutations/queries
- `app/(protected)/signals/page.tsx` - creates discover on click
- `app/(protected)/assistant/discover/page.tsx` - generic discover
- `app/(protected)/assistant/discover/[discoverId]/page.tsx` - signal discover
- `features/problems/components/problem-discovery-assistant.tsx` - accepts discoverId, persists to DB

### Pre-Prompts Generation (in discovers.create mutation)

Based on signal metrics:
- Error rate spike → "What's causing the X% error rate spike?"
- Dropoff rate → "Why are users dropping off X% more?"
- Affected accounts → "Which accounts should we prioritize?"
- Revenue at risk → "How to mitigate $Xk revenue at risk?"
- Release correlation → "Is release X correlated?"
- Hypotheses → "Can you validate: X?"

### UX Features

- Signal context header with back link to /signals
- Related discoveries sidebar (user's recent discoveries)
- Clickable pre-prompt chips that auto-send
- Messages persisted to DB (not localStorage) for signal discoveries
