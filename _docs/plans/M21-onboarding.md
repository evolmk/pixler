# M21 — Onboarding flow

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-24
**Current Status:** Not started — runnable after M05 + M07 + M10 + M12 + M20.

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

**Status:** ⏳ pending
**Goal:** Backend exposes onboarding lifecycle + a tool-detection endpoint web can call to render
each step's live state.

**Tasks:**

- [ ] `OnboardingModule` + `OnboardingService` + `OnboardingController`.
- [ ] `GET /api/onboarding/status` — `{ complete, currentStep }`.
- [ ] `POST /api/onboarding/complete`, `POST /api/onboarding/restart`.
- [ ] `tool-detector.service.ts` probes git/claude/codex/gemini/gh; returns version + auth state
  per tool.
- [ ] `GET /api/onboarding/detect-tools`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test onboarding` + manual: hit detect-tools, see structured response.

---

## Sprint 2 — Onboarding shell + 5 step components

**Status:** ⏳ pending
**Goal:** Fresh launch shows the Vaul drawer; each step renders and persists settings.

**Tasks:**

- [ ] `OnboardingShell.tsx` — Vaul drawer from right with full center column; step indicator;
  "Skip — I'll do this later" link per step.
- [ ] `Step1Appearance.tsx` — logo, pitch, embedded `ThemeSwatchGrid`, mode toggle.
- [ ] `Step2Tools.tsx` — Git config helper, Claude version + subscription, gh auth status with
  walk-through, optional Codex/Gemini collapsed; Re-check all.
- [ ] `Step3Linear.tsx` — PAT input + paste-validate + team picker + skip link.
- [ ] `Step4Project.tsx` — three tiles (Open local / Clone / Skip); on success show settings
  preview.
- [ ] `Step5Telemetry.tsx` — toggle checked by default + "What gets sent?" expandable + Finish
  button calls complete.
- [ ] On boot: render shell if `onboarding.completedAt` not set.
- [ ] `useOnboarding.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: clear config, restart, walk full flow in <90s.

---

## Sprint 3 — Post-onboarding nudge + re-run from Help

**Status:** ⏳ pending
**Goal:** Empty workspaces view shows guided "+ Create your first workspace" CTA with hint
balloons; Help menu re-runs onboarding.

**Tasks:**

- [ ] `GuidedNewWorkspaceDialog.tsx` — variant with inline hint balloons that fade after first
  use.
- [ ] Empty workspaces view renders CTA.
- [ ] Help menu → "Re-run onboarding" item; also reachable via cmdk in M22.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: re-run from Help; existing values prefilled.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
