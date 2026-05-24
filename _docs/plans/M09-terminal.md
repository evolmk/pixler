# M09 — Terminal mode (node-pty + xterm.js + multiplex)

## Goal

Implement the Terminal mode UI from SPEC §4.5 + §8.6: spawn a real PTY in the workspace's worktree using the user's default shell (and the user's version manager — mise/asdf/nvm/rbenv — gets picked up automatically), stream stdout/stdin over Socket.io to xterm.js in the right pane, support Big Terminal full-bleed, multiplex across workspaces.

## Depends on

- M06 (right pane + Big Terminal toggle)
- M08 (workspaces + worktree path to use as PTY cwd)

## Deliverables

- [ ] api: `apps/api/src/terminals/`:
  - `TerminalsModule`, `TerminalsService`
  - `POST /api/workspaces/:id/terminal` — create a PTY in the workspace's cwd; returns `{ terminalId }`. Args: `cols`, `rows`, optional `cmd` (defaults to user's shell)
  - `DELETE /api/terminals/:terminalId` — kill PTY
  - `POST /api/terminals/:terminalId/resize` — body `{ cols, rows }`
  - Socket.io events on namespace `/terminals`:
    - Server → client: `terminal.data` `{ terminalId, data }`, `terminal.exit` `{ terminalId, exitCode }`
    - Client → server: `terminal.input` `{ terminalId, data }`
  - PTY shell selection: respect `$SHELL`, then user setting `terminal.shell`
  - **Spawn via login shell** (`-l` flag for bash/zsh) so mise/asdf/nvm hooks load and the right tool versions are picked up
- [ ] One PTY per workspace, persisted across right-pane navigations (kept alive by the api until workspace is closed/archived)
- [ ] Multiple terminals per workspace supported (dropdown in the right pane header to switch — only show if > 1)
- [ ] Web client:
  - `apps/web/src/components/TerminalPane.tsx` — mounts xterm.js, subscribes to the workspace's terminal events
  - Theme: pull terminal palette from the active `@pixler/ui-styles` theme (CSS vars consumed via xterm theme object); re-apply on theme change
  - Font + size + cursor style from `terminal.*` settings keys (defined in M05 registry, extended here with `font`, `fontSize`, `cursorStyle`, `scrollback`, `copyOnSelect`, `pasteWarning`)
  - Resize observer keeps the PTY in sync with the visible cols/rows
  - **Big Terminal mode** (full-bleed) is just the M06 toggle — TerminalPane already renders fluidly
- [ ] **Shadow mode / Interrupt** (SPEC §8.6): "Interrupt" button in the right-pane header. When pressed while an agent owns the PTY (later milestones run agents through the same PTY), it sends `SIGINT` and surfaces a banner "You're in control." For M09 the agent isn't running yet, so this just sends `SIGINT` to whatever's in the PTY.
- [ ] **Multiplexed switching**: when the user clicks a different workspace, the right pane switches PTY views without killing the old one (it stays alive on the server)
- [ ] **Settings → Terminal panel** filled in (font, font size, cursor style, scrollback, copy-on-select, paste-warning, shell override)

## Acceptance

- Selecting a workspace + Terminal mode shows a working bash/zsh prompt in the worktree's cwd within ~200ms.
- Typing `node -v` (or any tool managed by mise/asdf/nvm) returns the workspace's expected version, not the system default.
- Resizing the right pane resizes the PTY (verified via `stty size` matching xterm cols/rows).
- Switching workspaces preserves the previous workspace's shell state on return.
- Changing the theme retints the terminal palette.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Running `claude` automatically inside the PTY — M13 orchestrator does that; for M09 the user can just type `claude` themselves and verify it works.
- Pixler status bar above the terminal (SPEC §8.6 mentions v2).
- Custom slash-command overlays — chat-only, M16.
