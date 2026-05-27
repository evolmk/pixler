# M31 — Model Defaults: family-level picker (drop version selection)

**Status:** ⏳ IN_PROGRESS   <!-- ⏳ IN_PROGRESS | ✅ COMPLETE -->
**Modified:** 2026-05-26
**Current Status:** Plan written, not started. Awaiting execution-mode choice.

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
  the stored provider's CLI is not detected.
- Project Settings → **Model Defaults** behaves identically.
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
packages/shared-types/src/models.ts                 # only if a helper type is warranted
_docs/pixler-SPEC.md                                # §10.8 + settings table rows 728/758
```

---

## Sprint 1 — Catalog + settings defaults (backend/shared)

**Status:** ⏳ pending   <!-- ⏳ pending | → in-progress | ✅ done -->
**Goal:** Catalog presents each family with a single latest version id; role defaults store
`provider:family`.

**Tasks:**

- [ ] In `model-prober.service.ts`, collapse each family's `versions` to a single latest entry
      (claude: opus→`claude-opus-4-7`, sonnet→`claude-sonnet-4-6`, haiku→`claude-haiku-4-5-20251001`;
      gemini/codex reshaped to one latest each). `versions[0]` is the canonical "latest" used by resolution.
- [ ] In `settings/registry.ts`, change `models.planner/reviewer/executor` defaults from `'claude'`
      to `'claude:opus'`; reword descriptions from "CLI for …" to "Default model family for …".
- [ ] Decide whether `packages/shared-types/src/models.ts` needs a type addition. `provider:family`
      is a plain string, so likely no change — confirm and leave a one-line note if untouched.

**Files Created/Modified:** _(append as you touch them)_

- _none yet_

**Issues Encountered:** _(append surprising things + their resolution)_

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api build`

---

## Sprint 2 — Resolution helper (web)

**Status:** ⏳ pending
**Goal:** `useModels` resolves a `provider:family` to its latest version and normalizes legacy
values without warning.

**Tasks:**

- [ ] Add `resolveFamily(registry, "claude:opus")` → `{ provider, family, latest: ModelVersion } | null`.
- [ ] Add a normalizer: legacy version id (`claude-opus-4-7`) → resolve to its family → `provider:family`;
      bare provider (`claude`) → `provider:firstFamily`; already `provider:family` → passthrough;
      unknown provider → null (the only case that should warn).
- [ ] Update `firstAvailableModel` to return a `provider:family` string (used as fallback when a
      provider becomes unavailable).
- [ ] Keep `resolveModel` (version-id lookup) for legacy normalization input; do not delete it yet.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck`

---

## Sprint 3 — Both panels rework + bug fix

**Status:** ⏳ pending
**Goal:** Both Models panels show Provider + Family dropdowns, store `provider:family`, warn only on
unknown provider, and are renamed "Model Defaults".

**Tasks:**

- [ ] Read `ProjectSettingsDrawer/ModelsPanel.tsx` to confirm it mirrors the global panel; apply the
      same edits to both (in place — no shared-component extraction).
- [ ] Replace the version `<select>` with a Family `<select>` (families for the chosen provider);
      persist `provider:family` on change.
- [ ] Rewrite `isStale` so it is true **only** when the stored provider is unknown/unavailable in the
      registry — not for legacy version ids or bare providers (those normalize silently).
- [ ] Rename the panel heading/section to **"Model Defaults"**; reword the footer helper to state
      workflows override these defaults.
- [ ] Browser-verify (golden path + legacy-value edge case) per Definition of Done.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint` + manual browser check (golden path: pick Claude→Opus
persists `claude:opus`; edge case: a pre-existing `claude-opus-4-7` value shows no warning).

---

## Sprint 4 — Spec update

**Status:** ⏳ pending
**Goal:** `pixler-SPEC.md` describes the family-level picker; no stale references to version selection.

**Tasks:**

- [ ] Rewrite §10.8: "provider + specific model version" → "provider + model family"; Picker UX
      example `Model: [Opus 4.7 ▾]` → `Family: [Opus ▾]`; Display constraints drop "last 2 versions
      per family" (families only, resolves to latest); Refresh fallback warns only when a provider's
      CLI is no longer detected.
- [ ] Update settings-table row 728 ("top 3 families × last 2 versions each, probed from installed
      CLIs") and project row 758 to the family-level wording.
- [ ] Add a sentence clarifying the layering: role **defaults** are family-level (`provider:family`),
      while per-step **workflow** config (§4.2 / YAML example near line 341) may still pin a specific
      version id — the two are intentionally different granularities.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** Manual re-read of §10.8 + rows 728/758; grep `pixler-SPEC.md` for "specific model version"
and "last 2 versions" returns no model-picker hits.

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
