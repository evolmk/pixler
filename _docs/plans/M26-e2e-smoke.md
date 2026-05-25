# M26 — Playwright E2E smoke suite

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Sprint 1 complete — infra set up. Sprint 2 in-progress.

---

## Goal

Set up a Playwright workspace in `apps/e2e/` (standard Turborepo pattern) and write one smoke
test per completed milestone (M01–M09) that verify the app's deliverables against a live
`pnpm -w dev` instance. Full happy-path suite (ticket → merged PR) is a follow-on plan.

## Depends on

- M09 (Terminal) — first point where the full agent UI stack exists to test against

## Acceptance

- `pnpm test:e2e` (with dev server already running) passes all 9 smoke specs in < 60 s.
- `pnpm --filter @pixler/e2e test:ui` opens Playwright UI mode with all specs visible.
- `turbo run test:e2e` works from the repo root.
- No specs use `page.waitForTimeout` — all waits are condition-based.
- `pnpm -w typecheck` clean (e2e workspace included).

## Out of scope

- Full ticket → merged PR happy-path suite — follow-on plan
- GitHub Actions / CI wiring — M25
- Visual regression (screenshot diffs)
- Firefox / WebKit coverage beyond chromium default
- Auth flows (Pixler has no login in the current spec)
- Mocking the Claude API or Linear — smokes hit the real dev server

## Files (expected surface)

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

---

## Sprint 1 — Infrastructure: workspace + Playwright config + helpers + turbo task

**Status:** ✅ complete
**Goal:** `apps/e2e` exists as a runnable Turborepo workspace; `pnpm test:e2e` boots the dev
server and runs an empty (or trivial) spec successfully.

**Tasks:**

- [x] `apps/e2e/package.json` — `@pixler/e2e`, deps `@playwright/test` + `dotenv`; scripts
  `test`, `test:ui`, `report`.
- [x] `apps/e2e/playwright.config.ts` — `baseURL: http://localhost:7777`; `webServer`
  `pnpm -w dev` with `reuseExistingServer: true`; chromium + firefox projects; HTML + list
  reporters; `testDir: ./tests`, `timeout: 30000`, `retries: 1`.
- [x] `apps/e2e/tests/helpers/socket.ts` — `waitForSocketConnected(page)` polling `page.evaluate`
  until Socket.io client reports connected.
- [x] `apps/e2e/.gitignore` — `playwright-report/`, `test-results/`, `.auth/`.
- [x] `turbo.json` add `test:e2e` task: `dependsOn ["^build"]`, `cache: false`, `env
  ["PIXLER_RUNNING"]`.
- [x] Root `package.json` add `"test:e2e": "turbo run test:e2e"`.
- [x] `pnpm-workspace.yaml` confirm `apps/e2e` is included.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm install && pnpm test:e2e --list` shows the project; running a trivial spec passes.

---

## Sprint 2 — Smoke specs M01–M05 (boot, tokens, ui-kit, api, settings)

**Status:** ⏳ pending
**Goal:** Five infrastructure-level smokes pass against the running app.

**Tasks:**

- [ ] `tests/m01-boot.spec.ts` — `GET /api/health` returns `{ status: 'ok' }`;
  `localhost:7777` serves React app (checks `<div id="root">`).
- [ ] `tests/m02-tokens.spec.ts` — CSS var `--color-primary` set on `<html>`; `--font-sans`
  contains `Inter`.
- [ ] `tests/m03-ui-kit.spec.ts` — navigate to component catalog (Storybook port if separate);
  at least one component card visible.
- [ ] `tests/m04-api.spec.ts` — `GET /api/version` JSON; Socket.io `/` connects within 2s via
  helper.
- [ ] `tests/m05-settings.spec.ts` — PUT then GET a test setting key; verifies SQLite round-trip.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/e2e test --project chromium` → 5/5 pass.

---

## Sprint 3 — Smoke specs M06–M09 (shell, projects, workspaces, terminal)

**Status:** ⏳ pending
**Goal:** Four UI-level smokes round out the suite; full suite runs in < 60s.

**Tasks:**

- [ ] `tests/m06-shell.spec.ts` — sidebar + topbar `data-testid`s present; no unhandled JS
  errors in console.
- [ ] `tests/m07-projects.spec.ts` — create a project via UI; appears in list;
  `GET /api/projects` returns it.
- [ ] `tests/m08-workspaces.spec.ts` — open project, create workspace; card appears;
  `GET /api/workspaces` returns it.
- [ ] `tests/m09-terminal.spec.ts` — switch workspace to Terminal mode; `canvas.xterm-cursor-layer`
  present; type `echo pixler-ok` + Enter; output contains `pixler-ok`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm test:e2e` → 9/9 pass in <60s; `pnpm --filter @pixler/e2e test:ui` opens UI mode.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
