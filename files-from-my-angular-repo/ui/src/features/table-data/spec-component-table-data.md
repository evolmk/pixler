# Table Data Component (`ui-table-data`)

> Feature-level data table for `@lazar/ui`. A composable, server-driven table with tabs, search, filters, sorting, pagination, row selection, and pluggable cell renderers. Designed for admin CRUD pages with minimal markup.

---

## Architecture

```
ui-table-data                          ← Root orchestrator (state + events)
├── ui-table-data-filter-drawer        ← Right-side drawer (lives outside the card)
│   ├── ui-drawer
│   └── ui-checkbox (per filter option)
├── ui-card
│   ├── ui-table-data-header           ← Tabs + search + filter/sort buttons
│   │   ├── ui-tabs (underline variant)
│   │   ├── ui-searchbox
│   │   ├── ui-badge (filter count, tab counts)
│   │   └── ui-button (filter, sort)
│   ├── ui-separator
│   ├── ui-table-data-table            ← Checkbox column + header + rows + cells
│   │   ├── ui-table / ui-table-header / ui-table-body / ui-table-row / ui-table-head / ui-table-cell
│   │   ├── ui-checkbox (select-all + per-row)
│   │   ├── ui-cell-company            ← Avatar + name + description
│   │   ├── ui-cell-contact            ← Avatar + name
│   │   ├── ui-cell-flag-location      ← Flag emoji + location text
│   │   └── ui-cell-status-pill        ← Colored badge pill
│   ├── ui-separator
│   └── ui-table-data-footer           ← Page-size select + "Showing X-Y of Z" + pagination
│       ├── ui-select
│       └── ui-pagination
```

### Design philosophy

- **Dumb component** — no data fetching, no services, no adapters. The parent page owns all data and logic.
- **Event-driven** — every user action (tab switch, search, filter, sort, page change, selection) emits an output. The parent reacts by calling its API and updating `[data]` + `[total]`.
- **Generic** — typed as `TableDataComponent<T>` where `T extends Record<string, unknown>`. Works with any row shape.
- **Minimal markup** — a single `<ui-table-data>` tag with inputs/outputs replaces hundreds of lines of table boilerplate.

---

## Quick Start

### 1. Import

```typescript
import {
  TableDataComponent,
  TableDataHeaderComponent,
  TableDataTableComponent,
  TableDataFooterComponent,
  TableDataFilterDrawerComponent,
  CellCompanyComponent,
  CellContactComponent,
  CellFlagLocationComponent,
  CellStatusPillComponent,
} from '@lazar/ui'; // once added to public-api.ts
```

All 9 components must be in the `imports` array of your page component.

### 2. Define your row interface

```typescript
interface Machine {
  id: string;
  name: string;
  model: string;
  imageUrl: string | null;
  serialNumber: string;
  location: string;
  flag: string;
  operatorName: string;
  operatorAvatar: string | null;
  status: string;
}
```

### 3. Define columns

```typescript
import { TableDataColumn } from '@lazar/ui';

const COLUMNS: TableDataColumn<Machine>[] = [
  {
    key: 'name',
    label: 'Machine',
    cellType: 'company',
    sortable: true,
    width: '240px',
    cellData: { descriptionKey: 'model', avatarKey: 'imageUrl' },
  },
  {
    key: 'serialNumber',
    label: 'Serial #',
    cellType: 'text',
    width: '160px',
  },
  {
    key: 'location',
    label: 'Location',
    cellType: 'flag-location',
    sortable: true,
    width: '180px',
    cellData: { flagKey: 'flag' },
  },
  {
    key: 'operatorName',
    label: 'Operator',
    cellType: 'contact',
    width: '200px',
    cellData: { avatarKey: 'operatorAvatar' },
  },
  {
    key: 'status',
    label: 'Status',
    cellType: 'status-pill',
    sortable: true,
    width: '140px',
    cellData: {
      colorMap: {
        Running: 'green',
        Idle: 'gray',
        Maintenance: 'orange',
        Error: 'red',
      },
    },
  },
];
```

### 4. Template (minimal)

```html
<ui-table-data
  [data]="machines()"
  [columns]="columns"
  [total]="totalCount()"
  [loading]="loading()"
  [pageSize]="25"
  (searchChange)="onSearch($event)"
  (sortChange)="onSort($event)"
  (pageChange)="onPage($event)"
  (pageSizeChange)="onPageSize($event)"
  (selectionChange)="onSelect($event)"
/>
```

That's it for a basic table. Tabs, filters, and the sort button are optional — omit their inputs and they disappear.

---

## Full Integration Example

```typescript
@Component({
  selector: 'app-machines-page',
  standalone: true,
  imports: [
    TableDataComponent,
    TableDataHeaderComponent,
    TableDataTableComponent,
    TableDataFooterComponent,
    TableDataFilterDrawerComponent,
    CellCompanyComponent,
    CellContactComponent,
    CellFlagLocationComponent,
    CellStatusPillComponent,
  ],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Machines</h1>

      <ui-table-data
        [data]="machines()"
        [columns]="columns"
        [tabs]="tabs()"
        defaultTab="all"
        [filterSections]="filterSections"
        [total]="totalCount()"
        [loading]="loading()"
        [pageSize]="25"
        rowKey="id"
        (tabChange)="onTabChange($event)"
        (searchChange)="onSearch($event)"
        (sortChange)="onSort($event)"
        (filterChange)="onFilterChange($event)"
        (selectionChange)="onSelectionChange($event)"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
      />

      <!-- Bulk action bar (you build this yourself) -->
      @if (selectedMachines().length > 0) {
        <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border rounded-lg shadow-lg p-3 flex gap-2">
          <span class="text-sm">{{ selectedMachines().length }} selected</span>
          <button (click)="bulkExport()">Export</button>
          <button (click)="bulkDelete()" class="text-destructive">Delete</button>
        </div>
      }
    </div>
  `,
})
export class MachinesPageComponent {
  private api = inject(MachineService);

  machines = signal<Machine[]>([]);
  totalCount = signal(0);
  loading = signal(false);
  selectedMachines = signal<Machine[]>([]);

  // Query state
  private query = signal({
    tab: 'all',
    search: '',
    sort: null as TableDataSort | null,
    filters: {} as TableDataFilterState,
    page: 1,
    pageSize: 25,
  });

  columns = COLUMNS; // from above

  tabs = signal<TableDataTab[]>([
    { value: 'all', label: 'All', count: 0 },
    { value: 'running', label: 'Running', count: 0 },
    { value: 'idle', label: 'Idle', count: 0 },
  ]);

  filterSections: TableDataFilterSection[] = [
    { key: 'status', label: 'Status', type: 'checkbox', options: ['Running', 'Idle', 'Maintenance', 'Error'] },
    { key: 'location', label: 'Location', type: 'checkbox', options: ['USA', 'Germany', 'Italy'] },
  ];

  constructor() {
    // Re-fetch whenever query changes
    effect(() => {
      const q = this.query();
      this.fetchData(q);
    });
  }

  private async fetchData(q: typeof this.query extends Signal<infer U> ? U : never) {
    this.loading.set(true);
    const res = await this.api.list({
      tab: q.tab,
      search: q.search,
      sortBy: q.sort?.columnKey,
      sortDir: q.sort?.direction,
      filters: q.filters,
      page: q.page,
      pageSize: q.pageSize,
    });
    this.machines.set(res.items);
    this.totalCount.set(res.total);
    this.loading.set(false);
  }

  onTabChange(tab: string) {
    this.query.update((q) => ({ ...q, tab, page: 1 }));
  }
  onSearch(search: string) {
    this.query.update((q) => ({ ...q, search, page: 1 }));
  }
  onSort(sort: TableDataSort) {
    this.query.update((q) => ({ ...q, sort }));
  }
  onFilterChange(filters: TableDataFilterState) {
    this.query.update((q) => ({ ...q, filters, page: 1 }));
  }
  onPageChange(page: number) {
    this.query.update((q) => ({ ...q, page }));
  }
  onPageSizeChange(pageSize: number) {
    this.query.update((q) => ({ ...q, pageSize, page: 1 }));
  }
  onSelectionChange(items: Machine[]) {
    this.selectedMachines.set(items);
  }
}
```

---

## API Reference

### `<ui-table-data>` — Main Component

| Input            | Type                       | Default      | Description                                      |
| ---------------- | -------------------------- | ------------ | ------------------------------------------------ |
| `data`           | `T[]`                      | **required** | Row data for the current page                    |
| `columns`        | `TableDataColumn<T>[]`     | **required** | Column definitions (see below)                   |
| `tabs`           | `TableDataTab[]`           | `[]`         | Tab definitions. Omit to hide tabs               |
| `defaultTab`     | `string`                   | `''`         | Initially active tab value                       |
| `filterSections` | `TableDataFilterSection[]` | `[]`         | Filter drawer config. Omit to hide filter button |
| `loading`        | `boolean`                  | `false`      | Shows skeleton rows when `true`                  |
| `rowKey`         | `keyof T`                  | `'id'`       | Unique identifier property on each row           |
| `pageSize`       | `number`                   | `25`         | Rows per page                                    |
| `total`          | `number`                   | `0`          | Total record count (for pagination math)         |
| `class`          | `string`                   | `''`         | Additional CSS classes on the host               |

| Output            | Payload                | Description                                             |
| ----------------- | ---------------------- | ------------------------------------------------------- |
| `tabChange`       | `string`               | Tab value when the active tab changes                   |
| `searchChange`    | `string`               | Search query string on every keystroke                  |
| `sortChange`      | `TableDataSort`        | Sort column + direction when a column header is clicked |
| `sortClick`       | `void`                 | Header sort button was clicked                          |
| `filterChange`    | `TableDataFilterState` | Full filter state when filters are saved in the drawer  |
| `selectionChange` | `T[]`                  | Array of selected row objects                           |
| `pageChange`      | `number`               | New page index (1-based)                                |
| `pageSizeChange`  | `number`               | New page size (0 = "all")                               |

### Auto-reset behavior

The component auto-resets `pageIndex` to 1 on: tab change, filter save, filter clear, page-size change.

---

## Type Reference

### `TableDataColumn<T>`

```typescript
interface TableDataColumn<T = Record<string, unknown>> {
  key: keyof T & string; // Row property to read
  label: string; // Column header text
  visible?: boolean; // Default: true. Set false to hide
  sortable?: boolean; // Shows sort arrow in header
  width?: string; // CSS width (e.g. '240px', '15%')
  cellType: TableDataCellType; // Renderer type
  cellData?: TableDataCellData; // Extra config per cellType
}
```

### `TableDataCellType`

| Type              | Renders                                       | Required `cellData`           |
| ----------------- | --------------------------------------------- | ----------------------------- |
| `'text'`          | Plain `<span>`                                | None                          |
| `'company'`       | Avatar + name + description (two lines)       | `descriptionKey`, `avatarKey` |
| `'contact'`       | Small avatar + name                           | `avatarKey`                   |
| `'flag-location'` | Flag emoji + location text                    | `flagKey`                     |
| `'status-pill'`   | Colored badge pill                            | `colorMap`                    |
| `'custom'`        | Falls through to plain `<span>` (see roadmap) | None                          |

### `TableDataCellData`

```typescript
interface TableDataCellData {
  descriptionKey?: string; // Row key for subtitle text (company cell)
  flagKey?: string; // Row key for flag emoji (flag-location cell)
  avatarKey?: string; // Row key for avatar URL (company/contact cells)
  colorMap?: Record<string, TableDataStatusColor>; // Value → color (status-pill)
  maxLength?: number; // Truncation limit (defined but NOT wired yet)
}
```

### `TableDataStatusColor`

`'green' | 'blue' | 'orange' | 'red' | 'gray'`

Maps to badge variants: green → `success`, blue → `info`, orange → `warning`, red → `destructive`, gray → `secondary`.

### `TableDataTab`

```typescript
interface TableDataTab {
  value: string; // Unique identifier
  label: string; // Display text
  count: number; // Badge count shown next to label
}
```

### `TableDataFilterSection`

```typescript
interface TableDataFilterSection {
  key: string; // Unique section identifier
  label: string; // Section heading in drawer
  type: 'checkbox' | 'tags'; // 'tags' defined but not visually differentiated yet
  options?: string[]; // Available filter values
}
```

### `TableDataFilterState`

```typescript
type TableDataFilterState = Record<string, string[]>;
// Example: { status: ['Active', 'Archived'], location: ['USA'] }
```

### `TableDataSort`

```typescript
interface TableDataSort {
  columnKey: string;
  direction: 'asc' | 'desc' | null;
}
```

---

## Feature Details

### Tabs

- Pass `[tabs]` and `defaultTab` to show an underline tab bar above the search/filter controls.
- Each tab shows a badge with `count`. Active tab badge uses `info` variant; inactive uses `secondary`.
- `(tabChange)` emits the tab `value` string. Page resets to 1 on tab change.
- Omit `[tabs]` entirely to hide the tab row — the header shows only search + filter + sort.

### Search

- Built-in search box (220px, sm size) always visible in the header.
- `(searchChange)` emits on every keystroke. You debounce and filter server-side.
- The component does NOT filter `data` locally — you must pass pre-filtered data.

### Filters (Drawer)

- Pass `[filterSections]` to enable the filter button. Omit to hide it.
- Clicking "Filters" opens a right-side drawer with checkbox sections.
- Edits are local to the drawer until the user clicks **Save** — no live filtering while browsing.
- **Save** emits `(filterChange)` with the full `TableDataFilterState` and closes the drawer.
- **Clear all filters** resets state to `{}`, emits `(filterChange)`, and closes.
- Per-section **Clear** links appear when that section has selections.
- A badge on the filter button shows the total count of active filter values. An X button appears to clear all filters without opening the drawer.

### Sorting

There are two sort mechanisms:

1. **Column header sort arrows** — each column with `sortable: true` shows a clickable arrow icon. Clicking cycles: `asc` → `desc` → `null` (clear). Switching to a different column starts at `asc`. Emits `(sortChange)` with `{ columnKey, direction }`.

2. **Header sort button** — shows the current sort state as a label (e.g. "name ↑" or just "Sort"). Clicking emits `(sortClick)` — intended for opening a sort popover/dropdown (not built-in, wire it yourself).

### Pagination

- Footer shows a page-size selector (10, 25, 50, 100, All) + "Showing X–Y of Z" text + prev/next pagination.
- `(pageChange)` emits 1-based page index. `(pageSizeChange)` emits the numeric size (0 = all).
- Pass `[total]` for correct pagination math — this is the total count from your API, not `data.length`.
- Page resets to 1 on tab change, filter change, and page-size change.

### Row Selection

- Every row has a checkbox. The header has a select-all checkbox.
- Select-all toggles all rows on the **current page** only.
- Indeterminate state shows when some (but not all) current-page rows are selected.
- `(selectionChange)` emits the full array of selected `T[]` objects.
- Selected rows get a `bg-muted/40` highlight.
- **You build the bulk action bar yourself** — the component only gives you the selected items.

### Loading State

- Pass `[loading]="true"` to show 5 skeleton rows with animated pulse placeholders.
- Typically set `loading` to `true` before your API call and `false` after.

### Empty State

- When `data` is empty and `loading` is `false`, shows "No results found." centered in the table body.

---

## Cell Renderers

### `ui-cell-company`

Two-line cell with an avatar. Good for any primary entity column.

| Input         | Type             | Default      |
| ------------- | ---------------- | ------------ |
| `name`        | `string`         | **required** |
| `description` | `string`         | `''`         |
| `avatarSrc`   | `string \| null` | `null`       |

Fallback avatar: first letter of `name` on a deterministic colored background.

### `ui-cell-contact`

Single-line cell with a small circular avatar. Good for person references.

| Input       | Type             | Default      |
| ----------- | ---------------- | ------------ |
| `name`      | `string`         | **required** |
| `avatarSrc` | `string \| null` | `null`       |

Fallback avatar: initials (first two initials or first 2 chars) on a deterministic colored background.

### `ui-cell-flag-location`

Flag emoji + location text in a flex row.

| Input      | Type             |
| ---------- | ---------------- |
| `flag`     | `string` (emoji) |
| `location` | `string`         |

### `ui-cell-status-pill`

Colored badge pill with a leading dot character.

| Input   | Type                   | Default      |
| ------- | ---------------------- | ------------ |
| `label` | `string`               | **required** |
| `color` | `TableDataStatusColor` | `'blue'`     |

---

## File Structure

```
features/table-data/
├── index.ts                        # Barrel export
├── table-data.stories.ts           # 5 Storybook stories
├── spec-component-table-data.md              # This file
├── cells/
│   ├── cell-company.component.ts   # ui-cell-company
│   ├── cell-contact.component.ts   # ui-cell-contact
│   ├── cell-flag-location.component.ts  # ui-cell-flag-location
│   └── cell-status-pill.component.ts    # ui-cell-status-pill
├── components/
│   ├── table-data.component.ts     # ui-table-data (root)
│   ├── table-data-header.component.ts   # Tabs + search + filter/sort
│   ├── table-data-table.component.ts    # Table rendering + selection
│   ├── table-data-footer.component.ts   # Pagination + page size
│   └── table-data-filter-drawer.component.ts  # Filter drawer
├── types/
│   ├── index.ts
│   ├── column.types.ts             # TableDataColumn, TableDataCellType, etc.
│   ├── filter.types.ts             # TableDataFilterSection, TableDataFilterState
│   ├── sort.types.ts               # TableDataSort, SortDirection
│   └── tab.types.ts                # TableDataTab
└── utils/
    └── avatar-color.ts             # Deterministic avatar background color
```

---

## Current Status

### Working

- [x] Column definitions with type-safe generic `<T>`
- [x] 5 built-in cell types (text, company, contact, flag-location, status-pill)
- [x] Tabs with badge counts (underline variant)
- [x] Search box with `(searchChange)` output
- [x] Filter drawer with checkbox sections, save/clear, local state isolation
- [x] Filter badge count + inline clear button
- [x] Column header sort arrows (asc → desc → null cycle)
- [x] Header sort button with active sort label
- [x] Pagination with page-size selector (10/25/50/100/All)
- [x] "Showing X–Y of Z" text
- [x] Row selection with select-all/indeterminate/per-row checkboxes
- [x] `(selectionChange)` output with full selected `T[]` objects
- [x] Selected row highlight (`bg-muted/40`)
- [x] Loading skeleton state (5 animated rows)
- [x] Empty state ("No results found.")
- [x] Auto page-reset on tab/filter/page-size changes
- [x] Column visibility toggle (`visible: false`)
- [x] Deterministic avatar colors from name hashing
- [x] Storybook stories (Default, WithFiltersActive, Loading, Empty, NoTabs)

### Not Yet Implemented

- [ ] **`public-api.ts` export** — feature is not exported from `@lazar/ui`. Must add exports to `public-api.ts` and fix `package.json` subpath (currently `./table-data` points to old `data-table` feature).
- [ ] **Custom cell templates** — `cellType: 'custom'` falls through to plain `<span>`. Needs `ng-template` / content projection support for consumer-defined cell rendering (e.g. action buttons, links, images).
- [ ] **Row action column** — no built-in edit/delete/context-menu per row. Consumers would need a custom cell or an actions column definition. Consider an `'actions'` cellType with configurable buttons.
- [ ] **Bulk action bar** — `selectionChange` works, but there is no built-in floating toolbar when rows are selected. The consuming page must build its own.
- [ ] **`maxLength` truncation** — defined in `TableDataCellData` but not wired into any cell renderer.
- [ ] **`'tags'` filter type** — defined in the type but renders identically to `'checkbox'` in the drawer.
- [ ] **Server-side search debounce** — `searchChange` fires on every keystroke. A built-in debounce option would reduce API calls.
- [ ] **Column resizing** — no drag-to-resize. Widths are static CSS values.
- [ ] **Column reordering** — no drag-and-drop column reordering.
- [ ] **Sticky header** — table header does not stick on vertical scroll.
- [ ] **Row click handler** — no `(rowClick)` output for navigating to a detail page.
- [ ] **Expandable rows** — no row expansion for nested details.
- [ ] **Date/currency/number cell types** — only text-based cells exist. Formatted cell types would reduce consumer boilerplate.
- [ ] **Export** — no built-in CSV/Excel export.
- [ ] **Column visibility menu** — `visible` exists on the type, but there is no UI to let users toggle columns.
- [ ] **Persisted state** — no built-in saving of page size, sort, filters to URL params or localStorage.
- [ ] **Accessibility** — no ARIA roles on the custom sort/filter buttons beyond `aria-hidden` on SVG icons.
- [ ] **Dark mode testing** — stories exist but dark-mode-specific visual testing is not documented.

### Priority Recommendations

| Priority | Feature                                       | Why                                                      |
| -------- | --------------------------------------------- | -------------------------------------------------------- |
| **P0**   | Public API export                             | Cannot be used by apps without this                      |
| **P0**   | Custom cell template (`ng-template`)          | Needed for action buttons, links, any non-standard cells |
| **P1**   | Row click / row actions                       | Every admin table needs edit/delete/view actions         |
| **P1**   | Bulk action bar (or at least a slot for it)   | Selected rows need an action UI                          |
| **P1**   | Search debounce option                        | Reduces API load significantly                           |
| **P2**   | `maxLength` truncation wiring                 | Already defined, just needs connecting                   |
| **P2**   | `'tags'` filter visual differentiation        | Already typed, needs distinct rendering                  |
| **P2**   | Row click output                              | Navigate to detail pages                                 |
| **P3**   | Sticky header, column visibility menu, export | Nice-to-haves for large datasets                         |
