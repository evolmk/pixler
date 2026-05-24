# M25 — Ship: telemetry, crash reporting, distribution, README polish

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — final milestone; runs after every prior milestone.

---

## Goal

Ship Pixler v1 as an npm package the team can install with `npx pixler`. Wire up telemetry +
crash reporting per SPEC §11.1 step 5 + §14 phase 6. Finalize the public README. Tag a release.

## Depends on

- All prior milestones (every feature being telemetered ships first)

## Acceptance

- `npm pack` produces a working tarball.
- `npx pixler` from a fresh directory on macOS / Linux boots the app and reaches onboarding.
- Telemetry off by default for users who toggled it off during onboarding; on for those who left
  the default; inspector shows the exact payload.
- Crashes surface a friendly "Pixler hit a snag — copy report?" toast with a copy-paste-able
  payload.
- All Settings panels are filled in across global + project scope.
- `pnpm -w typecheck` clean. `pnpm -w build` clean. Smoke test passes.

## Out of scope

- Auto-update (sparkle-style) — v2.
- Code signing / notarization — useful but not blocking for an `npx`-distributed app.

## Files (expected surface)

```
apps/api/src/telemetry/telemetry.module.ts
apps/api/src/telemetry/telemetry.service.ts
apps/api/src/telemetry/sanitize.ts
apps/api/src/crashes/crashes.module.ts
apps/api/src/crashes/crashes.service.ts
apps/api/src/crashes/crashes.controller.ts
apps/web/src/lib/telemetry.ts
apps/web/src/components/RootErrorBoundary.tsx
apps/web/src/components/SettingsDrawer/AccountPanel.tsx
apps/web/src/components/SettingsDrawer/StoragePanel.tsx
apps/web/src/components/SettingsDrawer/AboutPanel.tsx
scripts/smoke-test.ts
package.json                   (final ship-shape)
README.md                       (already exists; double-check)
CHANGELOG.md
LICENSE
```

---

## Sprint 1 — Telemetry module + sanitize + track helper

**Status:** ⏳ pending
**Goal:** Telemetry is wired end-to-end and OFF by default; web + api use `track()` consistently.

**Tasks:**

- [ ] `TelemetryModule` + `TelemetryService` + `sanitize.ts`.
- [ ] Off unless `settings.telemetry.enabled`; anonymous device id in
  `~/.config/pixler/device-id`.
- [ ] Buffers events; flushes every 60s to `PIXLER_TELEMETRY_URL`.
- [ ] **What is sent** exactly matches onboarding "What gets sent?" list (feature usage counts,
  error rates, model selection patterns — anonymized).
- [ ] `web/src/lib/telemetry.ts` — `track(name, props?)` used sparingly across the codebase.
- [ ] Audit M01–M24 to add tracking calls where useful (settings opened, workspace created, plan
  written, PR opened, etc.).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test telemetry` + manual: enable telemetry, observe payload (with inspector) contains no PII.

---

## Sprint 2 — Crash reporting (api + web boundaries) + Privacy panel

**Status:** ⏳ pending
**Goal:** Uncaught exceptions and unhandled rejections land in a `crashes` table and (if
telemetry enabled) flush sanitized payloads; users can inspect what would be sent.

**Tasks:**

- [ ] `CrashesModule` + `CrashesService` + `CrashesController`; top-level handlers on api.
- [ ] `RootErrorBoundary.tsx` + global `window.onerror` / `unhandledrejection` listeners →
  POST `/api/crashes`.
- [ ] `SettingsDrawer/AccountPanel.tsx` "Privacy controls" — telemetry + crash report toggles +
  "View what we'd send" inspector.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test crashes` + manual: throw in dev, see toast + crash row recorded.

---

## Sprint 3 — Distribution polish + Storage + About panels

**Status:** ⏳ pending
**Goal:** Final `package.json` ships only what's needed; `npm pack` → `npx pixler` round-trip
works from any directory; final settings panels filled in.

**Tasks:**

- [ ] Root `package.json` — `name`, `version 0.1.0`, `bin`, `files` (only `dist/`, `bin/`,
  `README.md`, `LICENSE`).
- [ ] Build step: `pnpm -w build` → self-contained `dist/` for api, web (static), packages
  (linear-cli).
- [ ] `bin/pixler.js` points at built `dist/` artifacts.
- [ ] `scripts/smoke-test.ts` — boots server, hits `/api/health` + `/api/onboarding/status`,
  kills.
- [ ] `npm pack` test: install tarball globally, `npx pixler` from fresh dir.
- [ ] `SettingsDrawer/StoragePanel.tsx` — worktree base dir, plan cache dir, log retention,
  disk usage breakdown (live), "Reset all prompts" / "Reset all settings" / "Wipe database"
  actions.
- [ ] `SettingsDrawer/AboutPanel.tsx` — version, check for updates (npm registry), changelog
  link, license, feedback link.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w build && node scripts/smoke-test.ts && npm pack` + manual: install tarball, `npx pixler` from temp dir.

---

## Sprint 4 — README / CHANGELOG / LICENSE

**Status:** ⏳ pending
**Goal:** Public docs ready for v1 release.

**Tasks:**

- [ ] `README.md` final polish — installation, quickstart, links to spec.
- [ ] `CHANGELOG.md` with v0.1.0 entry covering all 25 milestones.
- [ ] `LICENSE` file (MIT) at repo root.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Manual review pass; verify all links resolve.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
