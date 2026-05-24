# Content Voice & Copy Rules

**Created:** 2026-05-15

**When to read:** Writing any UI string — labels, CTAs, empty states, error messages, page titles, descriptions, tooltips. This spec governs all copy in Pixler.

---

## Voice & Tone

Pixler copy reads like a **developer tool** — not marketing, not a friendly assistant.

- **Grounded, precise, declarative.** "Terminal multiplexer with integrated Linear sync and project-scoped workspaces." Not "Built to make coding easier!"
- **Developer-to-developer.** Assumes the reader knows what a repo, branch, workspace, terminal session, or API token is.
- **Information-dense.** Status, metrics, and identifiers are always visible — never abstracted away.
- **Confident, never apologetic.** "No results" — not "Sorry, we couldn't find anything."

---

## Casing & Punctuation

| Context                    | Rule                          | Example                                       |
| -------------------------- | ----------------------------- | --------------------------------------------- |
| Navigation labels          | Title Case                    | "Projects", "My Workspaces"                   |
| Page titles                | Title Case                    | "Terminal Sessions"                            |
| Overlines / eyebrows       | UPPERCASE WITH WIDE TRACKING  | "PROJECT OVERVIEW · WORKSPACE 01"             |
| Body copy / descriptions   | Sentence case                 | "Integrated terminal with project-scoped…"    |
| CTAs (primary / secondary) | Title Case, verb-first        | "Create Project", "Open Terminal", "View Diff" |
| Tertiary actions           | Sentence case                 | "Remove workspace · Duplicate project"        |
| Identifiers                | Verbatim, hyphens preserved   | `proj-abc-123`                                 |
| Em-dash elaboration        | Em-dash (no spaces or spaced) | "Git-integrated — syncs with Linear"           |
| Bullet lists               | No terminal punctuation       | `· Projects · Workspaces · Terminal`           |

---

## Pronoun & Address

- **Second person ("you", "your")** sparingly — only on auth/account screens: "Your projects", "Your workspaces".
- **Imperative mood** for CTAs: "Create Project", "Open Terminal", "View Diff" — verb-first, never "Click here" or "Click to create".
- **Never first-person.** No "We're excited to…", no "Our team…", no "We offer…".

---

## Numbers & Units

- **Counts and metrics:** use `tabular-nums` for numeric columns (token usage, session counts, timestamps).
- **Durations:** human-readable: `2h 15m`, `< 1s`. Units always present.
- **Identifiers:** always verbatim, hyphens preserved — no reformatting or abbreviation.

---

## Emoji

**Never.** Use Lucide icons instead. Emoji breaks the developer-tool feel instantly. Strip emoji from any user-provided copy before rendering.

---

## Examples (lifted from the live site)

| Context          | Copy                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| Eyebrow label    | `WORKSPACE`                                                                          |
| Identifier       | `proj-abc-123`                                                                       |
| Page title       | `Terminal Session — Workspace Alpha`                                                 |
| Primary CTA      | `Create Project` (weight 500, brand-green fill, `rounded-md` — never pill)           |
| Secondary CTA    | `Open Terminal`                                                                      |
| Tertiary actions | `Remove Workspace · Duplicate Project · Share Link`                                  |
| Footer column    | `Tools → Projects · Workspaces · Terminal · Linear · GitHub`                         |
| Empty state      | `No projects yet.` then `Create your first project →`                                |
| Error message    | `Invalid project ID.` (not "Oops! We couldn't find that.")                           |

---

## Common Mistakes to Avoid

- ❌ "Click here" → ✅ Use verb-first: "View details", "Open terminal"
- ❌ "We're currently unable to connect" → ✅ "Connection failed"
- ❌ "Your project has been successfully created!" → ✅ "Project created."
- ❌ "Please enter a valid email address" → ✅ "Enter a valid email address"
- ❌ Emoji anywhere → ✅ Lucide icon at appropriate size
- ❌ Mixing unit formats → ✅ Consistent "103 in / 261.62 cm" format

---

> **Cross-links:** `spec-ui-typography.md` → casing rules, display type, tabular figures · `spec-ui-design-system.md` → full voice summary
