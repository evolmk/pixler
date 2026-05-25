# M24 — Gestures, animations polish, deep links (`pixler://`)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete. M24 done.

---

## Goal

Implement the gesture + motion details from SPEC §8.2/§8.4 + the deep-link surface from SPEC §6.6
+ §10.2 External Tools (URL scheme registration).

## Depends on

- M03 (UI primitives with motion baked in)
- M07/M08 (workspace context for deep links)
- M10 (Linear comments for deep-link insertion)

## Acceptance

- Swiping a workspace card 60% to the right archives it with a satisfying animation.
- Pulling the Linear list down triggers sync with a spinner halo.
- Pinching the diff editor scales the font-size.
- Clicking a `pixler://workspace/<id>` link from outside the browser opens Pixler at that
  workspace.
- Creating a workspace posts the expected Linear comment.
- `pnpm -w typecheck` clean.

## Out of scope

- React Native gesture parity — the mobile companion is v3 per spec; v1 just ensures the
  patterns translate cleanly.
- Custom URL scheme on iOS/Android — v3.

## Files (expected surface)

```
apps/api/src/deeplink/deeplink.module.ts
apps/api/src/deeplink/deeplink.service.ts
apps/api/src/deeplink/deeplink.controller.ts
apps/api/src/deeplink/url-scheme.installer.ts
apps/web/src/components/WorkspaceCard.tsx                     (add swipe gesture)
apps/web/src/components/LinearTicketList.tsx                  (add pull-to-refresh)
apps/web/src/components/DiffEditor.tsx                        (add pinch zoom)
apps/web/src/components/ImageLightbox.tsx
apps/web/src/lib/motion.ts                                    (shared variants)
apps/web/src/hooks/useDeepLink.ts
apps/web/src/components/SettingsDrawer/ExternalToolsPanel.tsx (extend with URL scheme status)
```

---

## Sprint 1 — Gesture wiring (swipe / pull / long-press / pinch)

**Status:** ✅ complete
**Goal:** All four gesture patterns are live on their target surfaces.

**Tasks:**

- [x] Add `@use-gesture/react` and `motion` to `apps/web/package.json`.
- [x] `WorkspaceCard.tsx` — swipe-to-archive: drag horizontally; on > 50% displacement OR
  velocity-flick, fire archive; Motion spring-back / spring-out.
- [x] `LinearTicketList.tsx` — pull-to-refresh: drag down past threshold → triggers
  `POST /api/linear/sync`.
- [x] Long-press on workspace card → opens context menu (M08 menu, here we add gesture path).
- [x] `DiffEditor.tsx` — pinch-to-zoom: pinch scales font-size with a clamp.

**Files Created/Modified:**

- `apps/web/src/components/WorkspaceCard.tsx` — swipe-to-archive, long-press context menu
- `apps/web/src/components/LinearTicketList.tsx` — pull-to-refresh gesture
- `apps/web/src/components/DiffEditor.tsx` — pinch-to-zoom font size

**Issues Encountered:**

- `@use-gesture/react` `onDrag` conflicts with `motion.div` `onDrag` signature. Fixed by casting `bind()` as `React.HTMLAttributes<HTMLDivElement>` and spreading onto plain `<div>` wrappers, keeping `<motion.div>` inside for animation only.

**Verify:** `pnpm --filter @pixler/web build` + manual: swipe / pull / long-press / pinch on a touch device or emulator.

---

## Sprint 2 — Animation pass + theme switch fade + ImageLightbox

**Status:** ✅ complete
**Goal:** Audit Motion entrance/exit across modals/drawers/dropdowns/tabs; stagger sidebar list;
theme switch fades cleanly.

**Tasks:**

- [x] `lib/motion.ts` — shared variants used across the app.
- [x] Audit every modal/drawer/dropdown/tab change for Motion exit + enter.
- [x] Stagger entrance for sidebar workspace list (`delay` per item).
- [x] Theme switch: 200ms fade on `--pixler-bg` swap.
- [x] Respect `appearance.animationLevel` globally.
- [x] `ImageLightbox.tsx` — chat image click opens dedicated file tab + click-to-fullscreen.

**Files Created/Modified:**

- `apps/web/src/lib/motion.ts` — shared Motion variants (fadeIn, slideUp, scaleIn, stagger)
- `apps/web/src/components/CenterTabs.tsx` — fade-in on tab switch
- `apps/web/src/components/WorkspacesSidebar.tsx` — stagger entrance for workspace list
- `apps/web/src/stores/theme.ts` — `withThemeFade` adds `.theme-transitioning` class
- `apps/web/src/styles/app.css` — `.theme-transitioning` CSS transition rule
- `apps/web/src/routes/project.tsx` — `MotionConfig` respects `appearance.animationLevel`
- `apps/web/src/components/ImageLightbox.tsx` — fullscreen image overlay with enter/exit

**Issues Encountered:**

- `AnimatePresence` + Radix `TabsContent` conflict: Radix manages visibility via CSS, so forceMount+null-filtering conflicted. Resolved by keeping Radix tabs normal and using a `motion.div key={activeTab}` inside each panel for entrance animation only.

**Verify:** `pnpm -w typecheck` + manual: animation level off → motion stripped; theme switch fades.

---

## Sprint 3 — Deep link infra + URL scheme + Linear deep-link comments

**Status:** ✅ complete
**Goal:** `pixler://` URL scheme registers per-OS; clicks route into running app; workspace
creation posts a Linear comment.

**Tasks:**

- [x] `DeeplinkModule` + `DeeplinkService` + `DeeplinkController`.
- [x] `url-scheme.installer.ts` — macOS `.app` shim posting to local api; Windows registry entry
  `HKCU\Software\Classes\pixler`; Linux `xdg-mime` + `.desktop`.
- [x] `POST /api/deeplink { url }` — parses `pixler://workspace/<id>`, `project/<id>`,
  `ticket/<identifier>`; emits `deeplink.received`; web navigates + focuses window.
- [x] Extend `SettingsDrawer/ExternalToolsPanel.tsx` with URL scheme registration status +
  Register button.
- [x] On workspace creation: post Linear comment with deep link + plan path (toggleable in
  Project Settings → Integrations).
- [x] `useDeepLink.ts`.

**Files Created/Modified:**

- `apps/api/src/deeplink/deeplink.module.ts`
- `apps/api/src/deeplink/deeplink.service.ts`
- `apps/api/src/deeplink/deeplink.controller.ts`
- `apps/api/src/deeplink/url-scheme.installer.ts`
- `apps/api/src/app.module.ts` — registered DeeplinkModule
- `apps/api/src/linear/linear.module.ts` — exported LinearMutationsService
- `apps/api/src/workspaces/workspaces.module.ts` — imported DeeplinkModule
- `apps/api/src/workspaces/workspaces.service.ts` — injected DeeplinkService, posts comment on create
- `packages/shared-types/src/events.ts` — added `deeplink.received` event
- `packages/shared-types/src/settings.ts` — added `integrations.linear.deeplinkOnCreate` setting
- `apps/web/src/hooks/useDeepLink.ts`
- `apps/web/src/components/SettingsDrawer/ExternalToolsPanel.tsx` — URL scheme section
- `apps/web/src/routes/project.tsx` — wired `useDeepLink`

**Issues Encountered:**

- `SettingsService.get` takes opts object, not bare string. Fixed call in `DeeplinkService`.

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: open `pixler://workspace/<id>` from external app.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
