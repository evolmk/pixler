# M11 — `@pixler/linear-cli` (agent-facing thin CLI)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M10.

---

## Goal

Build the agent-facing Pixler Linear CLI described in SPEC §6.7–§6.8 + §12.2: a thin,
low-token-overhead command surface that agents (claude/codex) call from bash. Defaults to running
through the Pixler local api so it reuses the user's PAT and respects the state-map.

## Depends on

- M10 (the api endpoints the CLI wraps)

## Acceptance

- Inside any workspace shell (with the api running), `pixler ticket fetch ENG-101` returns full
  JSON.
- `pixler ticket state ENG-101 in_progress` transitions the ticket via the state-map (verified in
  Linear).
- `pixler ticket comment ENG-101 "test"` adds the comment.
- `pixler attachment upload ENG-101 ./plan.md` uploads and prints the attachment id.
- `--help` output for each command is short and consistent.
- `pnpm -w typecheck` clean.

## Out of scope

- MCP server itself — agents can install the official Linear MCP if they pick that mode; Pixler
  doesn't ship its own MCP in v1.
- GitHub CLI counterpart — agents shell out directly to `gh`; no wrapper needed (M12 documents
  which `gh` commands are blessed).

## Files (expected surface)

```
packages/linear-cli/package.json
packages/linear-cli/tsup.config.ts
packages/linear-cli/src/cli.ts                  (commander/citty/yargs — pick one)
packages/linear-cli/src/commands/ticket-fetch.ts
packages/linear-cli/src/commands/ticket-comment.ts
packages/linear-cli/src/commands/ticket-state.ts
packages/linear-cli/src/commands/ticket-label.ts
packages/linear-cli/src/commands/subissue-create.ts
packages/linear-cli/src/commands/subissue-complete.ts
packages/linear-cli/src/commands/attachment-upload.ts
packages/linear-cli/src/commands/attachment-delete.ts
packages/linear-cli/src/api-client.ts
packages/linear-cli/README.md
apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx   (extend with Linear agent mode picker)
package.json                                     (add `pixler-linear` to `bin`, alias `pixler` sub-command)
```

---

## Sprint 1 — Package scaffold + transport + ticket commands

**Status:** ⏳ pending
**Goal:** `packages/linear-cli` package exists, builds with tsup, ticket commands work end-to-end
against the local api.

**Tasks:**

- [ ] `packages/linear-cli/package.json` + `tsup.config.ts`.
- [ ] `src/cli.ts` (commander or citty) wires up subcommands; each has `--help` ≤80 tokens.
- [ ] `src/api-client.ts` reads `$PIXLER_API_PORT`; errors helpfully if unset.
- [ ] `src/commands/ticket-fetch.ts`, `ticket-comment.ts`, `ticket-state.ts`, `ticket-label.ts`.
- [ ] Exit codes: `0` success, `1` validation, `2` network, `3` Linear-side error.
- [ ] JSON-by-default; `--text` flag for short human output.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/linear-cli build && PIXLER_API_PORT=7777 ./dist/cli.js ticket fetch ENG-101 --text`.

---

## Sprint 2 — Subissue + attachment commands + bin wiring

**Status:** ⏳ pending
**Goal:** All remaining commands implemented; CLI installable as `pixler-linear` and aliased as a
`pixler` subcommand.

**Tasks:**

- [ ] `src/commands/subissue-create.ts`, `subissue-complete.ts`.
- [ ] `src/commands/attachment-upload.ts`, `attachment-delete.ts`.
- [ ] Root `package.json` — add `pixler-linear` to `bin`; alias under `pixler` sub-command path.
- [ ] `packages/linear-cli/README.md` documenting every command.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm pack` the CLI; install in temp dir; run each command against a dev api.

---

## Sprint 3 — IntegrationsPanel agent-mode picker

**Status:** ⏳ pending
**Goal:** Project Settings → Integrations exposes the Linear agent mode picker (CLI default / MCP
/ Both) per SPEC §6.7.

**Tasks:**

- [ ] Extend `ProjectSettingsDrawer/IntegrationsPanel.tsx` with the picker.
- [ ] Persist to `settings.linear.agentMode` (project scope).
- [ ] Show a warning about token cost when MCP or Both is selected.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: toggle picker, value persists across reload.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
