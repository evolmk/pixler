# Mobile Responsive Rules (Detail/Edit Pages)

**When to read:** When building detail/edit pages. Apply these responsive patterns automatically.

---

## Breakpoint Collapse

| Element                | Desktop (`lg+`)                             | Mobile (`<lg`)                                      |
|------------------------|---------------------------------------------|-----------------------------------------------------|
| **Page layout**        | `grid grid-cols-1 lg:grid-cols-[1fr_320px]` | Single column, sidebar below main                   |
| **Sidebar**            | Fixed right column                          | Collapsible via Radix `Collapsible` + toggle header |
| **Form grids**         | `grid grid-cols-2`                          | `grid-cols-1` — all fields stack                    |
| **Card actions**       | Inline buttons                              | Stack or `flex-wrap`                                |
| **Subcollection rows** | Horizontal with badges + actions            | Badge wraps below name                              |

## Key Patterns

- **Sidebar on mobile**: `lg:hidden` collapsible section below main content; `hidden lg:block` for desktop sidebar.
- **Sticky save bar**: Fix Save/Cancel to bottom on mobile (`fixed bottom-0 inset-x-0 lg:hidden`), add
  `pb-16 lg:pb-0` to page content.
- **Touch targets**: Min `h-11` for checkboxes/switches, `py-3` min for subcollection rows,
  `size="icon-sm"` min for action buttons.
- **Drag-reorder**: Desktop grip handle visible; mobile uses "Move up/down" context menu instead.
