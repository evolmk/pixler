# Design System — Pixler

> On-demand agent reference for building Pixler UI.

**Created:** 2026-03-31 · **Updated:** 2026-05-23 (adapted for Pixler)

---

## Intent

- **Who:
  ** Developers and technical leads managing projects, workspaces, and terminal sessions. Think in repos, branches, and tasks — visit with a specific verb (create, open, sync, check).
- **Feel:
  ** Grounded and precise — like a well-organized developer tool. Not consumer-retail playful, not cold SaaS sterile.
- **Surfaces:** Technical document rendered in a browser — flat, border-separated, gray-on-white with brand-green hits.

---

## Voice & Content

For full content spec see `spec-ui-content-voice.md`. Summary:

- **Grounded, declarative, developer-to-developer.
  ** Assumes reader knows repos, branches, workspaces, terminal sessions.
- **Confident, never apologetic.** "No results" not "Sorry, we couldn't find anything."
- **Casing:** Title Case for nav/page titles · UPPERCASE WITH WIDE TRACKING for overlines · Sentence case for body.
- **Units:** durations human-readable (`2h 15m`) · counts with `tabular-nums`.
- **Emoji: never.** Use Lucide icons.
- Identifiers verbatim: `proj-abc-123`.

---

## Palette

| Token              | Value     | Tailwind                 | Usage                                            |
|--------------------|-----------|--------------------------|--------------------------------------------------|
| `--brand`          | `#16a355` | `bg-brand`, `text-brand` | Primary brand green — Pixler brand               |
| `--brand-light`    | `#22c55e` | `bg-brand-light`         | Hover, accent                                    |
| `--brand-dark`     | `#15803d` | `bg-brand-dark`          | Pressed/active                                   |
| `--footer-surface` | `#e8efe8` | `bg-footer-surface`      | Very pale gray-green — footer / landing sections |

> **Brand hex is `#16a355`.** `spec-ui-tokens.md` is the authoritative token reference.

**Single spot color.** Brand green on a neutral white-on-gray canvas. All other UI surfaces use semantic tokens (
`bg-primary`, `text-muted-foreground`, `border-border`).

**Status colors (static — don't shift with theme):**
`--status-error: #dc2626` · `--status-warning: #f59e0b` · `--status-success: #10b981` · `--status-info: #3b82f6`

---

## Typography

Font: `Inter` (variable 400–800). Base `html` font-size `14px`. See `spec-ui-typography.md` for full scale + patterns.

| Purpose          | Classes                             |
|------------------|-------------------------------------|
| Page title       | `text-3xl font-bold tracking-tight` |
| Section heading  | `text-xl font-semibold`             |
| Body (default)   | `text-sm`                           |
| Body (marketing) | `text-base`                         |
| Metadata         | `text-xs text-muted-foreground`     |

**Eyebrow / overline signature:**

```tsx
<span className="eyebrow text-muted-foreground">WORKSPACES</span>
<div className="bg-brand h-[2px] w-10"/>
```

`className="eyebrow"` = 11px / 600 / uppercase / tracking-0.025em. Pair with a color class — does not set color itself.

**Display type:** Hero numbers `text-6xl text-7xl leading-[0.9] tracking-[-0.02em]`.

**Tabular figures** for counts, metrics, timestamps: add `tabular-nums`.

---

## Depth & Cards

**Borders-first.** Cards, table rows, section containers: `border border-border bg-card` — **no shadow**.

Shadows reserved for z-layer elements only:

- Dropdowns, popovers: `shadow-md`
- Dialogs, drawer panels: `shadow-lg`

Cards:
`rounded-lg border border-border bg-card` (10px radius). No accent border-stripes, no colored gradients inside cards.

---

## Hover & Press States

| Interaction       | Pattern                                              |
|-------------------|------------------------------------------------------|
| Link / nav hover  | `text-brand` or `bg-brand/10` tint                   |
| Card hover        | `shadow-md`, optional `scale-[1.02]`, `border-brand` |
| Button press      | `active:scale-[0.98]`                                |
| Primary CTA press | `bg-brand-dark`                                      |
| Focus             | `ring-2 ring-ring focus:outline-none`                |

All transitions: `transition-all duration-200 ease`. No springs, no bounces.

---

## Header Signature (scroll states)

| State         | Background  | Height                     | Text/Icons   | Logo          |
|---------------|-------------|----------------------------|--------------|---------------|
| Default (top) | White       | 70px desktop / 60px mobile | Dark / green | Dark variant  |
| Scrolled      | Brand green | 50px desktop / 44px mobile | White        | White variant |

200ms smooth transition. Count badges stay `bg-status-error` (red) in both states.

---

## Layout Signatures

See `spec-ui-layout-signatures.md` for full recipes. Quick reference:

| Signature                    | Core classes                                                               |
|------------------------------|----------------------------------------------------------------------------|
| Overline + brand-rule + hero | `eyebrow` → `bg-brand h-[2px] w-10` → `text-6xl leading-[0.9]`             |
| Annotated diagram            | Callout pills: `bg-white/95 backdrop-blur rounded-full`                    |
| Stat chip                    | `bg-brand h-[2px] w-full` bottom underline (no pill background)            |
| Action-group header          | Projects · Workspaces · Terminal — each with `bg-status-error` count badge |
| Breadcrumb                   | At top of every detail page, ending in `font-semibold` current item        |

---

## Backgrounds & Imagery

- **White default.** No gradients on canvas.
- Hero sections: subtle gray-to-transparent wash or 5–10% brand-green radial glow.
- Blueprint grid: 32px + 8px overlay at 5–14% opacity, masked to fade vertically (technical hero variants).
- Transparency/blur: `bg-white/95 backdrop-blur` on floating callout pills only. No glassmorphism.

---

## Corner Radii

| Element                       | Class          | Value |
|-------------------------------|----------------|-------|
| Inputs, buttons (incl. CTAs)  | `rounded-md`   | 8px   |
| Cards, dialogs                | `rounded-lg`   | 10px  |
| Large containers              | `rounded-xl`   | 14px  |
| Pills, badges, avatars        | `rounded-full` | —     |
| Technical / blueprint headers | `rounded-none` | —     |

CTAs like "Create Project" use `rounded-md`. **Never `rounded-full` for buttons.**

---

## Motion

See
`spec-ui-motion.md`. Summary: 200ms ease for all transitions. No springs, parallax, on-scroll reveals (beyond header collapse). Skeleton pulse OK. Toast slide-in from bottom-right OK.

---

## App Layout

Pixler is a single web app with a three-pane layout (see SPEC §8.1):

```
┌──────────────────────────────────────────────────────────────────┐
│ Pixler  [Project ▾]  [+ Workspace]            [⌘K] [⚙] [☾] [🔔]│
├──────────────────────────────────────────────────────────────────┤
│  WORKSPACES         │  CENTER                 │  CHAT/TERMINAL   │
│  (left rail)        │  Tabs:                  │  (right)         │
│                     │   Chat | Plan | Diff |  │                  │
│  ● crimson   plan   │   Checks | PR           │  assistant-ui or │
│  ◐ cerulean  exec   │                         │  xterm.js based  │
│  ○ mint      queue  │  Bottom: composer       │  on mode         │
│                     │                         │                  │
└──────────────────────────────────────────────────────────────────┘
```

All panes resizable. Settings opens as a Vaul side drawer (~480px from right). Command palette via `⌘K`.

---

## Don'ts

- ❌ Don't hardcode `#16a355` — use `bg-brand` / `bg-primary`.
- ❌ Don't add decorative shadows to cards — borders only.
- ❌ Don't invent new card/button variants if a CVA variant fits.
- ❌ Don't treat this like consumer SaaS. It's a **developer tool.**
- ❌ Don't strip metadata in favor of whitespace — developers want IDs, statuses, and timestamps visible.
- ❌ No emoji. No bluish-purple gradients. No emoji-icon cards. No card-with-colored-left-stripe pattern.
- ❌ No glassmorphism or frosted-glass card effects.
- ❌ No springs, bounces, parallax, or on-scroll reveals beyond header collapse.
- ❌ No illustrations, hand-drawn graphics, or warm color casts.

> When updating token values, update both this file and `spec-ui-tokens.md` to stay in sync.
