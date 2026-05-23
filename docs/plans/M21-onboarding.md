# M21 — Onboarding flow

## Goal

Implement SPEC §11: a five-step Vaul-drawer onboarding flow that takes under 90 seconds — Welcome + Appearance, Connect Tools, Connect Linear, Add First Project, Telemetry Consent. Re-runnable from the Help menu.

## Depends on

- M05 (settings — onboarding sets values)
- M10 (Linear PAT step)
- M12 (gh / Claude detection step)
- M07 (add first project step)
- M20 (Appearance step uses the swatch grid)

## Deliverables

- [ ] api `OnboardingModule`:
  - `GET /api/onboarding/status` — `{ complete, currentStep }`
  - `POST /api/onboarding/complete` — mark complete + persist `onboarding.completedAt`
  - `POST /api/onboarding/restart` — clear `onboarding.completedAt`
  - `GET /api/onboarding/detect-tools` — runs detection for git, claude, codex, gemini, gh; returns `{ git: { name, email }?, claude: { version, subscription }?, codex: …, gemini: …, gh: { authenticated, user? } }`
- [ ] Web flow:
  - On boot, if `onboarding.completedAt` not set → render onboarding overlay (Vaul drawer from the right, takes full center column)
  - Step indicator at top, "Skip — I'll do this later" link in every step
  - **Step 1 — Welcome + Appearance**: logo, pitch, embedded `ThemeSwatchGrid`, mode toggle (System default), Next
  - **Step 2 — Connect Tools**:
    - Git: shows current `user.name`/`user.email`; if missing, walks user through `git config --global` commands with copy buttons; "Re-check"
    - Claude Code: shows detected version + subscription (Pro/Max/API key); if missing, install command + copy button + "Re-check"
    - gh CLI: shows `gh auth status`; if missing, walks `gh auth login` (or opens a terminal tab running it)
    - Optional: Codex / Gemini — collapsed by default, expand to see detection
    - Big "Re-check all" button at the bottom
  - **Step 3 — Connect Linear**:
    - PAT input with link to Linear's API token page
    - Validate via `viewer` query immediately on paste; show "Connected as [name] in [workspace]"
    - Default team picker
    - "Skip if you'll use GitHub Issues" link
  - **Step 4 — Add First Project**:
    - Three tiles: Open local folder / Clone from GitHub / Skip for now
    - On success, show a "Project Settings preview" with defaults (plan storage = auto, branch template = `pixler/<workspace>`)
  - **Step 5 — Telemetry consent**:
    - Single toggle "Help improve Pixler by sharing anonymous usage data" — **checked by default** per SPEC §11.1 step 5
    - Expandable "What gets sent?" — exact field list (feature usage counts, error rates, model selection patterns; explicit "no code, no prompts, no ticket content")
    - "Finish" button calls `POST /api/onboarding/complete`
- [ ] **Post-onboarding nudge**: empty workspaces view shows a single CTA "+ Create your first workspace" — opens a guided variant of the New Workspace dialog with inline hint balloons that fade after first use
- [ ] **Re-run**: Help menu → "Re-run onboarding" item (also reachable via cmdk in M22)

## Acceptance

- Fresh launch (with `~/.config/pixler/config.json` absent) walks the full 5-step flow in under 90 seconds.
- Each step skippable; skipping leaves matching settings unset and the user lands at empty workspaces view.
- Re-running onboarding from Help opens the same flow, prefilled with existing values.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Account / sign-in step — v1 has no Pixler account.
- Localization — English only in v1.
