# M25 — Ship: telemetry, crash reporting, distribution, README polish

## Goal

Ship Pixler v1 as an npm package the team can install with
`npx pixler`. Wire up telemetry + crash reporting per SPEC §11.1 step 5 + §14 phase 6. Finalize the public README. Tag a release.

## Depends on

- All prior milestones (every feature being telemetered ships first)

## Deliverables

- [ ] **Telemetry**:
    - `apps/api/src/telemetry/telemetry.module.ts`:
        - Off by default unless `settings.telemetry.enabled` is true (set during onboarding)
        - Anonymous device id (random UUID generated once, stored in `~/.config/pixler/device-id`)
        - Buffers events; flushes every 60s to the telemetry endpoint (URL set via env var
          `PIXLER_TELEMETRY_URL`, default Anthropic-style placeholder or skip in v1)
        - **What is sent** (must match the onboarding "What gets sent?" list exactly):
            - Feature usage counts (settings opened, workspaces created, etc.)
            - Error rates / crash counts
            - Model selection patterns (anonymized: e.g., "planner=sonnet, reviewer=codex")
        - **What is NOT sent**:
            - No code, no prompts, no message contents, no ticket text, no file paths beyond top-level project name hashed
            - No PAT or env-var values
    - `TelemetryService.track(name, props?)` — used sparingly across the codebase from M01–M24
- [ ] **Crash reporting**:
    - api: top-level uncaught exception + unhandled rejection handlers that record to a
      `crashes` table and (if telemetry enabled) flush a sanitized payload (stack frame names, no values)
    - web: error boundary at the root + global `window.onerror` / `unhandledrejection` listeners → POST to
      `/api/crashes` → same path
    - Settings → Account "Privacy controls" panel filled in: toggles for telemetry + crash reports; "View what we'd send" inspector
- [ ] **Distribution**:
    - Root `package.json` finalized: `name`, `version` (start `0.1.0`), `bin`, `files` (only what needs shipping —
      `dist/`, `bin/`, `README.md`, `LICENSE`)
    - Build step: `pnpm -w build` produces self-contained `dist/` for api, web (static), packages (linear-cli)
    - `bin/pixler.js` updated to point at the built artifacts in `dist/`
    - `npm pack` test: install the tarball globally and `npx pixler` works from any directory
    - Pre-publish checklist script: typecheck, build, smoke-test (a small e2e that boots the server, hits
      `/api/health`, hits `/api/onboarding/status`, kills the process)
- [ ] **Settings → Storage panel** filled in (last one in SPEC §10.2):
    - Worktree base dir
    - Plan cache dir
    - Log retention slider
    - Disk usage breakdown view from SPEC §10.5 (live, with paths on hover + copy-path + open-in-Finder)
    - "Reset all prompts" / "Reset all settings" (`RESET`) / "Wipe database" (`WIPE EVERYTHING`) actions
- [ ] **Settings → About panel**:
    - Version
    - Check for updates (calls npm registry `GET /pixler/latest`)
    - Changelog link
    - License (resolve OQ §17 — pick MIT for v1 unless instructed otherwise)
    - "Submit feedback" link (GitHub issues URL once repo is up)
- [ ] **README.md (root) — final polish
  ** (already drafted by the README task; ensure it stays current with v1 reality + installation instructions)
- [ ] **CHANGELOG.md** with v0.1.0 entry covering all 25 milestones
- [ ] **LICENSE** file (MIT) at the repo root

## Acceptance

- `npm pack` produces a working tarball.
- `npx pixler` from a fresh directory on macOS / Linux boots the app and reaches onboarding.
- Telemetry off by default for users who toggled it off during onboarding; on for those who left the default; inspector shows the exact payload.
- Crashes surface a friendly "Pixler hit a snag — copy report?" toast with a copy-paste-able payload.
- All Settings panels are filled in across global + project scope.
- `pnpm -w typecheck` clean. `pnpm -w build` clean. Smoke test passes.

## Files

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

## Out of scope

- Auto-update (sparkle-style) — v2.
- Code signing / notarization — useful but not blocking for an `npx`-distributed app.
