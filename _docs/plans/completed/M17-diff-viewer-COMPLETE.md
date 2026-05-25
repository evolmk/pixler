# M17 — Diff viewer (Monaco)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All sprints complete — HunkList staging, diff settings in AppearancePanel, ⌘+Shift+D shortcut.

---

## Goal

Implement SPEC §8.7: a Monaco-based diff viewer in the center pane's Diff tab that updates live
as the agent writes files, supports side-by-side and unified views, full-file and inline modes,
per-file filter, hunk staging.

## Depends on

- M06 (Diff tab placeholder in the center pane)
- M08 (workspace cwd to diff against)

## Acceptance

- Diff tab shows all uncommitted file changes accurately for a workspace mid-execution.
- Selecting a file renders Monaco with the correct diff.
- Toggling side-by-side / unified works.
- Staging a hunk and committing via the M16 `/commit` slash command leaves only the unstaged
  hunks visible.
- Editing a file in an external IDE causes the diff to update within ~1s without a manual refresh.
- `pnpm -w typecheck` clean.

## Out of scope

- Three-way merge conflict resolution UI — out of v1.
- Image diff — show "Binary file" placeholder.

## Files (expected surface)

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

---

## Sprint 1 — DiffModule + watcher + endpoints

**Status:** [x] complete
**Goal:** Server can compute diff via git, serve file blob pairs, and emit live update events on
filesystem changes.

**Tasks:**

- [x] `DiffModule` + `DiffService` + `DiffController`.
- [x] `GET /api/workspaces/:id/diff` — list of `{ path, status, additions, deletions, hunks }`.
- [x] `GET /api/workspaces/:id/diff/file?path=&against=workdir|index|head` — blob pair for Monaco.
- [x] `watcher.service.ts` using chokidar — emits `diff.changed` events.
- [x] `packages/shared-types/src/diff.ts` DTOs.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test diff` + manual: edit a file, see `diff.changed` event within 1s.

---

## Sprint 2 — Web DiffTab + Monaco DiffEditor

**Status:** [x] complete
**Goal:** Diff tab renders file tree + Monaco DiffEditor for the selected file; updates live.

**Tasks:**

- [x] Add `@monaco-editor/react` to `apps/web/package.json`.
- [x] `DiffTab.tsx` layout — workspace selector + file tree + editor.
- [x] `DiffFileTree.tsx` — file tree with status badges + per-file +/-.
- [x] `DiffEditor.tsx` — Monaco DiffEditor, language detection by extension, side-by-side / unified toggle.
- [x] `hooks/useDiff.ts` — socket-driven invalidation on `diff.changed` events.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: change a file externally, diff updates within 1s.

---

## Sprint 3 — HunkList + staging + theme + shortcuts

**Status:** [x] complete
**Goal:** Users can stage/unstage hunks; diff settings live in Appearance; `⌘+Shift+D` toggles
full-bleed diff.

**Tasks:**

- [x] `HunkList.tsx` bottom strip with checkboxes; "Stage selected" / "Unstage selected" wire
  to `POST /api/workspaces/:id/diff/stage` and `/unstage`.
- [x] Extend `SettingsDrawer/AppearancePanel.tsx` with diff word-wrap and render-whitespace
  options.
- [x] Monaco theme follows `pixler.theme` (vs-dark / vs baseline tinted with CSS vars).
- [x] `⌘+Shift+D` toggles full-bleed via M06 mechanism.

**Files Created/Modified:**

- `apps/web/src/components/HunkList.tsx` — created
- `apps/web/src/components/DiffTab.tsx` — added ⌘+Shift+D shortcut + useLayoutStore
- `apps/web/src/components/SettingsDrawer/AppearancePanel.tsx` — added DiffSettings section
- `apps/api/src/settings/registry.ts` — added diff.wordWrap, diff.renderWhitespace keys

**Issues Encountered:**

- Missing `useLayoutStore` import in DiffTab.tsx was caught by typecheck; added.

**Verify:** `pnpm -w typecheck` + manual: stage a hunk, `/commit` via M16, verify only unstaged remain.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
