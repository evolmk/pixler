# M17 — Diff viewer (Monaco)

## Goal

Implement SPEC §8.7: a Monaco-based diff viewer in the center pane's Diff tab that updates live as the agent writes files, supports side-by-side and unified views, full-file and inline modes, per-file filter, hunk staging.

## Depends on

- M06 (Diff tab placeholder in the center pane)
- M08 (workspace cwd to diff against)

## Deliverables

- [ ] api `DiffModule`:
  - `GET /api/workspaces/:id/diff` — returns `{ files: [{ path, status, additions, deletions, hunks: [{ header, lines }] }] }` via `git diff` (uncommitted changes vs base branch's merge-base, switchable to `HEAD` etc.)
  - `GET /api/workspaces/:id/diff/file?path=&against=workdir|index|head` — single-file blob pair for Monaco
  - `POST /api/workspaces/:id/diff/stage` body `{ path, hunks: number[] }` — `git add -p` style staging
  - `POST /api/workspaces/:id/diff/unstage` — opposite
  - **Live updates**: a file watcher (chokidar) on the worktree emits `diff.changed` events when files change so the UI doesn't have to poll
- [ ] **Diff tab UI**:
  - Left rail: file tree with status badges (added/modified/deleted), per-file additions/deletions
  - Right area: Monaco `DiffEditor` for the selected file
  - Toolbar: side-by-side / unified toggle, "Show whitespace", per-file search input
  - Bottom strip: hunk list with checkboxes for staging; "Stage selected" / "Unstage selected" actions
  - Pinch-to-zoom support placeholder (real gesture wires in M24)
  - Language detection for syntax highlighting (Monaco's built-in mapping by file extension)
  - Updates live as the agent writes files — Monaco diff re-mounts efficiently using the same model
- [ ] **Settings → Appearance** add diff-specific options: word-wrap, render-whitespace, theme syncs with `pixler.theme` (use Monaco's `vs-dark`/`vs` baseline tinted with our CSS vars where possible; otherwise pick the closer of the two per mode)
- [ ] **Keyboard shortcut**: `⌘+Shift+D` toggles full-bleed diff view (uses M06's full-bleed mechanism for the center pane)

## Acceptance

- Diff tab shows all uncommitted file changes accurately for a workspace mid-execution.
- Selecting a file renders Monaco with the correct diff.
- Toggling side-by-side / unified works.
- Staging a hunk and committing via the M16 `/commit` slash command leaves only the unstaged hunks visible.
- Editing a file in an external IDE causes the diff to update within ~1s without a manual refresh.
- `pnpm -w typecheck` clean.

## Files

```
apps/api/src/diff/diff.module.ts
apps/api/src/diff/diff.service.ts
apps/api/src/diff/diff.controller.ts
apps/api/src/diff/watcher.service.ts
packages/shared-types/src/diff.ts
apps/web/src/components/DiffTab.tsx
apps/web/src/components/DiffFileTree.tsx
apps/web/src/components/DiffEditor.tsx
apps/web/src/components/HunkList.tsx
apps/web/src/hooks/useDiff.ts
apps/web/package.json   (add monaco-editor, @monaco-editor/react, chokidar on api side)
```

## Out of scope

- Three-way merge conflict resolution UI — out of v1.
- Image diff — show "Binary file" placeholder.
