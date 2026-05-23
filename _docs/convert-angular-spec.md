# Plan: Convert Imported Angular Files for Pixler (React)

## Context

Pixler is a React 19 + Vite + Tailwind v4 + Radix UI project. Files were imported from the Angular-based `Lazar_2026` monorepo — skills, specs, docs, and raw UI package files. Most of this content is Angular-specific or references the Lazar app's domain (catalog, ordering, billing, database samples). It needs to be cleaned up: delete what doesn't apply, convert what's useful to React context, and set up the theme system with light green as the default.

---

## Phase 1: Delete App-Specific / Irrelevant Content

### Delete entirely — these are Lazar app domain specs, not useful for Pixler:

- `_specs/spec-catalog/` — Lazar product catalog specs
- `_specs/spec-ordering-system/` and `_specs/spec-ordering-system.md` — Lazar billing/ordering
- `_specs/spec-database-samples/` — Lazar MongoDB samples + bundled node_modules (641 files!)
- `_specs/spec-shared-eslint-tsconfig.md` — Lazar monorepo eslint/tsconfig
- `_specs/spec-test-devices.md` — Lazar test device list

### Delete entirely — Lazar Angular app milestone plans, not relevant to Pixler:

- `_docs/plans/` — all M01–M25 milestone plans (scaffold, tokens, UI kit, API, terminal, etc.)
- `_docs/screenshots/` — screenshots from the Lazar Angular app

### Delete entirely — raw Angular package files (already extracted what we need):

- `files-from-my-angular-repo/` — entire directory. We've already read `globals.css`; the rest is Angular dist/, storybook config, angular.json, component source, etc. None of it applies to React.

### Delete Angular-specific specs from `_specs/spec-ui/`:

- `_specs/spec-ui/spec-ui-architecture.md` — Angular component architecture (signals, OnPush, ViewEncapsulation, CDK)
- `_specs/spec-ui/components/` — Angular component catalog (selectors like `ui-button`, `[uiButton]`, Angular imports)
- `_specs/spec-ui/prisma-mapping/` — Lazar Prisma model → form field mappings
- `_specs/spec-ui/spec-ui-component-recipes.md` — Angular composition patterns
- `_specs/spec-ui/spec-ui-form-patterns.md` — Angular reactive forms patterns

### Keep & update these framework-agnostic spec-ui files:

- `_specs/spec-ui/spec-ui-tokens.md` — token reference (framework-agnostic, references `globals.css`)
- `_specs/spec-ui/spec-ui-typography.md` — font scale, type patterns
- `_specs/spec-ui/spec-ui-design-system.md` — design philosophy, palette, voice (update Lazar-specific domain refs)
- `_specs/spec-ui/spec-ui-content-voice.md` — content/copy rules (update domain refs)
- `_specs/spec-ui/spec-ui-layout-patterns.md` — layout concepts (card grouping, two-column, sidebars)
- `_specs/spec-ui/spec-ui-layout-signatures.md` — signature patterns (overline+rule, etc.)
- `_specs/spec-ui/spec-ui-responsive.md` — responsive breakpoints/strategy
- `_specs/spec-ui/spec-ui-motion.md` — animation/motion guidelines
- `_specs/spec-ui/spec-ui-tailwind-gotchas.md` — Tailwind v4 gotchas (framework-agnostic)

---

## Phase 2: Delete or Update Skills

### Delete entirely — app-specific skills:

- `.claude/skills/prisma/` — Prisma Studio launcher for Lazar's DB
- `.claude/skills/plan-check/` — Lazar Kanban plan status checker (references `_plans/` directories that don't exist here)
- `.claude/skills/plan-consultant/` — Lazar plan pre-review (references `_plans/`, `CODE.md`, `_docs/best-practices/`)
- `.claude/skills/turborepo/` — Turborepo guidance (Pixler may use Turborepo eventually, but this skill is tuned for Lazar's monorepo structure)

### Rewrite — UI skill (`.claude/skills/ui/`):

The current UI skill is deeply Angular-specific (Angular signals, CVA `.variants.ts`, `@Component`, `ViewEncapsulation`, `OnPush`, `inject()`, `@angular/cdk`). Rewrite for React + Radix UI + Tailwind v4:

- **`SKILL.md`** — rewrite description, request classifier, decision protocol, coding protocol for React. Reference Radix UI primitives instead of Angular CDK. Reference `cn()` + `cva` pattern (same as shadcn/ui for React). Remove Angular-specific steps.
- **`CODING.md`** — rewrite completely for React component patterns: functional components, forwardRef, Radix UI composition, CVA variants (same pattern, different framework). Remove Angular template rules, signal API, `@Component` decorator patterns.
- **`STORYBOOK.md`** — rewrite for React Storybook (CSF3, `render` functions with JSX, no `moduleMetadata`). Keep the visual verification with Playwright section.
- **`PREFERENCES.md`** — remove Angular-specific preferences (moduleMetadata placement, custom element display, `@for`/`@if` syntax). Keep framework-agnostic ones (TW4 `theme()` gotcha, demo story layout rules adapted for React).

### Update — Code Review skill (`.claude/skills/code-review/`):

- **`SKILL.md`** — update description from "Angular, NestJS, Prisma, MongoDB" to "React, NestJS, Tailwind, TypeScript". Update the Stack-Specific Guides table: replace Angular references with React. Remove Angular Material references. Keep the generic 5-axis review (it's framework-agnostic). Update Lazar-specific Kanban references to be generic or remove them if Pixler won't use that workflow.
- **Reference files** — `reference/typescript.md`, `reference/security-review-guide.md`, `reference/performance-review-guide.md`, `reference/common-bugs-checklist.md`, `reference/code-review-best-practices.md`, `reference/architecture-review-guide.md` — these are mostly framework-agnostic. Scan for Angular-specific content and update to React where needed.

---

## Phase 3: Set Up Theme CSS

### Create `globals.css` for Pixler

Create a project-level `globals.css` (location TBD based on project structure — likely `src/globals.css` or similar once the project scaffolds) containing:

1. **All theme definitions** from the imported `globals.css` — keep all 10 color schemes (Neutral, Slate, Zinc, Stone, Gray, Rose, Blue, Green, GreenOG, Orange, Violet, Nord Ice) with light/dark variants
2. **Remove Angular Material M3 token mapping** section (`--mat-sys-*` tokens) — React doesn't use Angular Material
3. **Keep** `@theme inline` block, safe-area utilities, eyebrow utility, base layer
4. **Default theme = Green** — make the `:root` block use the Green theme values instead of Neutral, so light green is the default without needing `data-color-scheme="green"`
5. **Keep** brand tokens, status tokens, footer-surface tokens
6. **Keep** the `@import 'tw-animate-css'` and `@custom-variant dark` declarations

### Key change: Green as default

Move the current `[data-color-scheme='green']` values into `:root` (replacing the current Neutral defaults). The Neutral theme becomes `[data-color-scheme='neutral']` instead.

---

## Phase 4: Clean Up Settings & Hooks

### Update `.claude/settings.json`:

- Remove MongoDB MCP deny/ask rules (Pixler doesn't use MongoDB MCP)
- Keep the hook scripts (they're for Claude Code workflow, not Angular-specific)
- Review hook scripts for any Angular-specific content

### Clean up `_specs/` and `_docs/` directories:

- After deletions, if `_specs/` only contains `spec-ui/`, consider flattening: move spec-ui files directly into `_specs/` and rename for clarity
- Remove empty `_docs/` directory after plan/screenshot deletion, or repurpose for Pixler docs

---

## Phase 5: Update Remaining Spec Files

For each kept spec file in `_specs/spec-ui/`, do a pass to:

- Replace `@lazar/ui` → framework-agnostic or Pixler-specific references
- Replace `packages/ui/src/` paths → relevant Pixler paths
- Replace Angular-specific examples (if any) with React equivalents
- Replace `angular.json`, `public-api.ts` references → Vite/React equivalents
- Keep all design token content as-is (it's CSS-level, framework-agnostic)
- Update `spec-ui-design-system.md` to remove Lazar beverage-industry domain references and generalize for Pixler's developer-tool domain

---

## Summary of Deletions

| What | Files | Reason |
|------|-------|--------|
| `files-from-my-angular-repo/` | ~1000+ | Raw Angular package — globals.css extracted |
| `_specs/spec-catalog/` | 4 | Lazar product catalog |
| `_specs/spec-ordering-system/` | 2 | Lazar billing/ordering |
| `_specs/spec-database-samples/` | 600+ | MongoDB samples + node_modules |
| `_specs/*.md` (top-level) | 3 | Lazar eslint/tsconfig/test-devices |
| `_specs/spec-ui/` (Angular-specific) | 5 | Architecture, components, prisma-mapping, recipes, forms |
| `_docs/plans/` | 27 | Lazar milestone plans |
| `_docs/screenshots/` | 10 | Lazar app screenshots |
| `.claude/skills/prisma/` | 1 | Prisma Studio for Lazar |
| `.claude/skills/plan-check/` | 1 | Lazar Kanban checker |
| `.claude/skills/plan-consultant/` | 1 | Lazar plan pre-review |
| `.claude/skills/turborepo/` | ~15 | Lazar Turborepo config |

## Summary of Rewrites

| File | Change |
|------|--------|
| `.claude/skills/ui/SKILL.md` | Angular → React + Radix UI + Tailwind v4 |
| `.claude/skills/ui/CODING.md` | Angular component patterns → React functional components |
| `.claude/skills/ui/STORYBOOK.md` | Angular Storybook → React Storybook (CSF3) |
| `.claude/skills/ui/PREFERENCES.md` | Remove Angular prefs, keep/adapt universal ones |
| `.claude/skills/code-review/SKILL.md` | Update stack description, remove Angular specifics |
| `globals.css` (new) | Theme CSS with Green as default, no Angular Material tokens |
| `_specs/spec-ui/*.md` (6-8 files) | Remove Angular refs, generalize for React/Pixler |

## Verification

1. Confirm no Angular-specific files remain after deletions
2. Confirm `globals.css` works with Tailwind v4 (once project has Tailwind set up)
3. Confirm UI skill SKILL.md references only files that still exist
4. Confirm code-review skill references are valid
5. Run `find . -name "*.md" | xargs grep -l "Angular\|angular.json\|@Component\|OnPush\|ViewEncapsulation" --include="*.md"` to catch any remaining Angular references in kept files
