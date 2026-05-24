# Pixler v1 — Milestone Plans

This directory contains the milestone plans for shipping Pixler v1 (per `pixler-SPEC.md`). Each `MXX-*.md` is *
*self-contained** and **agent-runnable**: a single agent can pick it up, finish it, and move on.

## How to read a plan

Every plan has the same shape:

- **Goal** — one-paragraph statement of what we're shipping.
- **Depends on** — milestones that must be done first. Anything not listed can run in parallel.
- **Deliverables** — checkboxes the agent ticks off as it works.
- **Acceptance** — how we know it's done (manual + automated checks).
- **Files** — the files the agent is expected to create or change.
- **Out of scope** — things the agent should *not* touch (usually owned by a later milestone).

## Dependency graph

```
                          M01 scaffold
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
       M02 tokens         M04 api-core        M05 sqlite
            │                  │                  │
       M03 ui-kit              │                  │
            │                  │                  │
            └────────► M06 app-shell ◄────────────┘
                               │
                          M07 projects
      R                         │
                          M08 workspaces ──► M09 terminal
                               │                  │
            ┌──────────────────┼──────────────────┴───────────┐
            │                  │                              │
       M10 linear-sdk     M11 linear-cli              M12 github-gh
            │                  │                              │
            └──────────────────┴──────────────────┬───────────┘
                                                  │
                                          M13 orchestrator
                                                  │
                                          M14 plan-storage
                                                  │
                                          M15 checkpoints

   (parallel UI surfaces — after M06, M09)
   M16 chat-ui     M17 diff-viewer     M18 checks-activity     M19 run-ide

   (parallel polish — after their direct deps)
   M20 themes     M21 onboarding     M22 palette-keys     M23 token-health     M24 gestures-deeplinks

                                          M25 ship
```

## Suggested execution order with /goal

Sequential bottleneck path is
`M01 → M02/M03/M04/M05 → M06 → M07 → M08 → M09 → M13 → M14 → M15 → M26`. Everything else fans out from there.

For maximum parallelism:

| Wave | Milestones (run in parallel) |
|------|------------------------------|
| 1    | M01                          |
| 2    | M02, M04, M05                |
| 3    | M03                          |
| 4    | M06                          |
| 5    | M07                          |
| 6    | M08, M10, M11, M12           |
| 7    | M09                          |
| 8    | M13, M16, M17, M18, M19      |
| 9    | M14                          |
| 10   | M15, M20, M21, M22, M23, M24 |
| 11   | M25                          |
| 12   | M26                          | 

After wave 7 you have a **walking skeleton**: create a project, open a workspace, run
`claude` in a terminal pane. Subsequent waves stack on top without breaking it.

## Definition of done for v1

All 25 milestones merged. Running `npx pixler` from any directory:

1. Boots a local NestJS server on a free port.
2. Opens `http://localhost:<port>` in the default browser.
3. Walks a new user through onboarding (theme → tool detection → Linear PAT → first project).
4. Lets the user take a Linear ticket from Todo to merged PR without leaving the app.
