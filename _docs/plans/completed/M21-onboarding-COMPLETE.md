# M21 — Onboarding flow

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete. Onboarding flow, Help re-run, guided workspace CTA done.

---

## Goal

Implement SPEC §11: a five-step Vaul-drawer onboarding flow that takes under 90 seconds — Welcome
+ Appearance, Connect Tools, Connect Linear, Add First Project, Telemetry Consent. Re-runnable
from the Help menu.

## Depends on

- M05 (settings — onboarding sets values)
- M10 (Linear PAT step)
- M12 (gh / Claude detection step)
- M07 (add first project step)
- M20 (Appearance step uses the swatch grid)

## Acceptance

- Fresh launch (with `~/.config/pixler/config.json` absent) walks the full 5-step flow in under
  90 seconds.
- Each step skippable; skipping leaves matching settings unset and the user lands at empty
  workspaces view.
- Re-running onboarding from Help opens the same flow, prefilled with existing values.
- `pnpm -w typecheck` clean.

## Out of scope

- Account / sign-in step — v1 has no Pixler account.
- Localization — English only in v1.

## Files (expected surface)

```
apps/api/src/onboarding/onboarding.module.ts
apps/api/src/onboarding/onboarding.service.ts
apps/api/src/onboarding/onboarding.controller.ts
apps/api/src/onboarding/tool-detector.service.ts
apps/web/src/components/Onboarding/OnboardingShell.tsx
apps/web/src/components/Onboarding/Step1Appearance.tsx
apps/web/src/components/Onboarding/Step2Tools.tsx
apps/web/src/components/Onboarding/Step3Linear.tsx
apps/web/src/components/Onboarding/Step4Project.tsx
apps/web/src/components/Onboarding/Step5Telemetry.tsx
apps/web/src/components/GuidedNewWorkspaceDialog.tsx
apps/web/src/hooks/useOnboarding.ts
```

---

## Sprint 1 — OnboardingModule + tool detector + status/complete/restart endpoints

**Status:** ✅ complete
**Goal:** Backend exposes onboarding lifecycle + a tool-detection endpoint web can call to render
each step's live state.

**Tasks:**

- [x] `OnboardingModule` + `OnboardingService` + `OnboardingController`.
- [x] `GET /api/onboarding/status` — `{ complete, currentStep }`.
- [x] `POST /api/onboarding/complete`, `POST /api/onboarding/restart`.
- [x] `tool-detector.service.ts` probes git/claude/codex/gemini/gh; returns version + auth state
  per tool.
- [x] `GET /api/onboarding/detect-tools`.

**Files Created/Modified:**

- `apps/api/src/onboarding/onboarding.module.ts` (new)
- `apps/api/src/onboarding/onboarding.service.ts` (new)
- `apps/api/src/onboarding/onboarding.controller.ts` (new)
- `apps/api/src/onboarding/tool-detector.service.ts` (new)
- `apps/api/src/app.module.ts` (OnboardingModule registered)
- `apps/api/src/settings/registry.ts` (onboarding.completedAt + onboarding.currentStep keys)

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test onboarding` + manual: hit detect-tools, see structured response.

---

## Sprint 2 — Onboarding shell + 5 step components

**Status:** ✅ complete
**Goal:** Fresh launch shows the Vaul drawer; each step renders and persists settings.

**Tasks:**

- [x] `OnboardingShell.tsx` — Vaul drawer from right with full center column; step indicator;
  "Skip — I'll do this later" link per step.
- [x] `Step1Appearance.tsx` — logo, pitch, embedded `ThemeSwatchGrid`, mode toggle.
- [x] `Step2Tools.tsx` — Git config helper, Claude version + subscription, gh auth status with
  walk-through, optional Codex/Gemini collapsed; Re-check all.
- [x] `Step3Linear.tsx` — PAT input + paste-validate + team picker + skip link.
- [x] `Step4Project.tsx` — three tiles (Open local / Clone / Skip); on success show settings
  preview.
- [x] `Step5Telemetry.tsx` — toggle checked by default + "What gets sent?" expandable + Finish
  button calls complete.
- [x] On boot: render shell if `onboarding.completedAt` not set.
- [x] `useOnboarding.ts`.

**Files Created/Modified:**

- `apps/web/src/components/Onboarding/OnboardingShell.tsx` (new)
- `apps/web/src/components/Onboarding/Step1Appearance.tsx` (existing, wired to shell)
- `apps/web/src/components/Onboarding/Step2Tools.tsx` (existing, wired to shell)
- `apps/web/src/components/Onboarding/Step3Linear.tsx` (existing, wired to shell)
- `apps/web/src/components/Onboarding/Step4Project.tsx` (existing, wired to shell)
- `apps/web/src/components/Onboarding/Step5Telemetry.tsx` (existing, wired to shell)
- `apps/web/src/hooks/useOnboarding.ts` (existing, complete)
- `apps/web/src/App.tsx` (OnboardingShell mounted on boot)

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: clear config, restart, walk full flow in <90s.

---

## Sprint 3 — Post-onboarding nudge + re-run from Help

**Status:** ✅ complete
**Goal:** Empty workspaces view shows guided "+ Create your first workspace" CTA with hint
balloons; Help menu re-runs onboarding.

**Tasks:**

- [x] `GuidedNewWorkspaceDialog.tsx` — variant with inline hint balloons that fade after first
  use.
- [x] Empty workspaces view renders CTA.
- [x] Help menu → "Re-run onboarding" item; also reachable via cmdk in M22.

**Files Created/Modified:**

- `apps/web/src/components/GuidedNewWorkspaceDialog.tsx` (new)
- `apps/web/src/components/WorkspacesSidebar.tsx` (guided CTA for empty state)
- `apps/web/src/components/TopBar.tsx` (Help menu + OnboardingShell re-run)

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: re-run from Help; existing values prefilled.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
