# Design System — Guest & Client Layout

> On-demand agent reference for building Guest and Client app UI.

**Created:** 2026-03-31 · **Updated:** 2026-05-15 (M150 bundle integration)

---

## Intent

- **Who:** Developers and technical leads managing projects, workspaces, and terminal sessions. Think in repos, branches, and tasks — visit with a specific verb (create, open, sync, check).
- **Feel:** Grounded and precise — like a well-organized developer tool. Not consumer-retail playful, not cold SaaS sterile.
- **Surfaces:** Technical document rendered in a browser — flat, border-separated, gray-on-white with brand-green hits.

---

## Voice & Content

For full content spec see `spec-ui-content-voice.md`. Summary:

- **Grounded, declarative, developer-to-developer.** Assumes reader knows repos, branches, workspaces, terminal sessions.
- **Confident, never apologetic.** "Out of stock" not "Sorry, temporarily unavailable."
- **Casing:** Title Case for nav/page titles · UPPERCASE WITH WIDE TRACKING for overlines · Sentence case for body.
- **Units:** durations human-readable (`2h 15m`) · counts with `tabular-nums`.
- **Emoji: never.** Use Lucide icons.
- Identifiers verbatim: `proj-abc-123`.

---

## Palette

| Token              | Value     | Tailwind                 | Usage                                            |
| ------------------ | --------- | ------------------------ | ------------------------------------------------ |
| `--brand`          | `#16a355` | `bg-brand`, `text-brand` | Primary brand green — Pixler brand               |
| `--brand-light`    | `#22c55e` | `bg-brand-light`         | Hover, accent                                    |
| `--brand-dark`     | `#15803d` | `bg-brand-dark`          | Pressed/active                                   |
| `--footer-surface` | `#e8efe8` | `bg-footer-surface`      | Very pale gray-green — footer / landing sections |

> **Brand hex is `#16a355`.** `spec-ui-tokens.md` is the authoritative token reference.

**Single spot color.** Brand green on a neutral white-on-gray canvas. All other UI surfaces use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`).

**Status colors (static — don't shift with theme):**
`--status-error: #dc2626` · `--status-warning: #f59e0b` · `--status-success: #10b981` · `--status-info: #3b82f6`

---

## Typography

Font: `Inter` (variable 400–800). Base `html` font-size `14px`. See `spec-ui-typography.md` for full scale + patterns.

| Purpose          | Classes                             |
| ---------------- | ----------------------------------- |
| Page title       | `text-3xl font-bold tracking-tight` |
| Section heading  | `text-xl font-semibold`             |
| Body (default)   | `text-sm`                           |
| Body (marketing) | `text-base`                         |
| Metadata         | `text-xs text-muted-foreground`     |

**Eyebrow / overline signature:**

```html
<span class="eyebrow text-muted-foreground">ACCESSORIES</span>
<div class="bg-brand h-[2px] w-10"></div>
```

`class="eyebrow"` = 11px / 600 / uppercase / tracking-0.025em. Pair with a color class — does not set color itself.

**Display type:** Hero numbers `text-6xl text-7xl leading-[0.9] tracking-[-0.02em]`.

**Tabular figures** for counts, metrics, timestamps: add `tabular-nums`.

---

## Depth & Cards

**Borders-first.** Cards, table rows, section containers: `border border-border bg-card` — **no shadow**.

Shadows reserved for z-layer elements only:

- Dropdowns, popovers: `shadow-md`
- Dialogs, megamenu panels, basket flyouts: `shadow-lg`

Cards: `rounded-lg border border-border bg-card` (10px radius). No accent border-stripes, no colored gradients inside cards.

---

## Hover & Press States

| Interaction       | Pattern                                              |
| ----------------- | ---------------------------------------------------- |
| Link / nav hover  | `text-brand` or `bg-brand/10` tint                   |
| Card hover        | `shadow-md`, optional `scale-[1.02]`, `border-brand` |
| Button press      | `active:scale-[0.98]`                                |
| Primary CTA press | `bg-brand-dark`                                      |
| Focus             | `ring-2 ring-ring focus:outline-none`                |

All transitions: `transition-all duration-200 ease`. No springs, no bounces.

---

## Header Signature (scroll states)

| State         | Background  | Height                     | Text/Icons   | Logo          |
| ------------- | ----------- | -------------------------- | ------------ | ------------- |
| Default (top) | White       | 70px desktop / 60px mobile | Dark / green | Dark variant  |
| Scrolled      | Brand green | 50px desktop / 44px mobile | White        | White variant |

200ms smooth transition. Basket badges stay `bg-status-error` (red) in both states.

---

## Layout Signatures

See `spec-ui-layout-signatures.md` for full recipes. Quick reference:

| Signature                    | Core classes                                                        |
| ---------------------------- | ------------------------------------------------------------------- |
| Overline + brand-rule + hero | `eyebrow` → `bg-brand h-[2px] w-10` → `text-6xl leading-[0.9]`      |
| Annotated diagram            | Callout pills: `bg-white/95 backdrop-blur rounded-full`             |
| Spec chip                    | `bg-brand h-[2px] w-full` bottom underline (no pill background)     |
| Action-group header          | Projects · Workspaces · Terminal — each with `bg-status-error` count badge |
| Breadcrumb                   | At top of every detail page, ending in `font-semibold` current item |
| Megamenu                     | Hover-triggered, reveals nested navigation on desktop               |

---

## Backgrounds & Imagery

- **White default.** No gradients on canvas.
- Hero sections: subtle gray-to-transparent wash or 5–10% brand-green radial glow.
- Blueprint grid: 32px + 8px overlay at 5–14% opacity, masked to fade vertically (technical hero variants).
- Transparency/blur: `bg-white/95 backdrop-blur` on floating callout pills only. No glassmorphism.

---

## Corner Radii

| Element                           | Class          | Value |
| --------------------------------- | -------------- | ----- |
| Inputs, buttons (incl. CTAs)      | `rounded-md`   | 8px   |
| Cards, dialogs                    | `rounded-lg`   | 10px  |
| Megamenu / large containers       | `rounded-xl`   | 14px  |
| Pills, badges, avatars            | `rounded-full` | —     |
| Spec drawings / blueprint headers | `rounded-none` | —     |

CTAs like "Create Project" use `rounded-md`. **Never `rounded-full` for buttons.**

---

## Motion

See `spec-ui-motion.md`. Summary: 200ms ease for all transitions. No springs, parallax, on-scroll reveals (beyond header collapse). Skeleton pulse OK. Toast slide-in from bottom-right OK.

---

## Apps & Layout Architecture

| App        | Layout                     | Header        | Sidebar             |
| ---------- | -------------------------- | ------------- | ------------------- |
| **Guest**  | Header + content + footer  | Public header | None                |
| **Client** | Header + left nav + footer | Same header   | ~240px left nav     |
| **Admin**  | `<AdminShell>`      | Shell header  | Accordion nav 220px |
| **Portal** | `<AdminShell>`      | Shell header  | Accordion nav       |

Client left nav: GitHub-settings pattern — grouped sections (Projects / Orders / Support / Account), icon + label, active item with left border accent + bg tint.

---

## Don'ts

- ❌ Don't hardcode `#16a355` — use `bg-brand` / `bg-primary`.
- ❌ Don't add decorative shadows to cards — borders only.
- ❌ Don't use native `<input type="date">` — always `ui-date-picker`.
- ❌ Don't invent new card/button variants if a CVA variant fits.
- ❌ Don't treat this like consumer SaaS. It's a **developer tool.**
- ❌ Don't strip metadata in favor of whitespace — developers want IDs, statuses, and timestamps visible.
- ❌ No emoji. No bluish-purple gradients. No emoji-icon cards. No card-with-colored-left-stripe pattern.
- ❌ No glassmorphism or frosted-glass card effects.
- ❌ No springs, bounces, parallax, or on-scroll reveals beyond header collapse.
- ❌ No illustrations, hand-drawn graphics, or warm color casts.

> When updating token values, update both this file and `spec-ui-tokens.md` to stay in sync.
