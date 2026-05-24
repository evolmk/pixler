# M26 — Playwright E2E smoke suite

Status: draft

## Goal

Set up a Playwright workspace in
`apps/e2e/` (standard Turborepo pattern) and write one smoke test per completed milestone (M01–M09) that verify the app's deliverables against a live
`pnpm -w dev` instance. Full happy-path suite (ticket → merged PR) is a follow-on plan.

## Depends on

- M09 (Terminal) — first point where the full agent UI stack exists to test against

## Deliverables

### Infrastructure

- [ ] `apps/e2e/package.json` — workspace named `@pixler/e2e`; deps: `@playwright/test` (latest), `dotenv`
- [ ] `apps/e2e/playwright.config.ts`:
    - `baseURL: 'http://localhost:7777'`
    - `webServer` block: `command: 'pnpm -w dev'`, `url: 'http://localhost:7777'`, `reuseExistingServer: true` (so
      `PIXLER_RUNNING=1 pnpm test:e2e` skips boot)
    - Two projects: `chromium` (default) + `firefox` (optional, gated by `--project firefox`)
    - `reporter: [['html', { open: 'never' }], ['list']]`
    - `testDir: './tests'`, `timeout: 30_000`, `retries: 1`
- [ ] `apps/e2e/tests/helpers/socket.ts` — `waitForSocketConnected(page)`: polls
  `page.evaluate` until Socket.io client reports `connected`; used by terminal + settings tests
- [ ] `turbo.json` — add `test:e2e` task: `dependsOn: ["^build"]`, `cache: false` (E2E always runs fresh),
  `env: ["PIXLER_RUNNING"]`
- [ ] Root `package.json` — add `"test:e2e": "turbo run test:e2e"` script
- [ ] `apps/e2e/.gitignore` — `playwright-report/`, `test-results/`, `.auth/`
- [ ] `pnpm-workspace.yaml` — ensure `apps/e2e` is included (add `- 'apps/e2e'` if not covered by glob)

### Smoke tests

Each spec: boots the app, asserts the milestone's key deliverable is present, exits. No interaction beyond what's needed to confirm the feature exists.

- [ ] `tests/m01-boot.spec.ts` — `GET /api/health` returns `{ status: 'ok' }`;
  `localhost:7777` serves the React app (checks for `<div id="root">`)
- [ ] `tests/m02-tokens.spec.ts` — CSS variable `--color-primary` is set on `<html>` (not empty);
  `--font-sans` resolves to a string containing `Inter`
- [ ] 
  `tests/m03-ui-kit.spec.ts` — navigate to the component catalog route (or storybook port if separate); at least one component card is visible in the DOM
- [ ] `tests/m04-api.spec.ts` — `GET /api/version` responds with a JSON body; Socket.io namespace
  `/` connects within 2 s (via `waitForSocketConnected`)
- [ ] `tests/m05-settings.spec.ts` — `PUT /api/settings` with a test key; subsequent
  `GET /api/settings` returns the same value; verifies SQLite round-trip
- [ ] `tests/m06-shell.spec.ts` — app shell renders: sidebar nav present (`[data-testid="sidebar"]`), top bar present (
  `[data-testid="topbar"]`), no unhandled JS errors in console
- [ ] 
  `tests/m07-projects.spec.ts` — create a project via the UI (fill name field, submit); new project appears in the list;
  `GET /api/projects` returns it
- [ ] `tests/m08-workspaces.spec.ts` — open a project, create a workspace; workspace card appears;
  `GET /api/workspaces` returns it
- [ ] `tests/m09-terminal.spec.ts` — open a workspace, switch to Terminal mode; xterm canvas element is present (
  `canvas.xterm-cursor-layer`); type `echo pixler-ok` + Enter; terminal output contains `pixler-ok`

### Scripts

- [ ] `apps/e2e/package.json` scripts:
    - `"test": "playwright test"`
    - `"test:ui": "playwright test --ui"`
    - `"report": "playwright show-report"`

## Acceptance

- `pnpm test:e2e` (with dev server already running) passes all 9 smoke specs in < 60 s.
- `pnpm --filter @pixler/e2e test:ui` opens Playwright UI mode with all specs visible.
- `turbo run test:e2e` works from the repo root.
- No specs use `page.waitForTimeout` — all waits are condition-based.
- `pnpm -w typecheck` clean (e2e workspace included).

## Files

```
apps/e2e/package.json
apps/e2e/playwright.config.ts
apps/e2e/.gitignore
apps/e2e/tests/helpers/socket.ts
apps/e2e/tests/m01-boot.spec.ts
apps/e2e/tests/m02-tokens.spec.ts
apps/e2e/tests/m03-ui-kit.spec.ts
apps/e2e/tests/m04-api.spec.ts
apps/e2e/tests/m05-settings.spec.ts
apps/e2e/tests/m06-shell.spec.ts
apps/e2e/tests/m07-projects.spec.ts
apps/e2e/tests/m08-workspaces.spec.ts
apps/e2e/tests/m09-terminal.spec.ts
turbo.json                          (add test:e2e task)
package.json                        (add test:e2e script)
pnpm-workspace.yaml                 (confirm apps/e2e included)
```

## Out of scope

- Full ticket → merged PR happy-path suite — follow-on plan
- GitHub Actions / CI wiring — M25
- Visual regression (screenshot diffs)
- Firefox / WebKit coverage beyond chromium default
- Auth flows (Pixler has no login in the current spec)
- Mocking the Claude API or Linear — smokes hit the real dev server
