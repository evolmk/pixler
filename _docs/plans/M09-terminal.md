# M09 — Terminal mode (node-pty + xterm.js + multiplex)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete — PTY backend, xterm.js UI, multiplex, interrupt, settings panel.

---

## Goal

Implement the Terminal mode UI from SPEC §4.5 + §8.6: spawn a real PTY in the workspace's
worktree using the user's default shell (and the user's version manager — mise/asdf/nvm/rbenv —
gets picked up automatically), stream stdout/stdin over Socket.io to xterm.js in the right pane,
support Big Terminal full-bleed, multiplex across workspaces.

## Depends on

- M06 (right pane + Big Terminal toggle)
- M08 (workspaces + worktree path to use as PTY cwd)

## Acceptance

- Selecting a workspace + Terminal mode shows a working bash/zsh prompt in the worktree's cwd
  within ~200ms.
- Typing `node -v` (or any tool managed by mise/asdf/nvm) returns the workspace's expected
  version, not the system default.
- Resizing the right pane resizes the PTY (verified via `stty size` matching xterm cols/rows).
- Switching workspaces preserves the previous workspace's shell state on return.
- Changing the theme retints the terminal palette.
- `pnpm -w typecheck` clean.

## Out of scope

- Running `claude` automatically inside the PTY — M13 orchestrator does that; for M09 the user
  can just type `claude` themselves and verify it works.
- Pixler status bar above the terminal (SPEC §8.6 mentions v2).
- Custom slash-command overlays — chat-only, M16.

## Files (expected surface)

```
apps/api/src/terminals/terminals.module.ts
apps/api/src/terminals/terminals.service.ts
apps/api/src/terminals/terminals.controller.ts
apps/api/src/terminals/terminals.gateway.ts
packages/shared-types/src/terminals.ts
apps/web/src/components/TerminalPane.tsx
apps/web/src/components/TerminalSwitcher.tsx
apps/web/src/lib/terminal-theme.ts
apps/web/src/hooks/useTerminal.ts
apps/web/src/components/SettingsDrawer/TerminalPanel.tsx
```

---

## Sprint 1 — api: TerminalsModule + PTY infra + Socket.io gateway

**Status:** ✅ complete
**Goal:** Server can spawn/kill/resize PTYs and stream I/O over Socket.io. One PTY per workspace,
persisted across navigations.

**Tasks:**

- [x] `TerminalsModule` + `TerminalsService` + `TerminalsController` + `TerminalsGateway`.
- [x] `POST /api/workspaces/:id/terminal` (returns `{ terminalId }`), `DELETE /api/terminals/:id`,
  `POST /api/terminals/:id/resize`.
- [x] Socket.io `/terminals` namespace: `terminal.data` / `terminal.exit` server→client,
  `terminal.input` client→server.
- [x] PTY shell selection: respect `$SHELL`, then `terminal.shell` setting; spawn as login shell
  (`-l`) so mise/asdf/nvm hooks load.
- [x] Keep PTY alive across right-pane navigations (closed only on workspace archive/delete).

**Files Created/Modified:**

- `apps/api/src/terminals/terminals.module.ts`
- `apps/api/src/terminals/terminals.service.ts`
- `apps/api/src/terminals/terminals.controller.ts`
- `apps/api/src/terminals/terminals.gateway.ts`
- `packages/shared-types/src/terminals.ts`
- `apps/api/src/app.module.ts` (added TerminalsModule)
- `packages/shared-types/src/index.ts` (export terminals types)

**Issues Encountered:**

- `@types/node-pty` not on npm; types are bundled in node-pty package itself (declare module pattern).

**Verify:** `pnpm --filter @pixler/api typecheck` — clean.

---

## Sprint 2 — Web TerminalPane with xterm.js + theme sync

**Status:** ✅ complete
**Goal:** Right pane in Terminal mode renders a live xterm session, themed from the active Pixler
palette, with PTY resize tracking the visible cols/rows.

**Tasks:**

- [x] `TerminalPane.tsx` mounts xterm.js, subscribes to the workspace's terminal events.
- [x] `lib/terminal-theme.ts` — pull palette from CSS vars; re-apply on theme change.
- [x] Font + size + cursor style + scrollback + copy-on-select + paste-warning settings read from
  `terminal.*` keys.
- [x] ResizeObserver keeps PTY cols/rows in sync with the visible pane.
- [x] `hooks/useTerminal.ts`.

**Files Created/Modified:**

- `apps/web/src/lib/terminal-theme.ts`
- `apps/web/src/hooks/useTerminal.ts`
- `apps/web/src/components/TerminalPane.tsx`
- `apps/web/src/components/RightPane.tsx` (wire TerminalPane, get workspaceId from route params)
- `apps/web/package.json` (added @xterm/xterm, @xterm/addon-fit, @xterm/addon-web-links)

**Issues Encountered:**

- none

**Verify:** `pnpm --filter @pixler/web typecheck` — clean.

---

## Sprint 3 — Multiplex + Interrupt + Settings panel

**Status:** ✅ complete
**Goal:** Multiple terminals per workspace; switching workspaces preserves prior shell state;
Settings → Terminal panel fully functional; Interrupt button sends SIGINT.

**Tasks:**

- [x] `TerminalSwitcher.tsx` dropdown in right-pane header — only visible when > 1 terminal per
  workspace.
- [x] Workspace switch shows the right workspace's PTY without killing prior ones.
- [x] Interrupt button in right-pane header sends `SIGINT` to active PTY; surfaces "You're in
  control." banner.
- [x] `SettingsDrawer/TerminalPanel.tsx` — font, font size, cursor style, scrollback,
  copy-on-select, paste-warning, shell override.

**Files Created/Modified:**

- `apps/web/src/components/TerminalSwitcher.tsx`
- `apps/web/src/components/RightPane.tsx` (switcher + interrupt + "You're in control." banner)
- `apps/web/src/components/TerminalPane.tsx` (onInterruptRef, onTerminalReady, explicit terminalId)
- `apps/web/src/hooks/useTerminal.ts` (interrupt, useTerminalList, forceNew, explicit terminalId)
- `apps/web/src/components/SettingsDrawer/TerminalPanel.tsx`
- `apps/web/src/components/SettingsDrawer.tsx` (wire TerminalPanel)
- `apps/api/src/terminals/terminals.controller.ts` (interrupt endpoint, list terminals)
- `apps/api/src/terminals/terminals.service.ts` (interrupt method)
- `apps/api/src/settings/registry.ts` (terminal settings)
- `packages/shared-types/src/settings.ts` (terminal settings)

**Issues Encountered:**

- none

**Verify:** `pnpm -w typecheck` — clean.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
