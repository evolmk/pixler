# Pixler UI — Storybook & Playwright Guide

Load this file for: `story-only` tasks, `new-component` tasks, or any time stories need to be written or updated.

---

## Updating Stories on API Changes

When a component's props or variants are added or changed, **always** update:

1. **AllVariants story** — the first story in the component's `*.stories.tsx`. Must demonstrate every prop, variant, and mode the component supports. Any new/changed API must appear here.
2. **Dedicated stories** — add or update individual stories for new/changed features that warrant standalone demonstration.
3. **Demo showcase** — if the component appears in a demo showcase story, update its section.

---

## Component Story

Stories live alongside the component source (colocated) in `src/components/ui/{name}.stories.tsx`. Use CSF3 format with `@storybook/react`.

```tsx
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Click me',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
```

---

## Showcase / Demo Story

Full-page compositions live in `src/stories/` or `src/components/demo/`.

- **Naming**: `demo-{feature}.stories.tsx` or `demo-{page-type}.stories.tsx`
- `parameters: { layout: 'fullscreen' }` — always; no `tags: ['autodocs']`
- Outer container: `<div className="min-h-screen bg-muted/20 p-[50px]">`

### Demo story rules

| Rule                 | Correct                                | Wrong                                               |
| -------------------- | -------------------------------------- | --------------------------------------------------- |
| Story format         | CSF3 with `render` returning JSX       | CSF2 with `template` function                       |
| Iteration            | `{items.map(x => <X key={x.id} />)}`  | Template directives or string-based loops            |
| Conditionals         | `{show && <X />}` or ternary           | Template directives or string-based conditionals     |
| Color tokens         | `bg-muted`, `text-muted-foreground`    | `bg-gray-100`, `text-gray-500`                      |
| TW4 arbitrary values | `file:rounded-l-md`                    | `file:rounded-l-[calc(theme(borderRadius.md)-1px)]` |
| Autodocs tag         | _(omit)_                               | `tags: ['autodocs']`                                |
| Layout param         | `parameters: { layout: 'fullscreen' }` | _(omit — small centered canvas)_                    |

### Container wrappers

```tsx
{/* Full-screen page demos: */}
<div className="min-h-screen bg-muted/20 p-[50px] space-y-8">
  {/* Fixed app shell (sidebar + main): */}
  <div className="flex h-screen overflow-hidden bg-background"></div>
</div>
```

---

## Visual Verification with Playwright MCP

After writing a story, verify with Playwright:

1. Storybook running: `pnpm storybook` (port **6006**)
2. Story URL: `http://localhost:6006/?path=/story/{story-id}--default`

**ID derivation** — lowercase, spaces → `-`, slashes → `-`, special chars dropped:

| Title                   | Export     | Story ID                         |
| ----------------------- | ---------- | -------------------------------- |
| `Demos/Form - Edit`     | `Default`  | `demos-form---edit--default`     |
| `Demos/Components Demo` | `Default`  | `demos-components-demo--default` |
| `Components/Button`     | `Variants` | `components-button--variants`    |

**Common Playwright findings:**

| Symptom                   | Root Cause                      | Fix                                       |
| ------------------------- | ------------------------------- | ----------------------------------------- |
| White screen              | Runtime render error            | Check browser console for React errors    |
| Nothing renders           | Missing default export in story | Ensure `export default meta` is present   |
| Component not interactive | Missing event handler           | Add `onClick` / `onChange` etc. to props   |
| Styling looks wrong       | Missing `cn()` or wrong tokens  | Verify `cn()` merges `className` properly |
| `file:` pseudo broken     | `theme()` TW4 incompatibility   | Replace `theme()` with static class       |
