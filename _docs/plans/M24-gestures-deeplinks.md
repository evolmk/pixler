# M24 — Gestures, animations polish, deep links (`pixler://`)

**Status:** ⏳ IN_PROGRESS
**Modified:** 2026-05-25
**Current Status:** Sprint 1 complete — gesture wiring done. Sprint 2 in-progress.

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

**Status:** ⏳ pending
**Goal:** Audit Motion entrance/exit across modals/drawers/dropdowns/tabs; stagger sidebar list;
theme switch fades cleanly.

**Tasks:**

- [ ] `lib/motion.ts` — shared variants used across the app.
- [ ] Audit every modal/drawer/dropdown/tab change for Motion exit + enter.
- [ ] Stagger entrance for sidebar workspace list (`delay` per item).
- [ ] Theme switch: 200ms fade on `--pixler-bg` swap.
- [ ] Respect `appearance.animationLevel` globally.
- [ ] `ImageLightbox.tsx` — chat image click opens dedicated file tab + click-to-fullscreen.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck` + manual: animation level off → motion stripped; theme switch fades.

---

## Sprint 3 — Deep link infra + URL scheme + Linear deep-link comments

**Status:** ⏳ pending
**Goal:** `pixler://` URL scheme registers per-OS; clicks route into running app; workspace
creation posts a Linear comment.

**Tasks:**

- [ ] `DeeplinkModule` + `DeeplinkService` + `DeeplinkController`.
- [ ] `url-scheme.installer.ts` — macOS `.app` shim posting to local api; Windows registry entry
  `HKCU\Software\Classes\pixler`; Linux `xdg-mime` + `.desktop`.
- [ ] `POST /api/deeplink { url }` — parses `pixler://workspace/<id>`, `project/<id>`,
  `ticket/<identifier>`; emits `deeplink.received`; web navigates + focuses window.
- [ ] Extend `SettingsDrawer/ExternalToolsPanel.tsx` with URL scheme registration status +
  Register button.
- [ ] On workspace creation: post Linear comment with deep link + plan path (toggleable in
  Project Settings → Integrations).
- [ ] `useDeepLink.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: open `pixler://workspace/<id>` from external app.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
