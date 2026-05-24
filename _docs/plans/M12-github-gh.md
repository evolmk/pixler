# M12 — GitHub integration (`gh` CLI wrapper)

## Goal

Wrap the
`gh` CLI for everything GitHub-facing per SPEC §7: auth status surfacing, PR creation/merging, PR comments, polled CI checks. No GitHub schemas in Pixler's tree — just shell out to
`gh` using the user's existing auth.

## Depends on

- M05 (settings — `providers.gh` path)
- M07 (projects — PR creation is scoped to a project's repo)
- M08 (workspaces — PRs originate from a workspace's branch)

## Deliverables

- [ ] api `GithubModule`:
    - `GithubService` — wraps `gh` via `execa`; uses the path from `settings.providers.gh` (default `gh`)
    - `GET /api/github/status` — runs `gh auth status --hostname github.com` and parses; returns
      `{ authenticated, account?, host?, scopes? }`
    - `GET /api/github/repo?projectId=…` — runs `gh repo view --json …` in project's cwd; cached for 60s
    - `POST /api/workspaces/:id/pr` body `{ title?, bodyFile?, draft? }` —
      `gh pr create --title … --body-file … --head <branch> --base <baseBranch> [--draft]`; auto-generated body references plan file + execution log when present (real body generation in M13/M14; here accept it as input or default to
      `--fill`)
    - `GET /api/workspaces/:id/pr` — `gh pr view --json …` in workspace cwd
    - `POST /api/workspaces/:id/pr/merge` body `{ strategy: 'squash'|'merge'|'rebase' }` —
      `gh pr merge` with the chosen strategy
    - `GET /api/workspaces/:id/pr/checks` — `gh pr checks --json …`
    - `GET /api/workspaces/:id/pr/comments` — `gh pr view --json reviews,comments`
    - **CI polling**: when a workspace has an open PR, poll `gh pr checks` every 30s; emit
      `pr.checks-updated` events with the diff
- [ ] **PR body template**: support a project-level template (Project Settings → Git → PR template); fall back to repo's
  `.github/PULL_REQUEST_TEMPLATE.md`; fall back to auto-generated body. Defines placeholders `{plan_link}`,
  `{execution_log}`, `{ticket}` that M13/M14 will fill.
- [ ] **`gh` not installed / not authed**:
    - Top-bar notification + Settings → Providers row shows the state with a "Re-auth" button that opens a terminal pane running
      `gh auth login` interactively
    - Pre-flight check before PR creation: if not authed, show a modal with the re-auth helper
- [ ] **Settings → Providers panel** filled in: rows for `claude`, `codex`, `gemini`,
  `gh` — each shows detected path, version (via `--version`), and a "Locate" button to set a custom path
- [ ] **Project Settings → Git panel
  ** filled in: branch template, base branch, PR template, auto-merge toggle, merge strategy
- [ ] **Project Settings → Integrations** GitHub section: status + "Re-auth" trigger
- [ ] Web: small `usePullRequest(workspaceId)` hook +
  `useChecks(workspaceId)` hook + a basic PR status badge component (consumed by M18's Checks tab and M13's PR tab)

## Acceptance

- With a workspace on a branch with commits ahead of the base, hitting
  `POST /api/workspaces/:id/pr` opens a real PR on GitHub via `gh`.
- `gh pr checks` output is parsed and surfaced as live events to the UI.
- A user without `gh` authed sees a clear pre-flight error and a re-auth path.
- Merge endpoint works with all three strategies.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Inline review comments UI — owned by M18 Checks tab.
- Real-time webhooks (v2 in spec).
- Deploy preview surfacing — M18 placeholder.
