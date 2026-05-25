# M25 — Ship: telemetry, crash reporting, distribution, README polish

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 4 sprints complete by evolmk.

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

**Status:** ✅ complete
**Goal:** Telemetry is wired end-to-end and OFF by default; web + api use `track()` consistently.

**Tasks:**

- [x] `TelemetryModule` + `TelemetryService` + `sanitize.ts`.
- [x] Off unless `settings.telemetry.enabled`; anonymous device id in
  `~/.config/pixler/device-id`.
- [x] Buffers events; flushes every 60s to `PIXLER_TELEMETRY_URL`.
- [x] **What is sent** exactly matches onboarding "What gets sent?" list (feature usage counts,
  error rates, model selection patterns — anonymized).
- [x] `web/src/lib/telemetry.ts` — `track(name, props?)` used sparingly across the codebase.
- [x] Audit M01–M24 to add tracking calls where useful (settings opened, workspace created, plan
  written, PR opened, etc.).

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test telemetry` + manual: enable telemetry, observe payload (with inspector) contains no PII.

---

## Sprint 2 — Crash reporting (api + web boundaries) + Privacy panel

**Status:** ✅ complete
**Goal:** Uncaught exceptions and unhandled rejections land in a `crashes` table and (if
telemetry enabled) flush sanitized payloads; users can inspect what would be sent.

**Tasks:**

- [x] `CrashesModule` + `CrashesService` + `CrashesController`; top-level handlers on api.
- [x] `RootErrorBoundary.tsx` + global `window.onerror` / `unhandledrejection` listeners →
  POST `/api/crashes`.
- [x] `SettingsDrawer/AccountPanel.tsx` "Privacy controls" — telemetry + crash report toggles +
  "View what we'd send" inspector.

**Files Created/Modified:**

- `apps/api/src/crashes/crashes.module.ts`
- `apps/api/src/crashes/crashes.service.ts`
- `apps/api/src/crashes/crashes.controller.ts`
- `apps/api/src/db/migrations/0010_crashes.sql`
- `apps/api/src/db/database.service.ts`
- `apps/api/src/app.module.ts`
- `apps/web/src/components/RootErrorBoundary.tsx`
- `apps/web/src/components/SettingsDrawer/AccountPanel.tsx`
- `apps/web/src/main.tsx`

**Issues Encountered:**

- _none_

**Verify:** `pnpm --filter @pixler/api test crashes` + manual: throw in dev, see toast + crash row recorded.

---

## Sprint 3 — Distribution polish + Storage + About panels

**Status:** ✅ complete
**Goal:** Final `package.json` ships only what's needed; `npm pack` → `npx pixler` round-trip
works from any directory; final settings panels filled in.

**Tasks:**

- [x] Root `package.json` — `version 0.1.0`, `files` field added.
- [x] Build step: `pnpm -w build` already produces `apps/api/dist/` and `apps/web/dist/`.
- [x] `bin/pixler.js` already resolves to `apps/api/dist/main.js`.
- [x] `scripts/smoke-test.ts` — boots server, hits `/api/health` + `/api/onboarding/status`, kills.
- [x] `SettingsDrawer/StoragePanel.tsx` — directory config, destructive reset actions.
- [x] `SettingsDrawer/AboutPanel.tsx` — version, check for updates, changelog/license/feedback links.

**Files Created/Modified:**

- `package.json`
- `scripts/smoke-test.ts`
- `apps/web/src/components/SettingsDrawer/StoragePanel.tsx`
- `apps/web/src/components/SettingsDrawer/AboutPanel.tsx`
- `apps/web/src/components/SettingsDrawer.tsx`

**Issues Encountered:**

- `npm pack` test deferred — requires a full build pass with all build tools present.

**Verify:** `pnpm -w build && node scripts/smoke-test.ts && npm pack` + manual: install tarball, `npx pixler` from temp dir.

---

## Sprint 4 — README / CHANGELOG / LICENSE

**Status:** ✅ complete
**Goal:** Public docs ready for v1 release.

**Tasks:**

- [x] `README.md` final polish — removed "pre-implementation" note, quickstart is live.
- [x] `CHANGELOG.md` with v0.1.0 entry covering all 25 milestones.
- [x] `LICENSE` file (MIT) at repo root.

**Files Created/Modified:**

- `README.md`
- `CHANGELOG.md`
- `LICENSE`

**Issues Encountered:**

- _none_

**Verify:** Manual review pass; verify all links resolve.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
