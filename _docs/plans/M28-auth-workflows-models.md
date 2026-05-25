# M28 — Auth, Workflow Engine & Model Picker

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-25
**Current Status:** Sprint 2 (auth UI) complete — starting Sprint 3 (model prober backend)

---

## Goal

Three interconnected features that upgrade Pixler from v1-hardcoded to v1-configurable:

1. **OAuth auth for Linear + three-method auth for GitHub** (OAuth / PAT / gh CLI) with mutual exclusivity and soft-disconnect (deactivate, not delete). Per §6.2, §7.1 of the spec.
2. **YAML-driven workflow engine** replacing the hardcoded orchestrator state machine. Per §4A and `_docs/spec-workflow-engine.md`.
3. **Provider + model picker** with CLI probing, top 3 families × 2 versions per provider, and a refresh button. Per §10.8.

## Depends on

- M10 (Linear SDK — existing Linear service)
- M12 (GitHub gh — existing GitHub service)
- M13 (Orchestrator — state machine being replaced/extended)
- M05 (SQLite + settings — settings infrastructure)
- M21 (Onboarding — updating onboarding steps)

## Acceptance

- User can connect to Linear via OAuth (redirect flow) or PAT, and switch between them after disconnecting the active method.
- User can connect to GitHub via OAuth, PAT, or gh CLI, with the same mutual-exclusivity UX.
- Disconnecting a method deactivates the credential (does not delete it). User can manually remove via "Remove key" button.
- Settings → Models shows providers with detected CLIs, top 3 model families × 2 versions each, and a working "Refresh models" button.
- A `feature.yaml`, `bugfix.yaml`, and `quickfix.yaml` workflow ship as built-in defaults.
- Settings → Workflows lists workflows, allows editing YAML, duplicating, and archiving.
- Workflow runner executes a YAML workflow end-to-end (review_issue → create_plan → approve_plan → implement → qa_review → open_pr for feature type).
- Onboarding steps 2 and 3 show the new auth options.
- `pnpm -w typecheck` clean.

## Out of scope

- Headless mode / Agent SDK (v2)
- GitHub webhooks for real-time CI (v2)
- MCP server config per repo (v3)
- Google Drive / S3 storage provider implementation (just the config UI + local provider)
- Mobile companion
- Parallel/DAG step execution in workflows (linear-only in v1)

## Files (expected surface)

```
# Auth
apps/api/src/auth/                           # new module: OAuth callback routes
apps/api/src/auth/auth.module.ts
apps/api/src/auth/auth.controller.ts         # GET /auth/linear/callback, GET /auth/github/callback
apps/api/src/auth/oauth-linear.service.ts
apps/api/src/auth/oauth-github.service.ts
apps/api/src/linear/linear.service.ts        # extend: support OAuth token alongside PAT
apps/api/src/linear/secret-store.service.ts  # extend: auth method tracking, soft-disconnect
apps/api/src/github/github.service.ts        # extend: support OAuth/PAT alongside gh CLI
apps/api/src/github/github-auth.service.ts   # new: GitHub auth method management
apps/web/src/components/SettingsDrawer/LinearPanel.tsx    # redesign: PAT + OAuth toggle
apps/web/src/components/SettingsDrawer/GitHubPanel.tsx    # new: GitHub auth settings panel
apps/web/src/components/SettingsDrawer.tsx                # add GitHub category
apps/web/src/hooks/useLinear.ts              # extend: OAuth mutations
apps/web/src/hooks/useGithubAuth.ts          # new: GitHub auth hooks
packages/shared-types/src/index.ts           # new DTOs: auth method types

# Model picker
apps/api/src/models/                         # new module
apps/api/src/models/models.module.ts
apps/api/src/models/model-prober.service.ts  # probes claude/codex/gemini CLIs
apps/api/src/models/models.controller.ts
apps/web/src/components/SettingsDrawer/ModelsPanel.tsx              # redesign: provider+model picker
apps/web/src/components/ProjectSettingsDrawer/ModelsPanel.tsx       # redesign: provider+model picker
apps/web/src/hooks/useModels.ts              # new: model registry hooks
packages/shared-types/src/index.ts           # new DTOs: ModelFamily, ModelVersion, ModelRegistry

# Workflow engine
packages/orchestrator/src/workflow-runner.ts        # new: YAML workflow interpreter
packages/orchestrator/src/workflow-loader.ts        # new: discovers + loads YAML files
packages/orchestrator/src/workflow-types.ts         # new: TypeScript types for workflow YAML
apps/api/src/orchestrator/orchestrator.service.ts   # extend: delegate to WorkflowRunner
apps/api/src/workflows/                             # new module
apps/api/src/workflows/workflows.module.ts
apps/api/src/workflows/workflows.service.ts         # CRUD for workflow files
apps/api/src/workflows/workflows.controller.ts
apps/api/src/workflows/storage-provider.service.ts  # local storage provider
apps/web/src/components/SettingsDrawer/WorkflowsPanel.tsx   # new: workflow editor UI
apps/web/src/hooks/useWorkflows.ts                  # new: workflow CRUD hooks
packages/shared-types/src/index.ts                  # new DTOs: WorkflowDef, WorkflowStep

# Built-in workflow files
apps/api/workflows/defaults/feature.yaml
apps/api/workflows/defaults/bugfix.yaml
apps/api/workflows/defaults/quickfix.yaml

# Onboarding updates
apps/web/src/components/OnboardingDrawer.tsx  # extend steps 2 + 3
```

---

## Sprint 1 — Auth infrastructure (backend)

**Status:** ✅ complete
**Goal:** Build the NestJS auth module with OAuth callback routes for Linear and GitHub, extend SecretStoreService for auth method tracking, and add soft-disconnect logic.

**Tasks:**

- [x] Create `apps/api/src/auth/auth.module.ts` — registers the auth controller and OAuth services
- [x] Create `apps/api/src/auth/auth.controller.ts` — `GET /auth/linear/callback` and `GET /auth/github/callback` routes that handle OAuth code exchange
- [x] Create `apps/api/src/auth/oauth-linear.service.ts` — Linear OAuth PKCE flow: build auth URL, exchange code for tokens, refresh token rotation, store via SecretStoreService
- [x] Create `apps/api/src/auth/oauth-github.service.ts` — GitHub OAuth PKCE flow: build auth URL, exchange code for tokens, store via SecretStoreService
- [x] Extend `SecretStoreService` to track auth method per service (`linear.authMethod`, `github.authMethod`) and support soft-disconnect (set credential to inactive without deleting)
- [x] Extend `LinearService` — `getClient()` checks active auth method and uses OAuth token or PAT accordingly
- [x] Create `apps/api/src/github/github-auth.service.ts` — manages GitHub auth method switching (CLI / OAuth / PAT), provides authenticated Octokit instance for OAuth/PAT modes
- [x] Extend `GithubService.getAuthStatus()` — report which method is active and its status
- [x] Add `@octokit/rest` to `apps/api/package.json` for OAuth/PAT GitHub API calls
- [x] Add shared-types DTOs: `AuthMethod`, `LinearAuthStatus` (extends current with `authMethod` field), `GithubAuthStatus` (extends with `authMethod` field)
- [x] Wire `AuthModule` into `AppModule`

**Files Created/Modified:**

- `packages/shared-types/src/auth.ts` — new: AuthMethod, OAuthInitDto, ConnectGithubPATDto, DisconnectAuthDto
- `packages/shared-types/src/linear.ts` — extended LinearStatusDto with authMethod
- `packages/shared-types/src/github.ts` — extended GithubAuthStatus with authMethod
- `packages/shared-types/src/index.ts` — exported new auth types
- `apps/api/src/auth/auth.module.ts` — new
- `apps/api/src/auth/auth.controller.ts` — new: /auth/linear/*, /auth/github/* routes
- `apps/api/src/auth/oauth-linear.service.ts` — new: Linear OAuth PKCE flow
- `apps/api/src/auth/oauth-github.service.ts` — new: GitHub OAuth flow
- `apps/api/src/linear/secret-store.service.ts` — extended: getAuthMethod, setAuthMethod, softDisconnect
- `apps/api/src/linear/linear.service.ts` — extended: OAuth token support, soft/hard disconnect
- `apps/api/src/linear/linear.module.ts` — exports SecretStoreService
- `apps/api/src/github/github-auth.service.ts` — new: GithubAuthService
- `apps/api/src/github/github.service.ts` — extended: getAuthStatus reports active method
- `apps/api/src/github/github.module.ts` — imports LinearModule, adds GithubAuthService
- `apps/api/src/app.module.ts` — imports AuthModule

**Issues Encountered:**

- LinearStatusDto.authMethod typed as 'pat'|'oauth'|null; narrowed in status() to exclude 'cli'

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api test`

---

## Sprint 2 — Auth UI (frontend)

**Status:** ✅ complete
**Goal:** Redesign LinearPanel with PAT + OAuth toggle, create GitHubPanel with 3-method picker, update SettingsDrawer to include GitHub category, update onboarding steps 2 + 3.

**Tasks:**

- [x] Redesign `LinearPanel.tsx` — show both PAT and OAuth options; active method highlighted, alternatives greyed out with "Disconnect current method to switch" hint; disconnect button deactivates (doesn't delete); "Remove key" button next to stored credentials
- [x] Create `GitHubPanel.tsx` — three auth methods (gh CLI / OAuth / PAT) with same mutual-exclusivity UX; OAuth "Connect with GitHub" button triggers redirect; PAT field for manual entry; gh CLI shows current `gh auth status`
- [x] Add GitHub category to `SettingsDrawer.tsx` CATEGORIES array (between Linear and Git)
- [x] Create `useGithubAuth.ts` hook — mutations for connect (OAuth initiate, PAT submit), disconnect, remove; queries for auth status
- [x] Extend `useLinear.ts` — add `useLinearOAuthUrl` mutation (gets the OAuth initiate URL from backend), update `useConnectLinear` to support both methods
- [x] Update `OnboardingDrawer.tsx` Step 2 — add GitHub OAuth + PAT options alongside gh CLI
- [x] Update `OnboardingDrawer.tsx` Step 3 — add "Connect with Linear" OAuth button alongside PAT field
- [x] Update `ProvidersPanel.tsx` — remove GitHub auth status display (now in dedicated GitHubPanel)

**Files Created/Modified:**

- `apps/web/src/hooks/useLinear.ts` — extended: socket invalidation, useLinearOAuthUrl, useRemoveLinearCredential, soft-disconnect endpoint
- `apps/web/src/hooks/useGithubAuth.ts` — new: GitHub auth hooks (status, OAuth URL, PAT connect, disconnect, remove)
- `apps/web/src/components/SettingsDrawer/LinearPanel.tsx` — redesigned: OAuth + PAT sections, method badge, Remove key buttons
- `apps/web/src/components/SettingsDrawer/GitHubPanel.tsx` — new: 3-method panel (gh CLI / OAuth / PAT)
- `apps/web/src/components/SettingsDrawer.tsx` — GitHub category added
- `apps/web/src/components/Onboarding/Step2Tools.tsx` — GithubAuthSection added
- `apps/web/src/components/Onboarding/Step3Linear.tsx` — OAuth button + separator added
- `apps/web/src/components/SettingsDrawer/ProvidersPanel.tsx` — GitHub auth display removed
- `packages/shared-types/src/linear.ts` — storedMethods field
- `packages/shared-types/src/github.ts` — storedMethods field
- `apps/api/src/linear/linear.service.ts` — storedMethods in status()
- `apps/api/src/github/github-auth.service.ts` — getStoredMethods()
- `apps/api/src/github/github.service.ts` — storedMethods in getAuthStatus()

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck && pnpm -w dev` — manually test Linear OAuth flow, GitHub OAuth flow, PAT entry, disconnect/reconnect cycle

---

## Sprint 3 — Model prober service (backend)

**Status:** ⏳ pending
**Goal:** Build the model prober service that discovers available models by probing installed CLIs, caches results in SQLite, and exposes a REST + Socket.io API.

**Tasks:**

- [ ] Create `apps/api/src/models/models.module.ts` — registers prober service and controller
- [ ] Create `apps/api/src/models/model-prober.service.ts` — probes `claude`, `codex`, `gemini` CLIs to discover available model families and versions; parses CLI output; returns structured `ModelRegistry` with top 3 families × 2 versions per provider; caches in SQLite `model_registry` table with timestamp
- [ ] Create `apps/api/src/models/models.controller.ts` — `GET /models` returns cached registry; `POST /models/refresh` re-probes and returns updated registry; emits `models:updated` Socket.io event on refresh
- [ ] Add SQLite migration for `model_registry` table (provider, family, version, model_id, probed_at)
- [ ] Add shared-types DTOs: `ModelFamily`, `ModelVersion`, `ModelRegistryDto`, `ProviderModels`
- [ ] Wire `ModelsModule` into `AppModule`

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api test` — verify model prober returns structured data for at least `claude` CLI

---

## Sprint 4 — Model picker UI (frontend)

**Status:** ⏳ pending
**Goal:** Redesign both global and project-level ModelsPanel with two-step provider + model picker, refresh button, and workflow-step-aware role assignments.

**Tasks:**

- [ ] Create `useModels.ts` hook — `useModelRegistry` query (fetches `GET /models`), `useRefreshModels` mutation (`POST /models/refresh`), listens for `models:updated` Socket.io event to invalidate cache
- [ ] Redesign global `SettingsDrawer/ModelsPanel.tsx` — provider dropdown (only shows providers with detected CLIs) + model dropdown (filtered to selected provider's families/versions, grouped by family); "Refresh models" button with spinner; warning badge if previously selected model no longer available
- [ ] Redesign project `ProjectSettingsDrawer/ModelsPanel.tsx` — same provider+model picker pattern with "Use global default" option per role
- [ ] Ensure both panels show per-workflow-step role assignments (planner, reviewer, executor) with the two-step picker for each

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w dev` — manually verify model picker shows detected models, refresh button works, per-role assignments persist

---

## Sprint 5 — Workflow engine core (packages/orchestrator)

**Status:** ⏳ pending
**Goal:** Build the workflow runner, loader, and type system in the orchestrator package. Ship the 3 built-in workflow presets.

**Tasks:**

- [ ] Create `packages/orchestrator/src/workflow-types.ts` — TypeScript types for workflow YAML: `WorkflowDef`, `WorkflowStep`, `StepType`, `ConditionalFields`, `TemplateVariables`
- [ ] Create `packages/orchestrator/src/workflow-loader.ts` — discovers workflow YAML files from three locations (built-in defaults, repo `.pixler/workflows/`, user `~/.config/pixler/workflows/`); resolves priority order (repo > user > built-in); parses YAML with `js-yaml`; validates against TypeScript types
- [ ] Create `packages/orchestrator/src/workflow-runner.ts` — `WorkflowRunner` class: takes a `WorkflowDef` + issue context; executes steps sequentially; handles `approval` step pauses (emits event, waits for resolution); handles `skip_if` evaluation; handles `on_error` (fail/skip/retry); emits step-start/step-complete/step-error events via callback
- [ ] Create 3 built-in workflow YAML files: `apps/api/workflows/defaults/feature.yaml`, `bugfix.yaml`, `quickfix.yaml` per `_docs/spec-workflow-engine.md`
- [ ] Add `js-yaml` + `@types/js-yaml` to `packages/orchestrator/package.json`
- [ ] Export `WorkflowRunner`, `WorkflowLoader`, and types from `packages/orchestrator/src/index.ts`
- [ ] Add shared-types DTOs: `WorkflowDefDto`, `WorkflowStepDto`, `WorkflowStatusDto`

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/orchestrator test` — unit tests for workflow loader (discovers + parses built-in YAMLs) and workflow runner (executes steps, handles approval pause, handles skip_if)

---

## Sprint 6 — Workflow backend integration (apps/api)

**Status:** ⏳ pending
**Goal:** Create the workflows API module, integrate WorkflowRunner into the orchestrator service, and add storage provider service.

**Tasks:**

- [ ] Create `apps/api/src/workflows/workflows.module.ts` — registers workflows service and controller
- [ ] Create `apps/api/src/workflows/workflows.service.ts` — CRUD for workflow files: list all discovered workflows, read YAML, write (save user-global), duplicate, archive (set `archived: true`)
- [ ] Create `apps/api/src/workflows/workflows.controller.ts` — REST endpoints: `GET /workflows`, `GET /workflows/:name`, `PUT /workflows/:name`, `POST /workflows/:name/duplicate`, `PATCH /workflows/:name/archive`
- [ ] Create `apps/api/src/workflows/storage-provider.service.ts` — reads `~/.config/pixler/storage.yaml`; implements local storage provider (write plan to configured local path); stub interface for future S3/GDrive
- [ ] Extend `apps/api/src/orchestrator/orchestrator.service.ts` — when starting a workspace, check if a workflow YAML matches the issue label; if found, delegate to `WorkflowRunner` instead of hardcoded state machine; if not found, fall back to existing behavior
- [ ] Wire `WorkflowsModule` into `AppModule`

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api test` — verify workflow CRUD endpoints return correct data, orchestrator delegates to WorkflowRunner for labeled issues

---

## Sprint 7 — Workflow UI + final wiring

**Status:** ⏳ pending
**Goal:** Build the Settings → Workflows panel (list, edit, duplicate, archive), the New Task modal workflow selection, and the in-execution workflow step indicator.

**Tasks:**

- [ ] Create `useWorkflows.ts` hook — queries for workflow list, single workflow read; mutations for save, duplicate, archive; cache invalidation
- [ ] Create `SettingsDrawer/WorkflowsPanel.tsx` — lists all discovered workflows grouped by source (built-in / repo / user); shows name, step count, last modified; Edit opens YAML text editor (syntax highlighted via Shiki); Duplicate button; Archive button; "New Workflow" button (blank template or copy built-in)
- [ ] Add Workflows category to `SettingsDrawer.tsx` CATEGORIES array
- [ ] Extend New Workspace dialog (or New Task modal) — after issue is selected, show workflow auto-selection from label with dropdown override; show workflow preview (list of steps with model assignments)
- [ ] Add workflow step indicator to the workspace's left sidebar or panel — highlights the active step during execution; shows completed/pending/skipped states
- [ ] Integrate `approval` step pause into existing approval gate UI — when WorkflowRunner pauses at an approval step, surface the Approve/Edit/Cancel card in the workspace

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w dev` — manually test: create workspace from Linear ticket with "feature" label → workflow auto-selects → steps execute in order → approval step pauses → approve → continues → PR opens

---

## Prompt that created this plan

```
when setting up linear, id like to also have an oauth method, also with github (oauth or api).  if user set api key and wants to use oauth, user must disconnect / remove key.. do same for linear.

where i can set different agent roles for all workflow types, user should be able to setect provider + pick a model, restrict models to their top 3 most recent models (and last 2 versions if supported).. so if select Claude, can pick Opus (4.7 or 4.6), Sonnet (last 2 version), Haiku (last 2 version)  etc...  versions should auto-sync, but have a refresh button that can fetch in that panel.

update spec first then create plan
```
