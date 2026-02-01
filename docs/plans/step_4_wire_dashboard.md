# Step 4: Wire Dashboard

## Deliverable
No new component. Wire existing components to dashboard page.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│ Dashboard                              [Ask AI] btn │
├─────────────────────────────────────────────────────┤
│ WHAT'S SURFACING                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │                │
│ └─────────┘ └─────────┘ └─────────┘                │
├─────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐        │
│ │ Recent Chats      │ │ Where Things Stand│        │
│ │ - Chat 1          │ │ - Sprint Progress │        │
│ │ - Chat 2          │ │ - Next Release    │        │
│ │ - Chat 3          │ │ - Key Milestones  │        │
│ └───────────────────┘ └───────────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## Components Used

| Component | Source |
|-----------|--------|
| SurfacingCard | `@/shared/components/dashboard` |
| SurfacingEmptyState | `@/shared/components/dashboard` |
| RecentChatsList | `@/shared/components/dashboard` |
| ProjectStatusCard | `@/shared/components/dashboard` |
| Button | `@/shared/components/ui/button` |

---

## Data

- **What's Surfacing:** Mock data (to be replaced with API)
- **Recent Chats:** Convex `api.problems.listRecent`
- **Where Things Stand:** Static defaults

---

## Primary Action

- Button: "Ask AI" with Sparkles icon
- Location: Top-right header
- Action: Navigate to `/assistant`

---

## Commit

`feat(dashboard): wire new components to dashboard page`
