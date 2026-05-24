# M09 — Terminal mode (node-pty + xterm.js + multiplex)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M06 + M08.

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

**Status:** ⏳ pending
**Goal:** Server can spawn/kill/resize PTYs and stream I/O over Socket.io. One PTY per workspace,
persisted across navigations.

**Tasks:**

- [ ] `TerminalsModule` + `TerminalsService` + `TerminalsController` + `TerminalsGateway`.
- [ ] `POST /api/workspaces/:id/terminal` (returns `{ terminalId }`), `DELETE /api/terminals/:id`,
  `POST /api/terminals/:id/resize`.
- [ ] Socket.io `/terminals` namespace: `terminal.data` / `terminal.exit` server→client,
  `terminal.input` client→server.
- [ ] PTY shell selection: respect `$SHELL`, then `terminal.shell` setting; spawn as login shell
  (`-l`) so mise/asdf/nvm hooks load.
- [ ] Keep PTY alive across right-pane navigations (closed only on workspace archive/delete).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test terminals` — spawn + echo + kill round-trip; manual `node -v` in a worktree managed by mise.

---

## Sprint 2 — Web TerminalPane with xterm.js + theme sync

**Status:** ⏳ pending
**Goal:** Right pane in Terminal mode renders a live xterm session, themed from the active Pixler
palette, with PTY resize tracking the visible cols/rows.

**Tasks:**

- [ ] `TerminalPane.tsx` mounts xterm.js, subscribes to the workspace's terminal events.
- [ ] `lib/terminal-theme.ts` — pull palette from CSS vars; re-apply on theme change.
- [ ] Font + size + cursor style + scrollback + copy-on-select + paste-warning settings read from
  `terminal.*` keys.
- [ ] ResizeObserver keeps PTY cols/rows in sync with the visible pane.
- [ ] `hooks/useTerminal.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: prompt visible in <200ms, theme switch retints palette, `stty size` matches xterm.

---

## Sprint 3 — Multiplex + Interrupt + Settings panel

**Status:** ⏳ pending
**Goal:** Multiple terminals per workspace; switching workspaces preserves prior shell state;
Settings → Terminal panel fully functional; Interrupt button sends SIGINT.

**Tasks:**

- [ ] `TerminalSwitcher.tsx` dropdown in right-pane header — only visible when > 1 terminal per
  workspace.
- [ ] Workspace switch shows the right workspace's PTY without killing prior ones.
- [ ] Interrupt button in right-pane header sends `SIGINT` to active PTY; surfaces "You're in
  control." banner.
- [ ] `SettingsDrawer/TerminalPanel.tsx` — font, font size, cursor style, scrollback,
  copy-on-select, paste-warning, shell override.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: open 2 workspaces, switch back-and-forth, scrollback intact.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
