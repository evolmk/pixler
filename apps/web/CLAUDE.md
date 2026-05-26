# apps/web — CLAUDE.md

React 19 + Vite + TanStack Router frontend. Auto-loaded under `apps/web/`.

## Layout

```
src/
├── App.tsx · main.tsx · router.tsx
├── routes/        # TanStack Router route files
├── components/    # feature components (one .tsx per concern)
├── hooks/         # one hook per server resource or browser concern
├── stores/        # Zustand stores (UI-only state)
├── lib/           # framework-free utilities
└── styles/
```

UI primitives (Button, Input, Dialog, …) live in `@pixler/ui` —
**import from `@pixler/ui/components/<name>`**, never re-implement.

## State

- **Server state** → TanStack Query, wrapped in a `use<Resource>` hook
  (`useProjects`, `useWorkspace`, `usePlan` …). Components never call `fetch`
  directly except for one-shot side effects (e.g. `FolderPicker`).
- **UI state** → Zustand (`stores/layout.ts`, `stores/palette.ts`,
  `stores/theme.ts`). Don't put server data in Zustand.
- **URL/route state** → TanStack Router params/search.

## API calls

Backend is same-origin via Vite proxy at `/api/*`. Use relative URLs (`fetch('/api/foo')`).
Errors: read `res.json()` for the message; the global Nest filter returns
`{ statusCode, message, ... }`.

## Socket.io

`useAppEvents()` for global events, `useWorkspaceEvents(workspaceId)` for
scoped ones. Both invalidate the relevant Query cache — no need to do that by
hand.

## Don't

- Don't inline `<svg>` — use Lucide icons.
- Don't hardcode colors — always semantic tokens (`bg-primary`,
  `text-muted-foreground`). See `packages/ui/CLAUDE.md`.
- Don't fetch in `useEffect` if a Query hook exists or could exist.
- Don't `window.location` for nav — use TanStack Router's `<Link>` /
  `useNavigate()`.
