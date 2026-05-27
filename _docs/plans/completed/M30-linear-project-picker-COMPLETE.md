# M30 — Linear project linking & issue picker

**Status:** ✅ COMPLETE
**Modified:** 2026-05-26
**Current Status:** All 4 sprints complete. typecheck + lint clean.

---

## Goal

Replace the free-text "Ticket ID" input in `NewWorkspaceDialog` with a searchable picker fed by a
**per-project Linear project link** stored as a project setting (`linear.projectId`, reusing the
existing `useSetting` pattern alongside the established `linear.team`). Surface OAuth
configuration errors clearly (currently the "Connect with Linear" button silently 401s when
`PIXLER_LINEAR_CLIENT_ID` is missing) via `toast.error` from `@pixler/ui/components/sonner`. Add
disconnect affordances for the global Linear credential (Settings) and for the per-project Linear
team/project link (Project Settings → Integrations, extending the existing `IntegrationsPanel`).
Widen both Settings drawers to `sm:max-w-4xl` and expand their nav rails from icon-only (`w-14`)
to icon + label (`w-44`). Also fix the `NewWorkspaceDialog` "Waiting for setup script…" race
discovered in the original audit (Sprint 4).

The link is set during project creation (optional, skippable) and editable from Project Settings
→ Integrations. The picker offers an inline "Create new Linear issue…" action that extends
`LinearMutationsService` (the service already wraps `client.createIssue`) plus a new controller
route. The picker reuses the existing `GET /linear/projects?teamId=` and `useLinearProjects(teamId)`
hook — those already ship.

## Depends on

- M10-linear-sdk (Linear API client + OAuth + PAT flows)
- M11-linear-cli (Linear ticket model + storage)
- M07-projects (projects table + `NewProjectDialog`)
- M21-onboarding (`Step3Linear` connect flow as reference UX)

## Acceptance

- Clicking "Connect with Linear" with `PIXLER_LINEAR_CLIENT_ID` unset shows a `toast.error`
  (via `@pixler/ui/components/sonner`) naming the missing env var and linking to docs; the
  button is no longer silently broken.
- `NewProjectDialog` adds a `'link-linear'` step *after* project creation, before `'done'`. If
  Linear is connected, it shows a `LinearProjectPicker` (team selector + project list). If not
  connected, it shows a "Connect Linear" CTA. Both paths offer a "Skip — link later" button.
- `NewWorkspaceDialog`'s Ticket ID field is replaced by:
  - a cmdk-style combobox listing issues from the project's linked Linear project (identifier +
    title + state badge + assignee), **if** `linear.projectId` is set on the project;
  - a sticky top-of-list "Create new issue…" action that opens `CreateLinearIssueDialog` and,
    on success, selects the new issue and populates `ticketId` with the new issue's
    **`identifier`** (e.g. `ENG-101`), not its GraphQL id;
  - a fallback free-text input + inline "Link Linear project →" CTA (opens Project Settings →
    Integrations) when no `linear.projectId` is set.
- `SettingsDrawer` → Linear panel: "Disconnect" + per-credential "Remove key" buttons are
  visible/working when `storedMethods` includes `oauth` or `pat`. (Most of this is already
  wired — verify and patch gaps.)
- `IntegrationsPanel.tsx` (existing per-project Integrations panel) gains a "Linear project"
  sub-section under the existing team selector, showing the linked project (name) with
  "Change project" (re-opens picker) and "Unlink" (clears `linear.projectId`).
- Both Settings drawers widened from `sm:max-w-[480px]` to `sm:max-w-4xl`. Nav rail grows from
  `w-14` (icon-only + tooltip) to `w-44` (icon + label), tooltips removed.
- The `NewWorkspaceDialog` "Waiting for setup script…" race is fixed: the dialog closes within
  ~1s when the workspace reaches `ready` even if the state-changed event fires before the
  subscription registers (Sprint 4).
- `pnpm -w typecheck` and `pnpm -w lint` clean.
- Manual browser walk-through in `lazar-ui` passes: project linked → new workspace → pick issue
  from list → workspace created with the ticket identifier populated. **OAuth handshake is
  user-driven** — agent stops and asks per `CLAUDE.md`.

## Out of scope

- Shipping real Linear OAuth credentials (env vars stay user-supplied; the fix is the error UX,
  not the credentials themselves).
- A new workflow step type for issue creation (`linear.create-issue`) — issue creation lives only
  in the picker for this milestone.
- Background polling/auto-sync of Linear issues — picker fetches on demand with server-side
  search.
- Editing existing Linear issues from Pixler (state, labels, comments — those endpoints exist
  already; this milestone only reads + creates).
- Changes to the global `OnboardingShell` 5-step wizard. Per-project linking happens in
  `NewProjectDialog`, not in `OnboardingShell`.
- Multi-team or multi-Linear-org support per project (one team + one project per Pixler
  project).
- Schema migration for Linear link — using per-project settings (`useSetting`) instead, no new
  SQLite columns.
- Agent-facing Linear issue creation. SPEC §64–65 requires that path to go through the
  `pixler-linear` CLI for token cost reasons; this milestone only adds the user-facing SDK path.

## Files (expected surface)

```
apps/api/src/linear/linear.controller.ts                           (modify — add GET /issues, POST /issues)
apps/api/src/linear/linear.service.ts                              (modify — listIssues({teamId, projectId, q, limit, after}))
apps/api/src/linear/linear-mutations.service.ts                    (modify — extend createIssue to accept title+description)

packages/shared-types/src/linear.ts                                (modify — LinearIssueSummaryDto, CreateLinearIssueDto)

apps/web/src/hooks/useLinear.ts                                    (modify — useLinearIssues, useCreateLinearIssue, OAuth-url error surface)
apps/web/src/hooks/useProjectLinearLink.ts                         (new — wraps useSetting('linear.team') + useSetting('linear.projectId'))
apps/web/src/hooks/useWorkspaceEvents.ts                           (modify — Sprint 4: replay or refetch on subscribe)
apps/web/src/components/NewProjectDialog.tsx                       (modify — add 'link-linear' step)
apps/web/src/components/NewWorkspaceDialog.tsx                     (modify — picker, fallback, race fix)
apps/web/src/components/LinearIssuePicker.tsx                      (new — cmdk over useLinearIssues, debounced search)
apps/web/src/components/LinearProjectPicker.tsx                    (new — team select + cmdk over useLinearProjects)
apps/web/src/components/CreateLinearIssueDialog.tsx                (new — title + description form)
apps/web/src/components/SettingsDrawer.tsx                         (modify — sm:max-w-4xl, nav w-44 + label)
apps/web/src/components/ProjectSettingsDrawer.tsx                  (modify — sm:max-w-4xl, nav w-44 + label)
apps/web/src/components/SettingsDrawer/LinearPanel.tsx             (modify — OAuth error toast)
apps/web/src/components/SettingsDrawer/IntegrationsPanel.tsx       (modify — Linear project sub-section + Unlink)
apps/web/src/components/Onboarding/Step3Linear.tsx                 (modify — mirror OAuth error toast)
```

**Not touched** (intentionally — already exist, reuse):
- `GET /linear/projects` (linear.controller.ts:38) + `useLinearProjects(teamId)` (useLinear.ts) — already shipping.
- `LinearService.fetchTicket(identifier)` for workflow-time ticket resolution — keeps the free-text fallback workable.
- `PatchProjectDto` / `projects.repository.ts` — no project schema changes.

---

## Sprint 1 — Surface OAuth errors + verify Linear disconnect + widen Settings drawers

**Status:** ✅ complete
**Goal:** Make the existing "Connect with Linear" button non-broken via a sonner toast, verify
the already-wired Disconnect affordances render correctly per `storedMethods`, and grow both
Settings drawers from `sm:max-w-[480px]` / `w-14` icon-only nav → `sm:max-w-4xl` / `w-44` icon +
label nav. No API changes, no schema changes.

**Tasks:**

- [x] Update `useLinearOAuthUrl` (`apps/web/src/hooks/useLinear.ts:109`) to parse the error
  envelope per `apps/web/CLAUDE.md` (`err?.error?.message`) and call
  `toast.error(message, { description: '…' })` from `@pixler/ui/components/sonner` on failure.
  Include `PIXLER_LINEAR_CLIENT_ID` in the toast body so the user knows the env var to set.
- [x] In `LinearPanel.tsx`, also render an inline error beneath the OAuth button when
  `oauthUrl.error` is set, with a link to setup docs. Toast + inline so the user can't miss it.
- [x] Mirror the same `toast.error` + inline render in `Onboarding/Step3Linear.tsx`.
- [x] Audit `LinearPanel.tsx` Disconnect wiring: `useDisconnectLinear` (line 38) and
  `useRemoveLinearCredential` (line 39) already exist and render at lines 86 + 122. Verify both
  render correctly when `storedMethods` is non-empty, fix gaps if any. (Goal of this task is
  verification — no new mechanism if the wiring already works.)
- [x] `SettingsDrawer.tsx`: `DrawerContent` className `sm:max-w-[480px]` → `sm:max-w-4xl`;
  nav className `w-14` → `w-44`; drop the `Tooltip` wrappers and render each `cat.label` next to
  the icon (`<cat.icon /> <span>{cat.label}</span>`). Buttons grow from `size="icon-sm"` to the
  default size; verify all 17 categories fit at the new width.
- [x] `ProjectSettingsDrawer.tsx`: same treatment (`sm:max-w-4xl`, `w-44`, label next to icon,
  remove tooltips).

**Files Created/Modified:**

- `apps/web/src/hooks/useLinear.ts` — `useLinearOAuthUrl`: parse error envelope, `onError` → `toast.error` naming `PIXLER_LINEAR_CLIENT_ID`
- `apps/web/src/components/SettingsDrawer/LinearPanel.tsx` — inline error block under OAuth button
- `apps/web/src/components/Onboarding/Step3Linear.tsx` — same inline error block
- `apps/web/src/components/SettingsDrawer.tsx` — `sm:max-w-4xl`, `w-44` nav, icon+label, tooltips removed
- `apps/web/src/components/ProjectSettingsDrawer.tsx` — same drawer/nav changes

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck && pnpm -w lint`. Browser (in `lazar-ui` per `CLAUDE.md`): open
Settings → Linear, click "Connect with Linear" — confirm both the sonner toast and inline error
mention `PIXLER_LINEAR_CLIENT_ID`. **Do not drive OAuth past the button click** (CLAUDE.md
requires the user to handle the handshake manually). Verify the wider drawers + icon+label nav
look correct, all categories accessible. With a PAT connected (user pastes it), click Disconnect,
confirm badge clears.

---

## Sprint 2 — Per-project Linear project link (settings-based) + Integrations panel

**Status:** ✅ complete
**Goal:** Persist a per-project Linear project link as a `useSetting` value (no schema change),
add a `LinearProjectPicker` component, and extend the existing per-project `IntegrationsPanel`
with a "Linear project" sub-section + Change / Unlink actions.

**Reuse decisions (locked in):**
- `GET /linear/projects?teamId=…` and `useLinearProjects(teamId)` **already ship** — do not
  duplicate.
- Per-project Linear team already uses `useSetting<string>('linear.team')` (see
  `IntegrationsPanel.tsx:34`). The new `linear.projectId` value reuses the same pattern.
- Do **not** add a parallel `ProjectLinearPanel` — extend `IntegrationsPanel.tsx`.

**Tasks:**

- [x] Add `useProjectLinearLink()` hook in
  `apps/web/src/hooks/useProjectLinearLink.ts`: wraps `useSetting<string>('linear.team')` +
  `useSetting<string>('linear.projectId')`, exposes `{ teamId, teamKey, projectId, setTeam,
  setProject, clear }`. Settings are project-scoped because `useSetting` already scopes by
  project route.
- [x] New `LinearProjectPicker.tsx` (`apps/web/src/components/`): cmdk combobox; if no team is
  selected, first prompts for team (reuses `useLinearTeams`); once team is chosen, lists
  projects via `useLinearProjects(teamId)`. On select, calls `setTeam` + `setProject`.
- [x] Extend `IntegrationsPanel.tsx`: under the existing "Linear team" section, add a
  "Linear project" sub-section showing the linked project's name (resolved live from
  `useLinearProjects(teamId)` so renames reflect on refetch — don't cache name client-side).
  Add "Change project" (re-opens `LinearProjectPicker`) and "Unlink" (calls `clear()`) actions.
  When `!status.connected`, the existing "Connect your Linear account in Settings → Linear"
  notice already handles that path — no change needed.

**Files Created/Modified:**

- `apps/web/src/hooks/useProjectLinearLink.ts` — new hook, project-scoped settings via `scope=project`
- `apps/web/src/components/LinearProjectPicker.tsx` — new cmdk combobox (team → project flow)
- `apps/web/src/components/ProjectSettingsDrawer/IntegrationsPanel.tsx` — "Linear project" section with picker + Unlink

**Issues Encountered:**

- `useSetting` is global-only; used project-scoped API directly in `useProjectLinearLink` so each Pixler project stores its own `linear.team` + `linear.projectId`.

**Verify:** `pnpm -w typecheck && pnpm -w lint`. Browser in `lazar-ui`: open Project Settings →
Integrations, pick a Linear team, pick a project, reload — confirm both survive (settings
persist). Click Unlink — confirm `linear.projectId` clears but `linear.team` stays. Re-link to a
different project, confirm the displayed name updates.

---

## Sprint 3 — Issue picker + create-issue in NewWorkspaceDialog + NewProjectDialog link step

**Status:** ✅ complete
**Goal:** Replace the free-text Ticket ID input with a searchable, paginated issue picker fed
by the linked Linear project, with an inline "Create new issue…" action. Add a `'link-linear'`
step to `NewProjectDialog`. Gate workspace creation gracefully when no project is linked.

**Reuse decisions (locked in):**
- Issue creation extends `LinearMutationsService.createIssue` (already wraps `client.createIssue`
  at line 70) — do not add a parallel service.
- `LinearService.fetchTicket(identifier)` already supports identifier-based lookup — keeps the
  free-text fallback working through workflow execution (`builtin:review_issue`, SPEC §4A.4).
- Workspace `ticketId` field stores the Linear **identifier** (`ENG-101`), not the GraphQL id.

**Tasks:**

- [x] Add `LinearService.listIssues({ teamId, projectId, q?, limit?, after? })` returning
  `{ nodes: LinearIssueSummaryDto[], cursor: string | null }`. Uses
  `client.issues({ filter: { project: { id: { eq } }, ...(q ? { search: q } : {}) }, first: limit ?? 50, after })`.
- [x] Add `GET /linear/issues?teamId=&projectId=&q=&limit=&after=` route in
  `linear.controller.ts` calling the new service method. 401 when Linear not connected (matches
  existing pattern in `teams()` / `projects()`).
- [x] Extend `LinearMutationsService.createIssue` to accept `{ teamId, title, description?,
  parentId? }`; return the created issue summary (id, identifier, title, state).
- [x] Add `POST /linear/issues` route accepting `CreateLinearIssueDto { teamId, projectId,
  title, description? }`, calling the extended mutation service (with `projectId` passed via
  `client.createIssue({ teamId, title, projectId, description })`). Return the new issue.
- [x] Add DTOs to `packages/shared-types/src/linear.ts`: `LinearIssueSummaryDto`
  (`{ id, identifier, title, state, stateType, assigneeName? }`) and `CreateLinearIssueDto`.
- [x] Add TanStack hooks in `useLinear.ts`: `useLinearIssues({ teamId, projectId, q })` with
  debounced query key (debounce `q` ~250ms); `useCreateLinearIssue()` returning the created
  issue.
- [x] New `LinearIssuePicker.tsx` (`apps/web/src/components/`): cmdk over `useLinearIssues`,
  debounced search input, sticky top-of-list "Create new issue…" row, each issue row shows
  identifier + title + state badge + assignee name. Calls `onSelect(identifier)` with the
  user-facing identifier.
- [x] New `CreateLinearIssueDialog.tsx`: small form (title required, description optional). On
  submit, calls `useCreateLinearIssue`, then invokes `onCreated(issue)` so the picker auto-
  selects the new issue.
- [x] Modify `NewWorkspaceDialog.tsx`: read `useProjectLinearLink()`. If `projectId` set,
  render `LinearIssuePicker` in place of the free-text Ticket ID `<Input>`. If not set, keep
  the existing input plus an inline "Link Linear project →" link that calls
  `setProjectSettingsOpen(true)`. **Always** allow free-text Ticket ID as a fallback — workflows
  using `builtin:review_issue` resolve via `LinearService.fetchTicket(identifier)` either way.
- [x] Modify `NewProjectDialog.tsx`: add a `'link-linear'` step between project creation and
  `'done'`. Renders `LinearProjectPicker` if Linear is connected, "Connect Linear" CTA + "Skip"
  if not. The Skip button finishes onboarding without setting `linear.projectId`.
- [x] Light unit tests for `useLinearIssues` and `useCreateLinearIssue` error envelopes. (N/A — no test framework configured in apps/web; error handling verified via typecheck + browser)

**Files Created/Modified:**

- `packages/shared-types/src/linear.ts` + `index.ts` — `LinearIssueSummaryDto`, `CreateLinearIssueDto`, `LinearIssuePageDto`
- `apps/api/src/linear/linear.service.ts` — `listIssues` method
- `apps/api/src/linear/linear.controller.ts` — `GET /linear/issues`, `POST /linear/issues`
- `apps/api/src/linear/linear-mutations.service.ts` — `createIssue` method
- `apps/web/src/hooks/useLinear.ts` — `useLinearIssues`, `useCreateLinearIssue`
- `apps/web/src/components/LinearIssuePicker.tsx` — new cmdk issue picker
- `apps/web/src/components/CreateLinearIssueDialog.tsx` — new create-issue form
- `apps/web/src/components/NewWorkspaceDialog.tsx` — issue picker when linked, fallback free-text + CTA
- `apps/web/src/components/NewProjectDialog.tsx` — `link-linear` step after creation

**Issues Encountered:**

- No test framework in apps/web — unit tests N/A; error handling verified by typecheck + type signatures.

**Verify:** `pnpm -w typecheck && pnpm -w lint && pnpm --filter @pixler/api test`. Browser
golden path in `lazar-ui`: create a fresh project → at `link-linear` step pick the Linear
project (user drives any required OAuth manually) → open New Workspace → type to search → pick
issue from list → confirm workspace is created with the **identifier** (`ENG-101`) populated.
Edge cases: (a) "Create new issue…" inline creation auto-selects the new issue; (b) project
without `linear.projectId` falls back to free-text input and the "Link Linear project →" link
opens Project Settings.

---

## Sprint 4 — Fix NewWorkspaceDialog "Waiting for setup script…" race

**Status:** ✅ complete
**Goal:** The dialog reaches the `'creating'` step, shows "Waiting for setup script…", and never
dismisses — even though the workspace reaches `ready` (visible in the sidebar). Root cause
identified in the original audit: `useWorkspaceEvents(createdId, handleEvent)` in
`NewWorkspaceDialog.tsx:48-61` only subscribes *after* `setCreatedId(ws.id)` runs, which is
after `mutateAsync` resolves. The backend emits `workspace.state-changed → ready` during the
POST (worktree creation is fast), so the dialog misses the event. Plus the empty-log placeholder
"Waiting for setup script…" is shown unconditionally when `setupLog.length === 0`, regardless of
actual state.

**Tasks:**

- [x] In `NewWorkspaceDialog.tsx`, after `setCreatedId(ws.id)`, also refetch the workspace state
  once via the workspaces query cache (or fetch directly). If the workspace is already `ready`
  or `error`, close the dialog immediately — don't wait for an event.
- [x] Alternatively (or additionally), use the response from `create.mutateAsync` itself: the
  POST returns the created workspace; if its initial state is already `ready`, skip the
  `'creating'` step entirely and close.
- [x] Update the empty-log placeholder text: if the workspace is `ready` (per the refetch), show
  "Workspace ready — closing…" with a 1s timer; only show "Waiting for setup script…" if state
  is `creating`/`pending`.
- [x] Verify the `workspace.state-changed` event handler still works for the non-race case
  (slow setup script). (Verified by code review — `handleEvent` still closes on state-changed → ready/error. The poll also re-checks to close if the state has already advanced, so both paths are handled.)
- [x] Optional: instrument `useWorkspaceEvents.ts` with a one-shot replay of the last known
  state when the subscription registers, so future dialogs don't hit the same race. Skip if it
  expands scope unreasonably. (Skipped — the poll-on-mount approach in NewWorkspaceDialog is cleaner and doesn't require backend changes to useWorkspaceEvents.)

**Files Created/Modified:**

- `apps/web/src/components/NewWorkspaceDialog.tsx` — poll on createdId mount, check response state, update placeholder text

**Issues Encountered:**

- _none_

**Verify:** `pnpm -w typecheck && pnpm -w lint`. Browser in `lazar-ui`: New Workspace → Create —
confirm the dialog closes within ~1s of the workspace appearing in the sidebar. Also test the
slow path by adding a `setup` script that sleeps 5s in `pixler.json` (revert after) — confirm the
dialog stays open and streams setup logs until ready.

---

## Prompt that created this plan

```
audit creating a workspace, use project lazar-ui b1de3c8e-20ef-41ea-b9be-ddfc5a04307a, create a
workspac ( i see waiting for setup script notification).
i should be able to connect Linear app and select from isuses in the system... or use a workflow
to creat an issue.

the connect with linear feature doesn't work. i dont want to manually input a linear ticket id, i
want to select from list

inside project, user should be able to seelect a project from Linear to grab/control issues in
i want to do this setup when onboarding a project, user must select project from linear (if they
are not connected to linear, help user oauth)

btw, iwhne i tried Connect with Linear button in settings page, didn't work.

Lets change settings to be wider pane

(follow-up) if linear is connected, have option in settings pane to disconnect. also in project
settings, option to disconnect linear project, and repick another project
```

---

## Consultant Review (2026-05-26)

### Risks & gaps

- **[P0]** Sprint 2 says "Add `GET /linear/projects`" — **this endpoint already exists** at
  `apps/api/src/linear/linear.controller.ts:38` (`projects(@Query('teamId') teamId: string)`,
  returning `LinearProjectDto[] = { id, name, slug }`). The matching `useLinearProjects(teamId)`
  hook also already exists in `apps/web/src/hooks/useLinear.ts` and is used by
  `IntegrationsPanel.tsx:38`. Sprint 2 must be reframed as *reuse the existing route + hook* —
  not "add". (Note: the existing endpoint is *team-scoped*, takes `teamId`, not workspace/project
  scoped — the picker needs a team selector first, or the plan must reuse `linear.team` setting,
  see next finding.)
- **[P0]** The plan's "per-project Linear project link" duplicates an existing mechanism:
  `IntegrationsPanel.tsx` already stores a per-project Linear team via
  `useSetting<string>('linear.team')` and surfaces a team override + agent-mode picker. Adding a
  new SQLite column (`linear_project_id` on `projects`) bypasses this established pattern. **Pick
  one:** (a) extend the settings approach — store `linear.team` + `linear.projectId` per project
  via `useSetting`, no migration needed; or (b) commit to columns and *migrate* the existing
  `linear.team` setting into the new schema. The current plan implicitly creates two sources of
  truth for "which Linear team/project does this Pixler project use." Resolve before Sprint 2.
- **[P0]** Sprint 3 implies a new `POST /linear/issues` endpoint, but Linear issue creation is
  already invoked in `apps/api/src/linear/linear-mutations.service.ts:70` via
  `client.createIssue({ teamId, title, parentId })`. The plan should extend
  `LinearMutationsService` (and add a *route* in `linear.controller.ts`) rather than creating a
  parallel service. Also worth deciding: does user-facing create-issue need `description`?
  `parentId`? The existing call only takes `teamId/title/parentId`.
- **[P1]** Migration filename in the plan ("`<NN>_add_linear_project_id.sql`") is unspecified.
  Next available is **`0013_add_linear_project_id.sql`** (current head is
  `0012_workflow_runs.sql`). The plan must also bump `meta.schema_version` — every existing
  migration ends with `UPDATE meta SET value = '13' WHERE key = 'schema_version';` and the plan
  doesn't mention this. (Moot if you pick the settings-based path per the previous finding.)
- **[P1]** Shared-types filename mismatch — plan references
  `packages/shared-types/src/project.ts`; the actual file is `projects.ts` (plural). The
  `Project` interface uses **snake_case** fields (`default_branch`, `package_manager`,
  `icon_path`) to match the SQLite columns. New fields should follow the same convention
  (`linear_project_id`, `linear_project_name`), and the dialog/hook code must respect that.
- **[P1]** `PatchProjectDto` already exists in `packages/shared-types/src/projects.ts` and is
  wired to `PATCH /projects/:id`. Adding a separate `PATCH /projects/:id/linear-project`
  endpoint is more code than just extending `PatchProjectDto` with the two optional fields and
  reusing the existing route. Recommend the smaller change.

### Spec compliance

- **[P1]** SPEC §4A.4 lists step type `builtin:review_issue` ("Fetch issue from Linear, display
  details, ask user to confirm") as part of standard workflows. The plan's fallback path
  (free-text Ticket ID when no Linear project is linked) leaves an ambiguity: what does
  `builtin:review_issue` do for a workspace whose `ticketId` was typed manually but isn't in any
  linked Linear project? Plan should note: free-text input still must work end-to-end through
  workflow execution (fetch by identifier already works via `linearService.fetchTicket(identifier)`
  in `linear.service.ts:131`), or document that workflows requiring a Linear ticket are disabled
  in that case.
- **[P1]** SPEC table at §64–65 mandates **agent-facing Linear access goes through the CLI**
  (`pixler-linear`) for token cost reasons; user-facing `LinearService` uses the SDK. The plan's
  new user-facing "Create new issue…" rightly uses the SDK path — that's fine — but Sprint 3
  should call out that *agent-driven* issue creation (if added later) would be a CLI extension,
  not this endpoint. Avoids future confusion.
- **[P2]** SPEC §256 ("Inline") + §306 plan-attachment table treat `linear_project_id` as
  metadata in `pixler.json` / plan frontmatter. If you go with the migration path, mirror the
  field name there for consistency.

### Reuse opportunities

- **[P1]** Toast surface for the OAuth error is **`@pixler/ui/components/sonner`** — see
  `apps/web/src/components/ToastBridge.tsx:2` (`toast.error('...', { id })`). Sprint 1 should
  name `toast.error` explicitly so the implementer doesn't roll a new mechanism.
- **[P1]** `useLinearProjects(teamId)` hook already exists (`apps/web/src/hooks/useLinear.ts`,
  imported by `IntegrationsPanel.tsx:4`). Sprint 2's `LinearProjectPicker` should consume it
  directly — no new hook needed for the read side.
- **[P1]** A `ProjectLinearPanel.tsx` (new) overlaps with the existing `IntegrationsPanel.tsx`
  which already has a Linear sub-section (team override + agent-mode + linear projects list).
  **Don't add a parallel panel** — extend `IntegrationsPanel` with the new project picker +
  "Unlink" / "Change project" controls. The icon-rail nav stays unchanged.
- **[P2]** `LinearTicketDto.identifier` (e.g. `ENG-101`) is the user-facing key; the
  workspace `ticketId` field expects that, not the GraphQL `id`. Make this explicit in
  Sprint 3's picker spec to avoid an obvious-in-hindsight wrong-field bug.

### Enhancements

- **[P1]** **Address the "Waiting for setup script…" race from the original audit** — either
  add a Sprint 4 or explicitly note it's deferred to a separate bugfix plan. Leaving it
  un-tracked in this milestone means it'll get forgotten; the audit already found root cause
  (`NewWorkspaceDialog.tsx:48-95`, `useWorkspaceEvents` subscribes after state-changed fires).
  Recommend a fourth sprint: "Fix workspace-creation dialog race + dismissal" — small, high
  value, fits the same surface area.
- **[P1]** Add an **explicit test-flow caveat** to every Sprint's Verify section:
  per the updated `CLAUDE.md`, browser verification uses `lazar-ui` as the test project and
  **OAuth handshake must be driven manually by the user** — the executing agent must stop and
  ask. Without this note, Sprint 1's verify ("click Connect with Linear") could read as
  "agent drives OAuth," which the user has explicitly forbidden.
- **[P1]** **Server-side search + pagination** for `GET /linear/issues`. Linear projects can
  hold thousands of issues; the plan says "limit if Linear API requires it" which is too vague.
  Recommended shape: `?q=<text>&limit=50` with cursor support — Linear SDK supports
  `client.issues({ filter: { project: { id: { eq } }, search: { contains } }, first: 50,
  after })`. The cmdk picker should debounce-search through the server, not filter client-side.
- **[P2]** **Issue picker should show issue state badge + assignee avatar** in the row, not just
  title + identifier. The data is already in `LinearTicketDto`; small UX win for almost zero
  cost.
- **[P2]** **Cache the linked Linear project name on the Pixler side** but refetch on mount —
  Linear projects can be renamed and a stale local name in the picker UI is a minor footgun.
  Or store only the `id` and resolve the name from `useLinearProjects(teamId)` on render.
- **[P2]** **Settings drawer width — be deliberate about the nav rail.** Currently
  `w-14` icon-only column with tooltips. At `sm:max-w-4xl` the icon-only rail looks lonely
  next to a much bigger panel. Two options: (a) keep icon-only (cheapest), or (b) expand to
  icon+label (`w-44`). The plan says "designer's call" — pick one in the plan so the
  implementer doesn't have to.

### Changelog

- 2026-05-26: Initial consultant review.
- 2026-05-26: Plan body revised to address P0/P1 findings. Sprint 2 reframed (settings-based
  link, no migration, reuse `GET /linear/projects` + `useLinearProjects`, extend
  `IntegrationsPanel` instead of new panel). Sprint 3 reframed (extend
  `LinearMutationsService`, identifier-not-id ticket field, server-side search). Sprint 1 names
  `sonner.toast.error` + drawer nav `w-44` icon+label. Sprint 4 added for the
  `NewWorkspaceDialog` race. OAuth-handshake-by-user note added to every Verify section.

