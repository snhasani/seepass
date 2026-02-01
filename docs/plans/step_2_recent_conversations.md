# Step 2: Recent Chats Component

## Deliverable
One reusable component: `RecentChatsList` in `apps/web/shared/components/dashboard/recent-chats-list.tsx`

Plus: New Convex query for recent problems with thread activity.

Commit after implementation.

---

## Final Copies

| Element | Copy |
|---------|------|
| Section title | "Recent Chats" |
| Empty state | "Start a chat to see it here" |
| Draft fallback title | "Draft problem" |

---

## Data Source

**Existing:**
- `problems`: userId, title, description, status, createdAt, updatedAt
- `threads`: problemId, messages, createdAt, updatedAt

**New Convex query needed:** `problems.listRecent`
- Get recent problems for user (limit 5-10)
- Order by updatedAt desc
- Include thread existence/activity info if possible

```ts
// convex/problems.ts - add this query
export const listRecent = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const problems = await ctx.db
      .query("problems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 5);
    return problems;
  },
});
```

---

## Component Props

```ts
interface ChatItem {
  id: string;
  title: string;           // problem.title || "Draft problem"
  updatedAt: number;
  status: "draft" | "confirmed" | "resolved";
}

interface RecentChatsListProps {
  chats: ChatItem[];
  onSelect?: (id: string) => void;
  className?: string;
}
```

---

## Component Structure

```
RecentChatsList
├── Section header "Recent Chats"
├── List of items (or empty state)
│   └── ChatItem (for each)
│       ├── Status indicator (dot: draft=yellow, confirmed=green, resolved=slate)
│       ├── Title
│       └── Relative time (e.g. "2 days ago")
└── Empty state if no chats
```

**Base:** Simple list with clickable rows, no Card wrapper needed (list style per mockup)

---

## File Changes

```
apps/web/shared/components/dashboard/
├── surfacing-card.tsx      ← existing
├── recent-chats-list.tsx   ← new
└── index.ts                ← update exports

apps/web/convex/
└── problems.ts             ← add listRecent query
```

---

## Implementation Checklist

- [ ] Add `listRecent` query to `convex/problems.ts`
- [ ] Create `recent-chats-list.tsx` with props interface
- [ ] Add status dot indicator (draft/confirmed/resolved)
- [ ] Add relative time display (use date-fns or simple helper)
- [ ] Add empty state
- [ ] Export from `index.ts`
- [ ] Commit: `feat(dashboard): add RecentChatsList component`

---

## References

- Convex schema: `apps/web/convex/schema.ts`
- Existing problems query: `apps/web/convex/problems.ts`
- Research (copy tone): `docs/research-raw.txt` § "Past Conversations/Requests"
