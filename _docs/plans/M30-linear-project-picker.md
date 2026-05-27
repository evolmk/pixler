# M30 — Linear project linking & issue picker

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-26
**Current Status:** Plan authored; awaiting execution.

---

## Goal

Replace the free-text "Ticket ID" input in `NewWorkspaceDialog` with a searchable picker fed by a
**per-project Linear project link**. Surface OAuth configuration errors clearly (currently the
"Connect with Linear" button silently 401s when `PIXLER_LINEAR_CLIENT_ID` is missing). Add
disconnect affordances for both the global Linear credential (in Settings) and the per-project
Linear project link (in Project Settings). Widen both Settings drawers so the new picker and
project list have room to breathe.

The link is set during project creation (optional, skippable) and editable from Project Settings.
The picker also offers an inline "Create new Linear issue…" action that calls a new POST endpoint
wrapping Linear's `issueCreate` mutation.

## Depends on

- M10-linear-sdk (Linear API client + OAuth + PAT flows)
- M11-linear-cli (Linear ticket model + storage)
- M07-projects (projects table + `NewProjectDialog`)
- M21-onboarding (`Step3Linear` connect flow as reference UX)

## Acceptance

- Clicking "Connect with Linear" with `PIXLER_LINEAR_CLIENT_ID` unset shows a toast with the
  exact missing env var name and a link to docs/README; the button is no longer silently broken.
- `NewProjectDialog` shows a "Link Linear project" step *after* the project is created, with
  a project picker if Linear is connected and a "Connect Linear" CTA + "Skip" if not. Skipping
  works and creates the project without a link.
- `NewWorkspaceDialog`'s Ticket ID field is replaced by:
  - a cmdk-style combobox listing issues from the project's linked Linear project (title +
    identifier), **if** a Linear project is linked;
  - a top-of-list "Create new issue…" action that opens a small create-issue dialog and, on
    success, selects the new issue;
  - a fallback free-text input + inline "Link Linear project" CTA when no project is linked.
- `SettingsDrawer` → Linear panel shows a "Disconnect" button per stored credential (oauth/pat)
  when connected, which clears the credential and updates the badge.
- `ProjectSettingsDrawer` gains a "Linear project" section showing the linked project (name +
  identifier) with "Change project" and "Unlink" actions.
- Both Settings drawers widened from `sm:max-w-[480px]` to `sm:max-w-4xl` and the nav column
  expanded to fit text labels alongside icons (or kept icon-only — designer's call, see notes).
- `pnpm -w typecheck` and `pnpm -w lint` clean.
- Manual browser walk-through (golden path) passes: create project → link Linear project → new
  workspace → pick issue from list → workspace created with the ticket ID populated.

## Out of scope

- Shipping real Linear OAuth credentials (env vars stay user-supplied; the fix is the error UX, not
  the credentials themselves).
- A new workflow step type for issue creation (`linear.create-issue`) — issue creation lives only
  in the picker for this milestone.
- Background polling/auto-sync of Linear issues — picker fetches on demand.
- Editing existing Linear issues from Pixler (state, labels, comments — those endpoints exist
  already; this milestone only reads + creates).
- Changes to the global `OnboardingShell` 5-step wizard. Per-project linking happens in
  `NewProjectDialog`, not in `OnboardingShell`.
- Multi-team or multi-Linear-org support per project (one Linear project per Pixler project).

## Files (expected surface)

```
apps/api/src/db/migrations/<NN>_add_linear_project_id.sql          (new)
apps/api/src/projects/projects.repository.ts                       (modify)
apps/api/src/projects/projects.controller.ts                       (modify)
apps/api/src/projects/dto/                                         (modify or add)
apps/api/src/linear/linear.controller.ts                           (modify)
apps/api/src/linear/linear.service.ts                              (modify)

packages/shared-types/src/project.ts                               (modify)
packages/shared-types/src/linear.ts                                (modify)

apps/web/src/hooks/useLinear.ts                                    (modify)
apps/web/src/hooks/useProjects.ts                                  (modify)
apps/web/src/components/NewProjectDialog.tsx                       (modify)
apps/web/src/components/NewWorkspaceDialog.tsx                     (modify)
apps/web/src/components/LinearIssuePicker.tsx                      (new)
apps/web/src/components/LinearProjectPicker.tsx                    (new)
apps/web/src/components/CreateLinearIssueDialog.tsx                (new)
apps/web/src/components/SettingsDrawer.tsx                         (modify — width)
apps/web/src/components/ProjectSettingsDrawer.tsx                  (modify — width + Linear section)
apps/web/src/components/SettingsDrawer/LinearPanel.tsx             (modify — error toast, disconnect)
apps/web/src/components/SettingsDrawer/ProjectLinearPanel.tsx      (new)
```

---

## Sprint 1 — Surface OAuth errors + Linear disconnect in Settings

**Status:** ⏳ pending
**Goal:** Make the existing "Connect with Linear" button non-broken: show a clear toast when
OAuth is unconfigured, and add a working "Disconnect" affordance per stored credential. No new
endpoints, no schema changes — pure UI/UX fix on top of the existing API.

**Tasks:**

- [ ] Update `useLinearOAuthUrl` to read `err.error.message` from the 401 response and surface it
  via the existing notifications system (per `apps/web/CLAUDE.md` error-envelope rule).
- [ ] In `LinearPanel.tsx`, render the mutation's error state inline beneath the OAuth button —
  call out `PIXLER_LINEAR_CLIENT_ID` by name and link to `_docs/pixler-SPEC.md#linear` (or repo
  README) for setup. Keep PAT path as the working fallback.
- [ ] Confirm `removeCredential.mutateAsync('oauth')` / `('pat')` wiring renders a Disconnect
  button per `storedMethods`; add it (or fix it) so connected users can disconnect from Settings.
- [ ] Mirror the OAuth-error toast in `Onboarding/Step3Linear.tsx` so the onboarding wizard fails
  loudly the same way.
- [ ] Widen both drawers: `SettingsDrawer.tsx` and `ProjectSettingsDrawer.tsx` `DrawerContent`
  className `sm:max-w-[480px]` → `sm:max-w-4xl`. Sanity-check the nav column at the new width.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`, then in a browser: open Settings → Linear, click
"Connect with Linear" — confirm an inline error mentioning `PIXLER_LINEAR_CLIENT_ID` appears.
With a PAT connected, click Disconnect and confirm the badge clears.

---

## Sprint 2 — Per-project Linear link: schema, API, project settings

**Status:** ⏳ pending
**Goal:** Persist a per-project Linear project link, expose read/write endpoints, and add a
"Linear project" section to `ProjectSettingsDrawer` with Change/Unlink actions. Adds a new
`GET /linear/projects` endpoint so the picker has data.

**Tasks:**

- [ ] Add SQLite migration adding `linear_project_id TEXT NULL` and `linear_project_name TEXT NULL`
  to `projects` table.
- [ ] Update `projects.repository.ts` to read/write the two new columns; add a `setLinearProject`
  / `clearLinearProject` method pair.
- [ ] Add `PATCH /projects/:id/linear-project` accepting `{ linearProjectId, linearProjectName } |
  null`. Reuse the existing auth guard.
- [ ] Add `GET /linear/projects` returning `{ id, name, key, teamKey }[]` from the Linear SDK.
  Guard with 401 when Linear is not connected; return the same error-envelope shape.
- [ ] Mirror new Project shape in `packages/shared-types/src/project.ts`; add `LinearProject`
  DTO in `packages/shared-types/src/linear.ts`.
- [ ] New TanStack Query hooks: `useLinearProjects()`, `useSetProjectLinearLink()`,
  `useClearProjectLinearLink()` in `useLinear.ts` / `useProjects.ts`.
- [ ] New `LinearProjectPicker.tsx` (cmdk combobox over `useLinearProjects()`).
- [ ] New `SettingsDrawer/ProjectLinearPanel.tsx` showing the current link (name + identifier),
  with "Change project" (opens picker) and "Unlink" actions. Show a "Connect Linear" CTA when
  the credential is missing entirely.
- [ ] Register the new panel in `ProjectSettingsDrawer.tsx` nav.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/api test` (covering the new repository
method + controller route). In browser: open Project Settings → Linear project, link a project,
verify it survives reload; click Unlink and verify it clears.

---

## Sprint 3 — Issue picker + create-issue in NewWorkspaceDialog

**Status:** ⏳ pending
**Goal:** Replace the free-text Ticket ID input with a searchable issue picker fed by the linked
Linear project, with an inline "Create new issue…" action. Also gate workspace creation gracefully
when no project is linked.

**Tasks:**

- [ ] Add `GET /linear/issues?projectId=…` returning `{ id, identifier, title, state }[]` for
  issues in the given Linear project. Server-side pagination/limit if Linear API requires it.
- [ ] Add `POST /linear/issues` accepting `{ projectId, title, description? }` wrapping Linear's
  `issueCreate` mutation; return the created issue.
- [ ] New TanStack hooks: `useLinearIssues(linearProjectId)`,
  `useCreateLinearIssue(linearProjectId)`.
- [ ] New `LinearIssuePicker.tsx` (cmdk over `useLinearIssues`) with a sticky top-of-list "Create
  new issue…" row.
- [ ] New `CreateLinearIssueDialog.tsx` — small form (title required, description optional);
  on submit, calls `useCreateLinearIssue`, then selects the new issue via callback.
- [ ] Modify `NewWorkspaceDialog.tsx`: when `project.linearProjectId` is set, render
  `LinearIssuePicker` in place of the Ticket ID `<Input>`; when not set, render the existing
  free-text input plus an inline "Link Linear project →" CTA that opens `ProjectSettingsDrawer`.
- [ ] Modify `NewProjectDialog.tsx` to add an **optional** step after project creation: "Link a
  Linear project?" with `LinearProjectPicker` and a "Skip — link later" button. If Linear is not
  connected, show "Connect Linear" CTA + "Skip" instead of the picker.
- [ ] Light unit tests around the new hooks' error envelopes.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm -w lint`. Browser golden path: create new project → link
Linear project in the post-create step → open New Workspace → pick issue from list → confirm the
workspace is created with the picked ticket identifier. Edge case: create an issue via "Create
new issue…" and verify it's auto-selected.

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

