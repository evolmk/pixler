---
name: ui
description: |
  Use for any UI work in the Pixler design system: components, layouts,
  forms, pages, overlays, and data display. React 19 + Tailwind v4 + Radix UI + CVA.

  Triggers on: component, layout, form, page, storybook, style, template, variant, tailwind,
  modal, tabs, dropdown, badge, icon, avatar, toast, button, dialog, navigation, overlay,
  mobile, responsive, css, color, theme,
  "src/components", "ui", "radix"
---

# Pixler UI Design System Skill

Pixler uses a **React 19 + Tailwind v4 + Radix UI + CVA** component stack with `cn()` (clsx + tailwind-merge) for class merging. Components live in `packages/ui/src/components/` as single-file `.tsx` modules (shadcn/ui style). The Angular source library at `shared-packages-from-lazar-angular-app/ui-components-library/` can be referenced for component API inspiration when building React equivalents.

---

## Request Classifier — Do This First

Classify the request before loading any spec files.

| Type              | Criteria                                                                        | Spec files to load                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **style-tweak**   | Change appearance of a named, existing component (color, spacing, font, border) | `spec-ui-tokens.md` only (skip catalog — check component source directly)                                                       |
| **variant-add**   | Add a new CVA variant to an existing component                                  | Component source (`.tsx`) + `spec-ui-tokens.md`                                                                                 |
| **story-only**    | Write or update a Storybook story                                               | Component source + `STORYBOOK.md`                                                                                               |
| **compose**       | Compose existing components in app code                                         | Component source files as needed + `spec-ui-tokens.md`                                                                          |
| **new-component** | Build a new primitive in `packages/ui/src/components/`                                   | `spec-ui-tokens.md` + `STORYBOOK.md`                                                                                           |
| **page-build**    | Build a full page or view                                                       | `spec-ui-layout-patterns.md` + `spec-ui-tokens.md`. Guest/client: also `spec-ui-design-system.md` + `spec-ui-content-voice.md` + `spec-ui-layout-signatures.md` |
| **unclear**       | Cannot classify from the request                                                | Browse `packages/ui/src/components/` to understand available components, then reassess                                                    |

**Component API lookup:** Read the component's `.tsx` file in `packages/ui/src/components/` for its props, variants, and usage. For stories, check the colocated `.stories.tsx`.

**Style-tweak fast path:** Skip catalog entirely. Go directly to the component source file and `spec-ui-tokens.md`.

---

## Step 0 — Reference Input (Visual Context, Optional)

If the user provided a **screenshot** — analyze layout, components, spacing, color cues. If a **URL** — use `WebFetch` for layout/design inspiration. **Text only** — proceed to Step 1.

---

## Step 1 — Analysis Phase (ALWAYS run before writing any code)

**Before writing a single line of React or Tailwind, do this analysis and report findings to the user:**

### 1a. Scan available components

Browse `packages/ui/src/components/` to identify existing components that may satisfy the request.

### 1b. Cross-reference request against existing components

For every UI element in the request, ask:

| Question                                                         | If YES                                           | If NO                                              |
| ---------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| Does a component with this name already exist in `packages/ui/src/components/`? | **Reuse it as-is**                               | Create a new component                             |
| Does it exist but need a different visual style (color, size, shape)?  | **Add a new CVA variant** to the component file  | Check if it's a composition of existing components |
| Can it be composed from 2-3 existing components?                       | **Compose them** (no new files)                  | Only then create a new component                   |

### 1c. Report before coding

Tell the user:

```
Component Mapping:
  [element name] -> Card (use as-is, variant="bordered")
  [element name] -> Button needs new variant "brand-solid" -> will extend buttonVariants
  [element name] -> no match, composing from Card + Badge
  [element name] -> no match, requires new component: [name]
```

Only proceed to coding after this mapping is confirmed (or the user says to proceed).

### 1d. Page-specific analysis (page-build only — skip for all other tasks)

**Design:** Let data model complexity drive UI decisions — fields, collections, workflows lead to modern, scannable, information-dense layout.

**Before building, answer:** (1) Primary action — edit, review, approve, or monitor? Drives editable vs read-only fields. (2) Data hierarchy — which 2-3 fields does the user need instantly? Drives header/sidebar placement. (3) Workflow states — lifecycle (draft, active, archived)? Drives status badge + state-transition actions.

**Load on-demand:** `spec-ui-layout-patterns.md` (card grouping, two-column decision, sidebar assignment)

---

## Step 2 — Decision Protocol

### Priority Order (highest to lowest)

1. **Reuse as-is**: Use an existing component with an existing variant — add nothing.
2. **Extend variant**: The component exists but needs a new visual style — add to its CVA variants.
3. **Compose**: Build from existing components in the consuming page/feature — no new `packages/ui/src/components/` files.
4. **New component**: Only when the UI pattern is genuinely absent. Requires clear justification.

### Variant vs New Component

| Situation                                  | Action                                               |
| ------------------------------------------ | ---------------------------------------------------- |
| Same component, different color palette    | Add color variant to the CVA definition              |
| Same component, different size/density     | Add size variant to the CVA definition               |
| Same component, different border/shape     | Add `rounded` or `shadow` variant                    |
| Fundamentally different DOM structure      | Consider new component                               |
| Combines 2+ existing components with logic | Build as a composed component in `src/components/`   |

---

## Step 3 — Coding Protocol

**Read `.claude/skills/ui/CODING.md`** for component templates, variant extension, composition patterns, icon usage, and architecture constraints.

Load CODING.md for: `variant-add`, `new-component`, `compose`, `page-build`.
Skip for: `style-tweak`, `story-only`, `unclear`.

---

## Step 4 — Storybook Stories

**Read `.claude/skills/ui/STORYBOOK.md`** for all story writing and Playwright verification instructions (component stories, showcase/demo stories, Playwright visual verification, ID derivation, common failure fixes).

---

## Step 5 — Learning Protocol

**After completing the build, always ask:**

> "Were there any adjustments you had to make — visual tweaks, spacing, colors, or structural changes — that you'd want me to remember for next time? I can save them as standing preferences."

If the user says yes (or describes something they always need):

1. Check `.claude/skills/ui/PREFERENCES.md` for an existing entry on that topic
2. If it exists, update it. If not, add a new entry.
3. Tell the user what was saved.

**Also watch for recurring patterns mid-session.** If you notice the user making the same type of correction more than once (e.g., "always add a border to cards", "use `soft` not `solid` buttons in forms"), proactively ask:

> "I've noticed you consistently [observation]. Want me to save that as a standing preference?"

---

## Step 6 — Preferences (Build Tasks Only)

Read `.claude/skills/ui/PREFERENCES.md` for build tasks (`variant-add`, `new-component`, `compose`, `page-build`). Skip for `style-tweak`, `story-only`, `unclear`. Apply all standing preferences automatically.

---

## References

Spec files live in `_specs/spec-ui/` — load on-demand per the Request Classifier above. Key entry points:

- **Tokens/colors:** `_specs/spec-ui/spec-ui-tokens.md`
- **Typography:** `_specs/spec-ui/spec-ui-typography.md`
- **Design system:** `_specs/spec-ui/spec-ui-design-system.md` — palette, depth, surfaces, typography, spacing, header/footer/nav patterns. Load for any layout/design work.
- **Content voice:** `_specs/spec-ui/spec-ui-content-voice.md` — voice, casing, units, copy rules. Load for any page-build or when writing UI strings.
- **Layout patterns:** `_specs/spec-ui/spec-ui-layout-patterns.md` — card grouping, two-column decisions, sidebar assignment.
- **Layout signatures:** `_specs/spec-ui/spec-ui-layout-signatures.md` — overline+rule, annotated diagram, spec chip, triple basket, header scroll, breadcrumb, megamenu.
- **Responsive:** `_specs/spec-ui/spec-ui-responsive.md`
- **Motion:** `_specs/spec-ui/spec-ui-motion.md` — Framer Motion patterns and animation guidelines.
- **Tailwind gotchas:** `_specs/spec-ui/spec-ui-tailwind-gotchas.md`
