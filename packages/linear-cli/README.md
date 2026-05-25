# @pixler/linear-cli

Agent-facing thin CLI that wraps the Pixler local API for Linear operations.
Agents (Claude Code, Codex, etc.) call this from bash to manage Linear tickets without
needing a PAT or direct network access — the Pixler API handles auth.

## Requirements

- Pixler API must be running (`pnpm -w dev` or `npx pixler`)
- `PIXLER_API_PORT` env var (default: `7777`)

## Usage

```
PIXLER_API_PORT=7777 pixler-linear <command> [options]
```

All commands output JSON by default. Add `--text` for a short human-readable summary.

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation error (bad args) |
| 2 | Network error (API unreachable) |
| 3 | Linear-side error (API returned 4xx/5xx) |

---

## Commands

### `ticket fetch <identifier>`

Fetch full ticket data from Linear.

```bash
pixler-linear ticket fetch ENG-101
pixler-linear ticket fetch ENG-101 --text
```

### `ticket state <identifier> <state> --team <teamId>`

Transition a ticket state via the Pixler state-map.

Valid states: `todo` | `in_progress` | `in_review` | `done`

```bash
pixler-linear ticket state ENG-101 in_progress --team TEAM_ID
pixler-linear ticket state ENG-101 done --team TEAM_ID --project PROJECT_ID
```

### `ticket comment <identifier> <body>`

Add a Markdown comment to a ticket.

```bash
pixler-linear ticket comment ENG-101 "Implementation complete. See PR #42."
```

### `ticket label <identifier> <label>`

Add a label to a ticket (case-insensitive name match within the team).

```bash
pixler-linear ticket label ENG-101 "needs-review"
```

---

### `subissue create <identifier> <title>`

Create a sub-issue under a parent ticket.

```bash
pixler-linear subissue create ENG-101 "Write unit tests"
# → { "id": "...", "identifier": "ENG-109" }
```

### `subissue complete <id>`

Mark a sub-issue done (by its Linear UUID, not identifier).

```bash
pixler-linear subissue complete abc123-def456
```

---

### `attachment upload <identifier> <file>`

Upload a local file as a Linear attachment. MIME type is inferred from extension.

```bash
pixler-linear attachment upload ENG-101 ./plan.md
pixler-linear attachment upload ENG-101 ./screenshot.png --title "Error screenshot"
```

### `attachment delete <id>`

Delete an attachment by its Linear UUID.

```bash
pixler-linear attachment delete abc123-def456
```
