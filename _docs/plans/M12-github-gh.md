# M12 — GitHub integration (`gh` CLI wrapper)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M05 + M07 + M08.

---

## Goal

Wrap the `gh` CLI for everything GitHub-facing per SPEC §7: auth status surfacing, PR
creation/merging, PR comments, polled CI checks. No GitHub schemas in Pixler's tree — just shell
out to `gh` using the user's existing auth.

## Depends on

- M05 (settings — `providers.gh` path)
- M07 (projects — PR creation is scoped to a project's repo)
- M08 (workspaces — PRs originate from a workspace's branch)

## Acceptance

- With a workspace on a branch with commits ahead of the base, hitting
  `POST /api/workspaces/:id/pr` opens a real PR on GitHub via `gh`.
- `gh pr checks` output is parsed and surfaced as live events to the UI.
- A user without `gh` authed sees a clear pre-flight error and a re-auth path.
- Merge endpoint works with all three strategies.
- `pnpm -w typecheck` clean.

## Out of scope

- Inline review comments UI — owned by M18 Checks tab.
- Real-time webhooks (v2 in spec).
- Deploy preview surfacing — M18 placeholder.

## Files (expected surface)

```
apps/api/src/github/github.module.ts
apps/api/src/github/github.service.ts
apps/api/src/github/github.controller.ts
apps/api/src/github/gh-exec.service.ts
apps/api/src/github/checks-poller.service.ts
apps/api/src/github/pr-body-template.service.ts
packages/shared-types/src/github.ts
apps/web/src/components/SettingsDrawer/ProvidersPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/GitPanel.tsx
apps/web/src/components/PrStatusBadge.tsx
apps/web/src/hooks/usePullRequest.ts
apps/web/src/hooks/useChecks.ts
apps/web/src/hooks/useGithubStatus.ts
```

---

## Sprint 1 — GithubModule + auth/repo endpoints + gh-exec wrapper

**Status:** ⏳ pending
**Goal:** Module + service in place; status + repo info endpoints return parsed `gh` output.

**Tasks:**

- [ ] `gh-exec.service.ts` — wraps `gh` via `execa`; uses path from `settings.providers.gh`.
- [ ] `GithubModule` + `GithubService` + `GithubController`.
- [ ] `GET /api/github/status` — parses `gh auth status --hostname github.com`.
- [ ] `GET /api/github/repo?projectId=…` — runs `gh repo view --json …` in project cwd; cached 60s.
- [ ] `packages/shared-types/src/github.ts` DTOs.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test github` — mock execa, verify status parse.

---

## Sprint 2 — PR create/view/merge/comments + CI polling

**Status:** ⏳ pending
**Goal:** Full PR lifecycle works via `gh`; CI checks poll and emit live events.

**Tasks:**

- [ ] `POST /api/workspaces/:id/pr { title?, bodyFile?, draft? }` — `gh pr create` with proper
  flags.
- [ ] `GET /api/workspaces/:id/pr`, `POST /api/workspaces/:id/pr/merge { strategy }`.
- [ ] `GET /api/workspaces/:id/pr/checks`, `GET /api/workspaces/:id/pr/comments`.
- [ ] `checks-poller.service.ts` — every 30s while PR open; emit `pr.checks-updated` with diff.
- [ ] `pr-body-template.service.ts` — project template → repo `.github/PULL_REQUEST_TEMPLATE.md` →
  auto-generated; defines `{plan_link}`, `{execution_log}`, `{ticket}` placeholders.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test pr` + manual: open a PR on a test repo, verify checks poll fires.

---

## Sprint 3 — Settings panels + PR badge + hooks + re-auth UX

**Status:** ⏳ pending
**Goal:** Web UI surfaces all gh state; user with no auth gets a clear path back.

**Tasks:**

- [ ] `SettingsDrawer/ProvidersPanel.tsx` — rows for claude/codex/gemini/gh with detected path,
  version, "Locate" button.
- [ ] `ProjectSettingsDrawer/GitPanel.tsx` — branch template, base branch, PR template,
  auto-merge toggle, merge strategy.
- [ ] Extend `ProjectSettingsDrawer/IntegrationsPanel.tsx` with GitHub section + Re-auth trigger.
- [ ] `PrStatusBadge.tsx` + `hooks/usePullRequest.ts` + `useChecks.ts` + `useGithubStatus.ts`.
- [ ] Top-bar notification + Settings → Providers re-auth button that opens terminal pane
  running `gh auth login`.
- [ ] Pre-flight check before PR creation: modal with re-auth helper if not authed.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: deauth gh, observe pre-flight path; reauth, confirm green.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
