# M11 — `@pixler/linear-cli` (agent-facing thin CLI)

## Goal

Build the agent-facing Pixler Linear CLI described in SPEC §6.7–§6.8 + §12.2: a thin, low-token-overhead command surface that agents (claude/codex) call from bash. Defaults to running through the Pixler local api so it reuses the user's PAT and respects the state-map.

## Depends on

- M10 (the api endpoints the CLI wraps)

## Deliverables

- [ ] `packages/linear-cli`:
    - `bin/pixler-linear.js` (also installed as a sub-command of the main `pixler` binary so agents can run
      `pixler ticket fetch ENG-101`)
    - Implementation in TypeScript, compiled to a small bundle (use `tsup` for fast builds)
- [ ] Commands (each with a short `--help` ≤80 tokens per SPEC §6.8):
    - `pixler ticket fetch <id>` — full ticket details + comments + sub-issues (JSON to stdout)
    - `pixler ticket comment <id> "..."` — add a comment
    - `pixler ticket state <id> <state>` — transition via state-map (states: `todo|in_progress|in_review|done`)
    - `pixler ticket label <id> <label> [--remove]`
    - `pixler subissue create <parent-id> "title"` — returns the new id
    - `pixler subissue complete <id>`
    - `pixler attachment upload <ticket-id> <file>` — uploads, prints `att_<id>`
    - `pixler attachment delete <att-id>`
- [ ] **Transport**: CLI talks to
  `http://localhost:$PIXLER_API_PORT` (api injects this env var when spawning agent processes — wire that in via M13's process spawner, but the CLI just reads the env var)
- [ ] If `$PIXLER_API_PORT` is not set, CLI prints a helpful error: "Run via Pixler; this CLI is not standalone."
- [ ] Token-efficient output: JSON by default for machine consumption; `--text` flag for short human-readable output
- [ ] Exit codes: `0` success, `1` validation error, `2` network/api error, `3` Linear-side error
- [ ] **Project Settings → Integrations** UI (lit up in M11): Linear agent mode selector — **CLI (default)** | **MCP** |
  **Both** — described in SPEC §6.7. Persists to `settings.linear.agentMode` (project scope). When `MCP` or
  `Both` is selected, surface a warning about token cost.
- [ ] Document the CLI surface in
  `packages/linear-cli/README.md` (this README is included in the package so agents reading their workspace can find it)

## Acceptance

- Inside any workspace shell (with the api running), `pixler ticket fetch ENG-101` returns full JSON.
- `pixler ticket state ENG-101 in_progress` transitions the ticket via the state-map (verified in Linear).
- `pixler ticket comment ENG-101 "test"` adds the comment.
- `pixler attachment upload ENG-101 ./plan.md` uploads and prints the attachment id.
- `--help` output for each command is short and consistent.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- MCP server itself — agents can install the official Linear MCP if they pick that mode; Pixler doesn't ship its own MCP in v1.
- GitHub CLI counterpart — agents shell out directly to `gh`; no wrapper needed (M12 documents which
  `gh` commands are blessed).
