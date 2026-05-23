# Layout Patterns

Full-page and section layout patterns using UI components.

---

## 1. Admin Shell Layout

Use `<AdminShell>` — the canonical admin layout. Provides collapsible sidebar, topbar with section switcher + breadcrumbs + search + notifications + theme selector + user menu, and a scrollable content area with `<Outlet />`.

### Key Inputs

| Input                                   | Type                     | Purpose                         |
| --------------------------------------- | ------------------------ | ------------------------------- |
| `navItems`                              | `AdminNavItem[]`         | Sidebar navigation tree         |
| `userName`, `userEmail`, `userInitials` | `string`                 | User menu display               |
| `appName`                               | `string`                 | Sidebar header brand            |
| `notificationCount`                     | `number`                 | Bell badge count                |
| `showSearch`                            | `boolean`                | Enable `Cmd+K` search           |
| `breadcrumbLabels`                      | `Record<string, string>` | URL segment → display label map |
| `homeRoute`, `homeLabel`                | `string`                 | Breadcrumb root link            |

Callbacks: `onLogout`, `onSettings`, `onSearch`.

### Types

```typescript
interface AdminNavItem {
  label: string;
  route: string;
  iconPaths: string[]; // heroicons SVG path d values
  children?: AdminNavChild[];
}
interface AdminNavChild {
  label: string;
  route: string;
}
interface AdminBreadcrumb {
  label: string;
  url: string;
}
```

### Sidebar Dimensions

- Expanded: `220px`, collapsed: `52px` (animated `transition-[width] duration-300`)
- Active item: `bg-sidebar-primary text-sidebar-primary-foreground`
- Children: `ml-3 border-l border-sidebar-border/40 pl-3`

### Behaviors

- **Sidebar collapse**: `useSidebar().toggleCollapse()`
- **Auto breadcrumbs**: Built from URL segments, customizable via `breadcrumbLabels`
- **Section switcher**: Topbar dropdown shows all top-level nav items
- **Keyboard shortcut**: `Cmd+K` / `Ctrl+K` triggers `onSearch`
- **Active route**: prefix matching — `/projects` matches `/projects/settings`
- **Nav expansion**: Items with `children` auto-expand when route is active

## 2. Stacked Layout (Marketing / Guest)

No sidebar — top `<Navbar>` + `<main class="flex-1">` with `<Outlet />` + footer. Wrap in `min-h-screen flex flex-col bg-background`.

## 3. Common Page Patterns

- **Dashboard**: `space-y-6` stack — page header row, stats grid (4 cols), two-column grid (chart + activity), full-width table card.
- **Detail (split)**: `grid grid-cols-1 lg:grid-cols-[1fr_320px]` — main content left, metadata sidebar right. Breadcrumb above.
- **List (CRUD)**: Header row (title + "Add" button), `<Card>` wrapping `<DataTable>`.
- **Empty state**: Centered card with icon, heading, description, CTA button.

---

## Card Grouping Heuristics

Group fields into cards by priority:

| Rule                  | Example                                | Card Title                             |
| --------------------- | -------------------------------------- | -------------------------------------- |
| **Explicit prefix**   | `billing*`, `shipping*`                | "Billing", "Shipping"                  |
| **Semantic cluster**  | `companyName` + `abbr` + `website`     | "General Information"                  |
| **Type cluster**      | All `Float` fields with currency hints | "Payment & Billing"                    |
| **Remaining scalars** | Ungrouped string/text                  | "General Information" (catch-all)      |
| **Booleans/toggles**  | `isActive`, `taxCode`                  | Sidebar — edit: "Status"; detail: omit |
| **Embedded arrays**   | `contacts[]`, `addresses[]`            | One card per subcollection             |

**Within each card**: name/title first (full-width), short text in 2-col grid, longer text full-width, numbers in 2-col grid, selects after text, required before optional.

## Two-Column Layout Decision

Use `grid grid-cols-1 lg:grid-cols-[1fr_320px]` when the model has **any** of: a status/state field, 3+ ObjectId refs, workflow states, or `created`/`lastChange` metadata. Single-column when <8 fields and no status/reference fields.

## Sidebar Content Assignment

- **Detail pages**: info-display (metadata, aggregates, read-only).
- **Edit pages**: config-focused (status dropdowns, toggles, settings).

Shared: top = most important, system metadata at bottom as `text-xs`, fixed `320px` width, each group its own `<Card>` with `space-y-6`, no embedded arrays in sidebar.

## Danger Zone

Last card in main column for entities supporting delete/archive. `border-destructive/50` card with destructive button. Only for existing entities, never in sidebar.

---

## Guest & Client App — Signature Patterns

See **`spec-ui-layout-signatures.md`** for full recipes.

| Signature                     | When to use                                   |
| ----------------------------- | --------------------------------------------- |
| Overline + brand-rule + hero  | Section introductions, page headers           |
| Annotated diagram             | Detail hero — numbered callout pills          |
| Spec chip w/ bottom underline | Spec values on detail pages                   |
| Action-group header           | Header — Projects / Workspaces / Terminal     |
| Header scroll states          | White (top) → brand-green (scrolled)          |
| Breadcrumb                    | Top of every Guest/Client detail page         |
| Megamenu                      | Desktop hover-triggered navigation            |
