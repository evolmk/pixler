# M24 — Gestures, animations polish, deep links (`pixler://`)

## Goal

Implement the gesture + motion details from SPEC §8.2/§8.4 + the deep-link surface from SPEC §6.6 + §10.2 External Tools (URL scheme registration).

## Depends on

- M03 (UI primitives with motion baked in)
- M07/M08 (workspace context for deep links)
- M10 (Linear comments for deep-link insertion)

## Deliverables

- [ ] `apps/web/package.json` adds `@use-gesture/react`
- [ ] **Gesture wiring**:
  - **Swipe-to-archive** on workspace sidebar cards: drag horizontally; on `> 50%` displacement or velocity-flick, fire archive; smooth Framer Motion spring-back / spring-out animation
  - **Pull-to-refresh** on the Linear ticket list section: drag down past threshold; triggers `POST /api/linear/sync`
  - **Long-press** workspace card → opens the context menu (already in M08; here we add the gesture path)
  - **Pinch-to-zoom** Monaco diff (M17 placeholder becomes real here): pinch scales the editor font-size with a clamp
- [ ] **Animation pass**:
  - Audit every modal, drawer, dropdown, tab change for Framer Motion exit + enter
  - Stagger entrance animations for the sidebar workspace list (small `delay` per item)
  - Theme switch transition: 200ms fade on `--pixler-bg` swap (use `transition: background-color`)
  - Respect `appearance.animationLevel` from M20 globally
- [ ] **Deep link infra**:
  - Boot script registers `pixler://` URL scheme:
    - macOS: install a tiny `.app` shim that posts the URL to the running api at `POST /api/deeplink`; if no Pixler running, boot it then forward
    - Windows: registry entry `HKCU\Software\Classes\pixler`
    - Linux: `xdg-mime` + `.desktop` file
  - `apps/api/src/deeplink/deeplink.module.ts`:
    - `POST /api/deeplink` body `{ url }` — parses `pixler://workspace/<id>`, `pixler://project/<id>`, `pixler://ticket/<identifier>`
    - Emits `deeplink.received` event; the web app navigates accordingly and focuses the window
  - Status displayed in **Settings → External Tools** "URL scheme registration status" — "Registered" / "Not registered (Register)"
- [ ] **Linear deep-link comments** (SPEC §6.6):
  - On workspace creation, post a Linear comment:
    ```
    🎼 Open in Pixler → pixler://workspace/<workspace-id>
       Plan: docs/plans/<TICKET>.md (file)
    ```
  - Use the M11 `pixler ticket comment` CLI internally (or the M10 LinearService directly — either is fine)
  - Toggle in Project Settings → Integrations: "Post deep-link comments to Linear" (default on)
- [ ] **Image preview file tab** (SPEC §8.5): clicking an image in a chat message opens it in a dedicated file tab with click-to-fullscreen

## Acceptance

- Swiping a workspace card 60% to the right archives it with a satisfying animation.
- Pulling the Linear list down triggers sync with a spinner halo.
- Pinching the diff editor scales the font-size.
- Clicking a `pixler://workspace/<id>` link from outside the browser opens Pixler at that workspace.
- Creating a workspace posts the expected Linear comment.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- React Native gesture parity — the mobile companion is v3 per spec; v1 just ensures the patterns translate cleanly.
- Custom URL scheme on iOS/Android — v3.
