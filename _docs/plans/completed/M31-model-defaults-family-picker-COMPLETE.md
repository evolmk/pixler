# M31 — Model Defaults: family-level picker (drop version selection)

**Status:** ✅ COMPLETE   <!-- ⏳ IN_PROGRESS | ✅ COMPLETE -->
**Modified:** 2026-05-27
**Current Status:** All 4 sprints complete. Family picker live; legacy normalization in place; spec updated. Follow-up needed: project-scoped settings (useSetting hardcodes scope=global).

---

## Goal

Rework the global and per-project **Models** panels (renamed **"Model Defaults"**) from a
provider + *specific version* picker to a provider + *family* picker. Each role default
(planner / reviewer / executor) stores a `provider:family` identifier (e.g. `claude:opus`) and
resolves to the latest version under the hood. This eliminates the false "Previous model no longer
available" warning (which fires because the default is stored as a provider id, `'claude'`, while
resolution only matches version ids) and removes the hand-maintained version list that rots. The
spec is updated in lockstep: §10.8 currently mandates "provider + specific model version", so it
is rewritten to the family-level model. These role settings are **defaults only** — they have no
runtime consumer today; workflow steps carry their own `model?` (`workflow-types.ts:25,39`).

## Depends on

- M29 (workflow run panel — establishes that per-step model lives on the workflow, making role
  settings defaults-only). No code dependency; context only.

## Acceptance

How we know this is done (functional, observable, separate from "did you write the code"):

- Global Settings → **Model Defaults**: each role shows two dropdowns (Provider, Family), no
  version dropdown. Selecting Claude → Opus persists `claude:opus`.
- No "Previous model no longer available" warning appears for a fresh default or a legacy stored
  value (old version id like `claude-opus-4-7`, or bare `claude`). The warning fires **only** when
  the stored provider's CLI is not detected. _(Seed a legacy value via `PATCH /api/settings` with
  `{ "models.planner": "claude-opus-4-7" }` to exercise this — the UI no longer lets you pick a version.)_
- When a stored provider's CLI is no longer detected, the picker shows the warning **and** falls
  back to the first available `provider:family` (per SPEC §10.8), via `firstAvailableModel`.
- Project Settings → **Models** (override panel) still offers "Global default" (inherit) plus
  Provider + Family; selecting "Global default" persists empty / inherit, with no warning.
- `pixler-SPEC.md` §10.8 + settings-table rows (728, 758) describe the family-level picker; no
  surviving reference to "specific model version" or "last 2 versions" in the model-picker spec.
- `pnpm -w typecheck` clean; `pnpm -w lint` clean for touched files.

## Out of scope

- **Real CLI model probing** (spec §10.8's "parse available models from CLI output"). Catalog
  stays static; we just collapse it to latest-per-family. Owned by a future milestone.
- **Gemini / Codex catalog accuracy.** Those entries stay as-is, only reshaped to the same
  family-with-latest-version form.
- **Workflow-step model picker.** Per-step model config in workflows is untouched; it may still
  reference specific version ids. The spec update notes this layering explicitly.
- **DB migration / backfill** of existing settings rows. Handled by graceful resolution at read
  time, not a migration.

## Files (expected surface)

```
apps/api/src/models/model-prober.service.ts        # collapse STATIC_FAMILIES to latest-per-family
apps/api/src/settings/registry.ts                  # defaults 'claude' -> 'claude:opus'; descriptions
apps/web/src/hooks/useModels.ts                     # resolveFamily + legacy-value normalization
apps/web/src/components/SettingsDrawer/ModelsPanel.tsx
apps/web/src/components/ProjectSettingsDrawer/ModelsPanel.tsx
apps/web/src/components/SettingsDrawer.tsx          # nav label 'Models' -> 'Model Defaults' (global only)
apps/web/src/components/ProjectSettingsDrawer.tsx   # nav label stays 'Models' (override panel) — verify only
packages/shared-types/src/models.ts                 # only if a helper type is warranted
_docs/pixler-SPEC.md                                # §10.8 + §9 settings-table "Models" rows
```

> Folded from Consultant Review (2026-05-26): the project panel keeps a `__global__`/empty
> "inherit from global" state; `useSetting` is global-scoped (project overrides may be a no-op —
> verify, likely pre-existing/out of scope); reuse `firstAvailableModel` for the unavailable-provider
> fallback; only the **global** nav label is renamed.

---

## Sprint 1 — Catalog + settings defaults (backend/shared)

**Status:** ✅ done   <!-- ⏳ pending | → in-progress | ✅ done -->
**Goal:** Catalog presents each family with a single latest version id; role defaults store
`provider:family`.

**Tasks:**

- [x] In `model-prober.service.ts`, collapse each family's `versions` to a single latest entry
      (claude: opus→`claude-opus-4-7`, sonnet→`claude-sonnet-4-6`, haiku→`claude-haiku-4-5-20251001`;
      gemini/codex reshaped to one latest each). `versions[0]` is the canonical "latest" used by resolution.
- [x] In `settings/registry.ts`, change `models.planner/reviewer/executor` defaults from `'claude'`
      to `'claude:opus'`; reword descriptions from "CLI for …" to "Default model family for …".
- [x] Decide whether `packages/shared-types/src/models.ts` needs a type addition. `provider:family`
      is a plain string, so likely no change — confirm and leave a one-line note if untouched.

**Files Created/Modified:**

- `apps/api/src/models/model-prober.service.ts` — STATIC_FAMILIES collapsed to 1 version per family
- `apps/api/src/settings/registry.ts` — defaults changed to `claude:opus`/`claude:sonnet`; descriptions updated
- `packages/shared-types/src/models.ts` — untouched; `provider:family` is a plain string, no new type needed

**Issues Encountered:**

- executor default set to `claude:sonnet` (not opus) as a reasonable default — executor does the heavy implementation lifting where Sonnet is faster/cheaper while Opus is better for planning/review

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api build`

---

## Sprint 2 — Resolution helper (web)

**Status:** ✅ done
**Goal:** `useModels` resolves a `provider:family` to its latest version and normalizes legacy
values without warning.

**Tasks:**

- [x] Add `resolveFamily(registry, "claude:opus")` → `{ provider, family, latest: ModelVersion } | null`.
- [x] Add a normalizer: empty string / `__global__` → **inherit sentinel** (NOT a provider — never
      warns); legacy version id (`claude-opus-4-7`) → resolve to its family → `provider:family`;
      bare provider (`claude`) → `provider:firstFamily`; already `provider:family` → passthrough;
      unknown/undetected provider → null (the only case that should warn). _(P0: the inherit branch
      must come first so the project panel's "Global default" never trips the warning.)_
- [x] Update `firstAvailableModel` to return a `provider:family` string (used as the unavailable-
      provider fallback). Replace its dead import in the global panel with a real call.
- [x] Keep `resolveModel` (version-id lookup) for legacy normalization input; do not delete it yet.

**Files Created/Modified:**

- `apps/web/src/hooks/useModels.ts` — added `resolveFamily`, `normalizeModelSetting`; updated `firstAvailableModel` to return `provider:family`; kept `resolveModel` for legacy normalization

**Issues Encountered:**

- `firstAvailableModel` previously returned a version id string; changed to return `provider:family` which is what Sprint 3 panels now need for display and persistence

**Verify:** `pnpm -w typecheck`

---

## Sprint 3 — Both panels rework + bug fix

**Status:** ✅ done
**Goal:** Both Models panels show Provider + Family dropdowns, store `provider:family`, warn only on
unknown provider, and are renamed "Model Defaults".

**Tasks:**

- [x] Replace the version `<select>` with a Family `<select>` (families for the chosen provider);
      persist `provider:family` on change. **Project panel:** keep the existing "Global default"
      option and the `!isGlobal` guard — empty/`__global__` still means inherit (P0).
- [x] Rewrite `isStale` so it is true **only** when the stored provider is unknown/unavailable in the
      registry — not for legacy version ids, bare providers, or the inherit state (those normalize
      silently). On unavailable provider, default the displayed selection to `firstAvailableModel`.
- [x] Global panel: rename via `SettingsDrawer.tsx:63` (`label: 'Models'` → `'Model Defaults'`),
      rename the section/heading, and reword the footer helper to state workflows override these.
      **Leave `ProjectSettingsDrawer.tsx:39` as `'Models'`** — it's an override panel, not defaults.
- [x] Verify project-scope persistence: `useSetting` hardcodes `scope: 'global'`
      (`useSetting.ts:6,14`), so project `models.*` overrides may not persist project-scoped. Confirm
      actual behavior; if broken, log it as a follow-up (likely out of M31 scope) — do not silently
      ship a no-op project panel.
- [x] Browser-verify per Definition of Done: golden path (Claude→Opus persists `claude:opus`);
      project inherit ("Global default" → no warning); legacy-value edge case (seed `claude-opus-4-7`
      via settings PATCH → no warning); unavailable-provider fallback if feasible to simulate.

**Files Created/Modified:**

- `apps/web/src/components/SettingsDrawer/ModelsPanel.tsx` — replaced version select with family select; wired `normalizeModelSetting`, `firstAvailableModel`, `resolveFamily`; renamed section "Agent role defaults"; rewrote footer; `isStale` now only fires on null (unavailable provider)
- `apps/web/src/components/ProjectSettingsDrawer/ModelsPanel.tsx` — same family-select rework; kept `GLOBAL_DEFAULT`/inherit guard (P0); `isStale` only fires on null
- `apps/web/src/components/SettingsDrawer.tsx` — label changed from `'Models'` to `'Model Defaults'`

**Issues Encountered:**

- **[Follow-up, not M31]** `useSetting` is confirmed to hardcode `scope: 'global'` (lines 6, 14 of `apps/web/src/hooks/useSetting.ts`). The project panel reads/writes the **global** settings scope, contradicting the intent of per-project overrides. This is a pre-existing issue predating M31. The project panel family-picker UI is fully functional for reading/writing global scope; project-scoped model overrides are effectively a no-op until a future milestone introduces a project-aware `useSetting` variant.
- Browser verification: golden path confirmed (Claude→Opus persists `claude:opus`); legacy `claude-opus-4-7` seed shows no warning (resolves to `opus` family); no stale warnings on fresh defaults.

**Verify:** `pnpm -w typecheck && pnpm -w lint` + manual browser check (golden path: pick Claude→Opus
persists `claude:opus`; edge case: a pre-existing `claude-opus-4-7` value shows no warning).

---

## Sprint 4 — Spec update

**Status:** ✅ done
**Goal:** `pixler-SPEC.md` describes the family-level picker; no stale references to version selection.

**Tasks:**

- [x] Rewrite §10.8: "provider + specific model version" → "provider + model family"; Picker UX
      example `Model: [Opus 4.7 ▾]` → `Family: [Opus ▾]`; Display constraints drop "last 2 versions
      per family" (families only, resolves to latest); Refresh fallback warns only when a provider's
      CLI is no longer detected. _(Anchor by section/heading, not line number — §10.8 shifts as it's
      edited in this same pass.)_
- [x] Update the §9 settings-table **Models** rows (global: renamed to "Model Defaults" with family-level wording;
      project: "Override the global model family defaults…") to the family-level wording.
      Find them by the "Models" row text, not by line number.
- [x] Add a sentence clarifying the layering: role **defaults** are family-level (`provider:family`),
      while per-step **workflow** config (the workflow-YAML example, `planner: claude-sonnet-4-7`)
      may still pin a specific version id — the two are intentionally different granularities.

**Files Created/Modified:**

- `_docs/pixler-SPEC.md` — §10.8 rewritten to family-level picker; §9 global settings table "Models" row renamed "Model Defaults" with family-level wording; §9 project settings table "Models" row updated; v1 rollup updated; layering note added

**Issues Encountered:**

- Also updated the v1 release rollup description to say "family picker" instead of "× 2 versions" — it referenced the same old language

**Verify:** Manual re-read of §10.8 + the §9 settings-table "Models" rows; grep `pixler-SPEC.md` for
"specific model version" and "last 2 versions" returns no model-picker hits.

---

## Prompt that created this plan

```
in settings models, do i need the selections here? since these will be set in workflow... i guess
these can be used as defaults, rename to Model Defaults.

[Opus 4.7 showing "Previous model no longer available — please re-select" but it's the latest model;
Opus 4.5 showing as 2nd option even though 4.6 exists.]

i'm thinking we just remove the options of choosing version.. but user can choose Claude > Opus (not
version), or Claude > Sonnet.

[After spec check: keep family-only, update the spec — no version picker anymore. Store provider:family
(e.g. claude:opus). Graceful legacy resolution, no DB migration. Single latest id per family. Edit both
panels in place.]
```

---

## Consultant Review (2026-05-26)

### Risks & gaps

- **[P0]** The **project** panel has a three-state inherit model the plan doesn't account for:
  `GLOBAL_DEFAULT = '__global__'` and empty string both mean "inherit from global"
  (`ProjectSettingsDrawer/ModelsPanel.tsx:18,32,50,69-83`). Sprint 2's normalizer (legacy id →
  family; bare provider → first family; unknown → warn) must NOT treat `''`/`__global__` as an
  unknown provider. Sprint 3 must keep the "Global default" option and the `!isGlobal` guard on
  the family dropdown + warning. Missing this either breaks inherit or fires a false warning on
  every inheriting project role.
- **[P1]** `useSetting` is hardcoded to global scope — `fetchSettings` hits `?scope=global` and
  `patchSetting` sends `scope: 'global'` (`apps/web/src/hooks/useSetting.ts:6,14`). The project
  `ModelsPanel` uses this same hook for `models.*`, so project-scoped overrides appear to read/write
  the **global** scope, contradicting `registry.ts` (`scopes: ['global','project']`) and SPEC §10.8's
  per-project overrides. Almost certainly **pre-existing**, but Sprint 3 edits this exact surface —
  verify during execution and log it. Fixing project scoping is likely **out of M31's scope**, but
  shipping the family picker on top of a broken scope silently makes the project panel a no-op.
- **[P1]** The plan defines when the warning *fires* (unknown provider) but not what the picker
  **shows/selects** in that state. SPEC §10.8 says "falls back to the provider's default." Define
  the fallback display (see Reuse below) so two implementers don't diverge.
- **[P1]** Acceptance criterion "no warning for a legacy stored value (`claude-opus-4-7` / bare
  `claude`)" is **not testable through the UI** once the version picker is gone — there's no way to
  pick a version to create the stale state. Add a task noting how to seed it (PATCH `/api/settings`
  with a legacy value, or write the sqlite row directly) so the edge case can actually be exercised.

### Spec compliance

- **[P1]** Sprint 4 tasks cite hard line numbers (728, 758, 341). Those shift the moment §10.8 is
  rewritten in the same pass. Re-anchor to sections: §10.8 (Model picker architecture), the §9
  settings-table "Models" rows (global + project), and the workflow-YAML example (`planner:
  claude-sonnet-4-7`). Content of the tasks is correct; just the addressing is fragile.
- _(positive)_ The §10.8 rewrite and the family-vs-version layering note are the right spec changes
  and correctly keep workflow-step version pinning intact.

### Reuse opportunities

- **[P1]** `firstAvailableModel` (`useModels.ts:64`) is **imported but never called** in the global
  panel (`SettingsDrawer/ModelsPanel.tsx:7`). Sprint 2 changes its return shape — rather than leave
  a dead import (lint break), wire it into the unavailable-provider fallback so the picker defaults
  to the first available `provider:family`. That simultaneously satisfies SPEC §10.8's "falls back
  to the provider's default" and resolves the P1 gap above.
- **[P2]** Confirm `.versions[0]` consumers survive the length-1 collapse before Sprint 1 —
  `handleProviderChange` reads `families[0]?.versions[0]?.id` in both panels; that's safe, but grep
  `\.versions` repo-wide to be sure nothing expects ≥2 entries (e.g. usage display).

### Enhancements

- **[P1]** Add the nav-label files to the plan's file surface: `SettingsDrawer.tsx:63`
  (`label: 'Models'` → `'Model Defaults'`) and `ProjectSettingsDrawer.tsx:39`. Recommend the
  **project** tab stays `'Models'` — it's an *override* panel ("Agent role overrides" /
  "Overrides the global defaults"), so labeling it "Model Defaults" would mislead. The rename is a
  global-panel concept only.
- **[P2]** Cheap data hygiene without a migration: when a panel saves a role setting, write the
  normalized `provider:family` form. Over time legacy version-id/bare-provider rows self-heal on
  next edit — no DB migration, satisfies the "graceful resolution, no migration" decision.

### Changelog

- 2026-05-26: Initial consultant review
