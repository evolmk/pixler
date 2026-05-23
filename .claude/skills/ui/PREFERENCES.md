# UI Skill — Standing Preferences

These are persistent preferences captured from past sessions.
Claude reads this file at the start of every UI build task and applies them automatically.

> Add entries here manually or let Claude save them after a build session.
> Format: one preference per section, with a short description + the rule to apply.

---

## Don't automatically read existing pages as reference for new page builds, ask user b4 attempting to.

Existing page components in `src/pages/` or `src/app/` may be outdated and use old patterns.
When building a new page (detail, edit, or list), don't read another page file to "see how it's done" unless specified to do so.
Build exclusively from the spec files in `_specs/spec-ui/`. If the spec doesn't cover it, ask the user.

---

## Demo stories: always fullscreen, never autodocs

Demo stories in `src/stories/` or `src/components/demo/` must always use:

- `parameters: { layout: 'fullscreen' }` in meta
- NO `tags: ['autodocs']` — this causes stories to render inside a bordered iframe in the Docs tab

## Demo stories: 50px padding on outer container

When wrapping demo content use `p-[50px]` on the outermost div, not `p-8` or a container component.

## Tailwind v4: no theme() in arbitrary values

`theme()` inside arbitrary values (e.g. `calc(theme(borderRadius.md)-1px)`) is TW3 syntax only.
In TW4, use the nearest static utility instead: `file:rounded-l-md` not `file:rounded-l-[calc(theme(borderRadius.md)-1px)]`.

## Prefer composition over prop drilling

Favor React composition patterns (children, render props, compound components) over deeply
nested config objects or excessive prop drilling. When a component needs to be flexible,
expose slots via children or named sub-components rather than adding more and more props.

```tsx
// ✅ Composition — flexible and readable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

// ❌ Prop drilling — rigid and hard to extend
<Card title="Title" content={...} headerAction={...} footerAction={...} />
```
