# Step 3: Where Things Stand Component

## Deliverable
One reusable component: `ProjectStatusCard` in `apps/web/shared/components/dashboard/project-status-card.tsx`

Static content, no backend. Each item clickable → detail view.

Commit after implementation.

---

## Final Copies

| Element | Copy |
|---------|------|
| Title | "Where Things Stand" |
| Item 1 | "Sprint Progress: 8/12 tasks" |
| Item 2 | "Next Release: v1.2" |
| Item 3 | "Key Milestones" |

---

## Component Props

```ts
interface StatusItem {
  label: string;        // e.g. "Sprint Progress"
  value?: string;       // e.g. "8/12 tasks" (optional)
  href?: string;        // link destination
  onClick?: () => void; // or callback
}

interface ProjectStatusCardProps {
  title?: string;       // default: "Where Things Stand"
  items: StatusItem[];
  className?: string;
}
```

---

## Component Structure

```
ProjectStatusCard
├── Title "Where Things Stand"
└── List of items
    └── StatusItem (for each)
        ├── Bullet (square or dot)
        ├── Label
        ├── Value (if present)
        └── Clickable → href or onClick
```

**Base:** Use Card from `apps/web/shared/components/ui/card.tsx`

---

## Default Items (static/demo)

```ts
const defaultItems: StatusItem[] = [
  { label: "Sprint Progress", value: "8/12 tasks", href: "/sprints" },
  { label: "Next Release", value: "v1.2", href: "/releases" },
  { label: "Key Milestones", href: "/milestones" },
];
```

---

## File Changes

```
apps/web/shared/components/dashboard/
├── surfacing-card.tsx       ← existing
├── recent-chats-list.tsx    ← existing
├── project-status-card.tsx  ← new
└── index.ts                 ← update exports
```

---

## Implementation Checklist

- [ ] Create `project-status-card.tsx` with props interface
- [ ] Add title with default "Where Things Stand"
- [ ] Add list items with bullet, label, optional value
- [ ] Make items clickable (Link or button)
- [ ] Export from `index.ts`
- [ ] Commit: `feat(dashboard): add ProjectStatusCard component`

---

## References

- Mockup: Project Snapshot section
- Base card: `apps/web/shared/components/ui/card.tsx`
