import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  Directive,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';

import { cn } from '../../../utils/cn';
import { SelectOption } from '../../../components/select/select.component';
import { GROUP_SELECT_DATA_PROVIDER } from '../../group-select/group-select.component';
import { TableDataBulkUpdate } from '../types/bulk-action.types';
import {
  TableDataFilterSection,
  TableDataFilterState,
  TableDataFilterValue,
  isFilterActive,
} from '../types/filter.types';
import { TableDataCustomAction, TableDataRowAction } from '../types/row-action.types';
import { TableDataSort } from '../types/sort.types';
import { TableDataTab } from '../types/tab.types';
import { TableDataColumn } from '../types/column.types';
import { applyClientFilters } from '../utils/filter-engine';
import { applyClientSearch } from '../utils/search-engine';
import { applyClientSort } from '../utils/sort-engine';
import { generateFilterSections, mergeFilterSections } from '../utils/filter-generator';
import { ButtonComponent } from '../../../components/button/button.component';
import { StateComponent } from '../../../components/state/state.component';
import { TableDataColumnDrawerComponent, ColumnOverrideState } from './table-data-column-drawer.component';
import { TableDataFilterDrawerComponent } from './table-data-filter-drawer.component';
import { TableDataFooterComponent } from './table-data-footer.component';
import { TableDataHeaderComponent } from './table-data-header.component';
import { TableDataSelectionBarComponent } from './table-data-selection-bar.component';
import { TableDataTableComponent } from './table-data-table.component';
import { SeparatorComponent } from '../../../components/separator/separator.component';

export interface InlineFilterConfig {
  key: string;
  type: 'group-select' | 'switch' | 'hidden';
  label: string;
  placeholder?: string;
  options?: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  groupSelect?: boolean;
  maxLabelCount?: number;
}

@Directive({ selector: 'ng-template[uiTableDataActions]', standalone: true })
export class TableDataActionsDirective {}

@Directive({ selector: 'ng-template[uiTableDataInlineFilters]', standalone: true })
export class TableDataInlineFiltersDirective {}

@Directive({ selector: 'ng-template[uiTableDataHeaderLeft]', standalone: true })
export class TableDataHeaderLeftDirective {}

/**
 * Content projection slot that renders directly between the toolbar (search/filters) and the
 * column header row. Use to inject contextual UI like naming-path chip suggestions or status
 * banners that should sit *with* the table but above its headers.
 */
@Directive({ selector: 'ng-template[uiTableDataAfterToolbar]', standalone: true })
export class TableDataAfterToolbarDirective {}

@Component({
  selector: 'ui-table-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    SeparatorComponent,
    TableDataHeaderComponent,
    TableDataTableComponent,
    TableDataFooterComponent,
    TableDataColumnDrawerComponent,
    TableDataFilterDrawerComponent,
    TableDataSelectionBarComponent,
    ButtonComponent,
    StateComponent,
  ],
  host: { '[class]': 'computedClass()', '[attr.title]': 'null' },
  template: `
    <!-- Filter drawer lives outside the card so it overlays correctly -->
    <ui-table-data-filter-drawer
      #filterDrawer
      [sections]="resolvedFilterSections()"
      [state]="filterState()"
      [defaultState]="defaultFilterState()"
      [applyMode]="applyMode()"
      (stateChange)="onFilterChange($event)"
      (clearAll)="onClearFilters()"
    />

    <!-- Column management drawer -->
    <ui-table-data-column-drawer
      #columnDrawer
      [columns]="columns()"
      [overrides]="_columnOverrides()"
      (stateChange)="onColumnStateChange($event)"
      (reset)="onResetColumns()"
    />

    <!-- Header or Selection Bar -->
    <div class="px-4 pb-4">
      @if (hasSelection()) {
        <ui-table-data-selection-bar
          [selectedCount]="selectedCount()"
          [columns]="columns()"
          [bulkSaving]="bulkSaving()"
          (clearSelection)="onClearSelection()"
          (bulkUpdate)="onBulkUpdate($event)"
          (bulkArchive)="onBulkArchive()"
        />
      } @else {
        <ui-table-data-header
          [title]="title()"
          [description]="description()"
          [tabs]="resolvedTabs()"
          [activeTab]="_activeTab()"
          (activeTabChange)="_activeTab.set($event); onTabChange($event)"
          [searchQuery]="searchValue()"
          (searchQueryChange)="onSearchChange($event)"
          [activeFilterCount]="activeFilterCount()"
          [syncing]="syncing()"
          [showCreate]="showCreate()"
          [showFilterButton]="hasFilterSections()"
          [showColumnSettings]="!!columnKey()"
          [actionsRef]="_actionsTemplate() ?? null"
          [filtersRef]="_filtersTemplate() ?? null"
          [headerLeftRef]="_headerLeftTemplate() ?? null"
          [inlineFilters]="_inlineFilterConfigs()"
          [inlineFilterState]="_inlineFilterState()"
          [hasActiveInlineFilters]="_hasActiveInlineFilters()"
          (inlineFilterChange)="onInlineFilterChange($event.key, $any($event.value))"
          (clearInlineFilters)="onClearInlineFilters()"
          (createClick)="createClick.emit()"
          (filterClick)="filterDrawer.open()"
          (clearFilters)="onClearFilters()"
          (columnSettingsClick)="columnDrawer.open()"
        />
      }
    </div>

    <!-- Optional content rendered between toolbar and table headers (e.g. naming chips). -->
    @if (_afterToolbarTemplate(); as tpl) {
      <ng-container *ngTemplateOutlet="tpl"></ng-container>
    }

    <!-- Table -->
    @if (showEmpty()) {
      <ui-state [title]="emptyTitle()" [description]="emptyDescription()">
        <button actions ui-button variant="outline" class="mt-4" (click)="onClearAllState()">Clear Filters</button>
      </ui-state>
    } @else {
      <ui-table-data-table
        [data]="displayData()"
        [columns]="managedColumns()"
        [loading]="loading()"
        [sort]="_sort()"
        [showActions]="showActions()"
        [customActions]="customActions()"
        [activeId]="activeId()"
        [rowKey]="rowKey()"
        [selectedKeys]="_selectedKeys()"
        (selectedKeysChange)="_selectedKeys.set($event)"
        (selectionChange)="selectionChange.emit($event)"
        (rowClick)="rowClick.emit($event)"
        (rowAction)="rowAction.emit($event)"
        (cellValueChange)="cellValueChange.emit($event)"
        (sortClick)="onSortClick($event)"
      />
    }

    <ui-separator />

    <!-- Footer: page size + count + pagination -->
    <div class="px-4 py-3">
      <ui-table-data-footer
        [total]="displayTotal()"
        [pageIndex]="_pageIndex()"
        (pageIndexChange)="_pageIndex.set($event); pageChange.emit($event)"
        [pageSize]="_pageSize()"
        (pageSizeChange)="onPageSizeChange($event)"
      />
    </div>
  `,
})
export class TableDataComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  @ViewChild('filterDrawer') private _filterDrawerRef!: TableDataFilterDrawerComponent;
  private readonly _elRef = inject(ElementRef<HTMLElement>);
  private readonly _groupProvider = inject(GROUP_SELECT_DATA_PROVIDER, { optional: true });

  protected readonly _actionsTemplate = contentChild(TableDataActionsDirective, { read: TemplateRef });
  protected readonly _filtersTemplate = contentChild(TableDataInlineFiltersDirective, { read: TemplateRef });
  protected readonly _headerLeftTemplate = contentChild(TableDataHeaderLeftDirective, { read: TemplateRef });
  protected readonly _afterToolbarTemplate = contentChild(TableDataAfterToolbarDirective, { read: TemplateRef });

  readonly data = input.required<T[]>();
  readonly columns = input.required<TableDataColumn<T>[]>();
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly tabs = input<TableDataTab[]>([]);
  readonly defaultTab = input<string>('');
  readonly filterSections = input<TableDataFilterSection[]>([]);
  readonly defaultFilterState = input<TableDataFilterState>({});
  readonly applyMode = input<'immediate' | 'manual'>('immediate');
  readonly clientFilter = input<boolean>(true);
  readonly loading = input<boolean>(false);
  /** When true, shows a sync spinner to indicate background data is still loading. */
  readonly syncing = input<boolean>(false);
  /** When true, the selection bar's Update/Archive buttons show a spinner and stay disabled. */
  readonly bulkSaving = input<boolean>(false);
  readonly rowKey = input<keyof T>('id' as keyof T);
  readonly pageSize = input<number>(10);
  readonly mobilePageSize = input<number>(10);
  readonly total = input<number>(0);
  readonly emptyTitle = input<string>('No Results');
  readonly emptyDescription = input<string>('Try adjusting your filters');
  readonly defaultSort = input<TableDataSort | null>(null);
  readonly showActions = input<boolean>(true);
  readonly customActions = input<TableDataCustomAction[]>([]);
  readonly searchDebounce = input<number>(300);
  readonly activeId = input<string>('');
  readonly columnKey = input<string>('');
  readonly showCreate = input<boolean>(false);
  readonly class = input<string>('');

  // Outputs
  readonly tabChange = output<string>();
  readonly searchChange = output<string>();
  readonly sortChange = output<TableDataSort>();
  readonly filterChange = output<TableDataFilterState>();
  readonly selectionChange = output<T[]>();
  readonly rowClick = output<T>();
  readonly rowAction = output<TableDataRowAction<T>>();
  readonly cellValueChange = output<{ row: T; key: string; value: unknown }>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly bulkUpdate = output<TableDataBulkUpdate<T>>();
  readonly createClick = output<void>();
  readonly bulkArchive = output<T[]>();

  // Internal state
  protected readonly _activeTab = signal('');
  /**
   * Current search input value. Two-way bindable via `[(searchValue)]` so parent pages can
   * read or programmatically set the search (e.g. naming-path chip suggestions writing a prefix).
   * User typing flows through a debounced subject before landing here.
   */
  readonly searchValue = model<string>('');
  readonly filterState = model<TableDataFilterState>({});
  protected readonly _sort = signal<TableDataSort | null>(null);
  protected readonly _pageIndex = signal(1);
  protected readonly _pageSize = signal(25);
  protected readonly _selectedKeys = signal<Set<unknown>>(new Set());
  protected readonly _columnOverrides = signal<ColumnOverrideState | null>(null);
  private readonly _isMobile = signal(typeof window !== 'undefined' && window.innerWidth < 640);
  private readonly _isTablet = signal(
    typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024,
  );

  // Inline filters
  protected readonly _groupOptions = signal<SelectOption[]>([]);

  /** Columns marked with `inline: true`, in definition order. */
  protected readonly _inlineFilterColumns = computed(() => this.columns().filter((c) => c.inline));

  /** Inline columns visible at the current breakpoint (filters hidden on tablet when tablet === false). */
  protected readonly _visibleInlineFilterColumns = computed(() => {
    const isTablet = this._isTablet();
    return this._inlineFilterColumns().filter((col) => {
      if (isTablet) {
        const tabletVisible = col.tablet ?? col.mobile;
        return tabletVisible !== false;
      }
      return true;
    });
  });

  /** Build InlineFilterConfig[] from inline columns. */
  protected readonly _inlineFilterConfigs = computed<InlineFilterConfig[]>(() => {
    return this._visibleInlineFilterColumns().map((col) => {
      if (col.cellType === 'group') {
        return {
          key: col.key,
          type: 'group-select' as const,
          label: col.filterOverride?.label ?? col.label,
          placeholder: `All ${col.label}s`,
          options: this._groupOptions(),
          multiple: true,
          searchable: true,
          groupSelect: col.cellData?.groupSelect,
          maxLabelCount: col.cellData?.maxLabelCount,
        };
      }
      if (col.editType === 'boolean' || col.filterOverride?.type === 'boolean') {
        return {
          key: col.key,
          type: 'switch' as const,
          label: col.filterOverride?.label ?? col.label,
        };
      }
      // Non-group, non-boolean inline column — track for Clear Filters but don't render UI
      return {
        key: col.key,
        type: 'hidden' as const,
        label: col.filterOverride?.label ?? col.label,
      };
    });
  });

  /** Current values for inline filter keys, extracted from filterState. */
  protected readonly _inlineFilterState = computed(() => {
    const state = this.filterState();
    const result: Record<string, unknown> = {};
    for (const col of this._visibleInlineFilterColumns()) {
      result[col.key] = state[col.key] ?? null;
    }
    return result;
  });

  /** Whether any inline filter has a non-default active value, OR a search query is set. */
  protected readonly _hasActiveInlineFilters = computed(() => {
    if (this.searchValue()) return true;
    const state = this.filterState();
    const defaults = this.defaultFilterState();
    return this._visibleInlineFilterColumns().some((col) => {
      const val = state[col.key];
      if (!isFilterActive(val)) return false;
      const defVal = defaults[col.key];
      if (defVal != null && JSON.stringify(val) === JSON.stringify(defVal)) return false;
      return true;
    });
  });

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _search$ = new Subject<string>();

  constructor() {
    // Restore table state from sessionStorage (sort, page, search, filters)
    effect(() => {
      const key = this.columnKey();
      if (!key) return;
      try {
        const stored = sessionStorage.getItem(`table-state-${key}`);
        if (stored) {
          const state = JSON.parse(stored);
          if (state.sort) this._sort.set(state.sort);
          if (state.page) this._pageIndex.set(state.page);
          if (state.search) this.searchValue.set(state.search);
          if (state.filters) this.filterState.set(state.filters);
        }
      } catch {
        // Ignore malformed data
      }
    });

    // Reactive mobile/tablet detection
    if (typeof window !== 'undefined') {
      const update = () => {
        const w = window.innerWidth;
        this._isMobile.set(w < 640);
        this._isTablet.set(w >= 640 && w < 1024);
      };
      window.addEventListener('resize', update);
      this._destroyRef.onDestroy(() => window.removeEventListener('resize', update));
    }

    // Debounced search — updates searchValue after delay so parent two-way bindings only see the settled value.
    this._search$.pipe(debounceTime(this.searchDebounce()), takeUntilDestroyed(this._destroyRef)).subscribe((query) => {
      this.searchValue.set(query);
      this._pageIndex.set(1);
      this.searchChange.emit(query);
    });

    // Sync defaultTab into _activeTab (only when _activeTab hasn't been set by the user yet)
    effect(() => {
      const def = this.defaultTab();
      if (def && !this._activeTab()) {
        this._activeTab.set(def);
      }
    });

    // Sync _pageSize from the pageSize input (use mobilePageSize on mobile, 9 on tablet)
    effect(() => {
      if (this._isMobile()) {
        this._pageSize.set(this.mobilePageSize());
      } else if (this._isTablet()) {
        this._pageSize.set(9);
      } else {
        this._pageSize.set(this.pageSize());
      }
    });

    // Sync defaultSort into _sort (only when _sort hasn't been set by the user yet)
    effect(() => {
      const def = this.defaultSort();
      if (def && !this._sort()) {
        this._sort.set(def);
      }
    });

    // Sync defaultFilterState into filterState (once, on init)
    effect(() => {
      const def = this.defaultFilterState();
      if (Object.keys(def).length > 0 && Object.keys(this.filterState()).length === 0) {
        this.filterState.set(structuredClone(def));
      }
    });

    // Reset to page 1 when filterState changes externally (e.g. via two-way binding)
    let prevFilterSnapshot = '';
    effect(() => {
      const snapshot = JSON.stringify(this.filterState());
      if (prevFilterSnapshot && snapshot !== prevFilterSnapshot) {
        this._pageIndex.set(1);
      }
      prevFilterSnapshot = snapshot;
    });

    // Reset to page 1 when data shrinks below current page offset (e.g. custom inline filters)
    effect(() => {
      const total = this.sortedData().length;
      const page = this._pageIndex();
      const size = this._pageSize();
      if (page > 1 && (page - 1) * size >= total) {
        this._pageIndex.set(1);
      }
    });

    // Auto-page to the row matching activeId (runs once per activeId when data is available)
    let lastPagedId = '';
    effect(() => {
      const id = this.activeId();
      if (!id) return;
      const rk = this.rowKey();
      const sorted = this.sortedData();
      if (sorted.length === 0) return;
      if (id === lastPagedId) return;
      const size = this._pageSize();
      const idx = sorted.findIndex((row) => String(row[rk]) === id);
      if (idx < 0) return;
      lastPagedId = id;
      const targetPage = Math.floor(idx / size) + 1;
      this._pageIndex.set(targetPage);
    });

    // Load group options for inline group-select filters
    effect(() => {
      const groupCol = this._inlineFilterColumns().find((c) => c.cellType === 'group');
      if (!groupCol || !this._groupProvider) return;
      const abbr = groupCol.cellData?.groupTypeAbbr;
      this._groupProvider
        .getTree(abbr)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((nodes) => {
          const options: SelectOption[] = [];
          for (const parent of nodes) {
            if (parent.children.length > 0) {
              for (const child of parent.children) {
                options.push({ value: child.name, label: child.name, group: parent.name });
              }
            } else {
              options.push({ value: parent.name, label: parent.name });
            }
          }
          this._groupOptions.set(options);
        });
    });

    // Load column overrides from localStorage
    effect(() => {
      const key = this.columnKey();
      if (!key) return;
      try {
        const stored = localStorage.getItem(`table-columns-${key}`);
        if (stored) {
          this._columnOverrides.set(JSON.parse(stored));
        }
      } catch {
        // Ignore malformed localStorage data
      }
    });

    // Persist table state to sessionStorage on changes
    effect(() => {
      const key = this.columnKey();
      if (!key) return;
      const state = {
        sort: this._sort(),
        page: this._pageIndex(),
        search: this.searchValue(),
        filters: this.filterState(),
      };
      try {
        sessionStorage.setItem(`table-state-${key}`, JSON.stringify(state));
      } catch {
        // Ignore storage full errors
      }
    });
  }

  /** Tabs with auto-computed counts when filterKey is set and count is not provided. */
  readonly resolvedTabs = computed<TableDataTab[]>(() => {
    const tabs = this.tabs();
    const data = this.data();
    if (tabs.length === 0) return tabs;

    // If no tab has filterKey, return as-is (server-side tabs)
    const hasClientTabs = tabs.some((t) => t.filterKey != null);
    if (!hasClientTabs) return tabs;

    return tabs.map((tab) => {
      if (tab.count != null) return tab;
      const count =
        tab.filterKey != null ? data.filter((row) => row[tab.filterKey!] === tab.filterValue).length : data.length;
      return { ...tab, count };
    });
  });

  /** Data filtered by the active tab (when tab has filterKey). */
  readonly tabFilteredData = computed(() => {
    if (!this.clientFilter()) return this.data();
    const activeTab = this._activeTab();
    const tab = this.tabs().find((t) => t.value === activeTab);
    if (!tab?.filterKey) return this.data();
    return this.data().filter((row) => row[tab.filterKey!] === tab.filterValue);
  });

  /** Auto-generated + manual filter sections merged together. */
  readonly resolvedFilterSections = computed(() => {
    const autoSections = generateFilterSections(this.columns(), this.tabFilteredData());
    return mergeFilterSections(autoSections, this.filterSections());
  });

  /** Client-side filtered + searched data (only when clientFilter is enabled). */
  readonly filteredData = computed(() => {
    if (!this.clientFilter()) return this.tabFilteredData();
    const filtered = applyClientFilters(this.tabFilteredData(), this.filterState(), this.resolvedFilterSections());
    return applyClientSearch(filtered, this.searchValue(), this.columns());
  });

  /** Sorted data (applies client sort when clientFilter is enabled). */
  readonly sortedData = computed(() => {
    if (!this.clientFilter()) return this.filteredData();
    return applyClientSort(this.filteredData(), this._sort());
  });

  /** Data to display in the table — paginated slice of sorted data. */
  readonly displayData = computed(() => {
    if (!this.clientFilter()) return this.sortedData();
    const size = this._pageSize();
    if (size === 0) return this.sortedData();
    const page = this._pageIndex();
    const start = (page - 1) * size;
    return this.sortedData().slice(start, start + size);
  });

  /** Total count for pagination — uses filtered/searched count when client filtering is active. */
  readonly displayTotal = computed(() => {
    if (!this.clientFilter()) return this.total();
    return this.sortedData().length;
  });

  /** Total count of active filter values across all sections (excludes defaults). */
  readonly activeFilterCount = computed(() => {
    const state = this.filterState();
    const defaults = this.defaultFilterState();
    return Object.entries(state).reduce((sum, [key, val]) => {
      if (!isFilterActive(val)) return sum;
      const defVal = defaults[key];
      if (defVal != null && JSON.stringify(val) === JSON.stringify(defVal)) return sum;
      return sum + 1;
    }, 0);
  });

  /** Whether filter drawer has any sections to show. */
  readonly hasFilterSections = computed(() => this.resolvedFilterSections().length > 0);

  /** Show empty state when not loading and no data to display. */
  readonly showEmpty = computed(() => !this.loading() && this.displayData().length === 0);

  /** Columns with overrides applied (visibility + order). Locked columns stay pinned. */
  readonly managedColumns = computed<TableDataColumn<T>[]>(() => {
    const cols = this.columns();
    const ov = this._columnOverrides();
    if (!ov) return cols;

    const locked = cols.filter((c) => c.locked);
    const nonLocked = cols.filter((c) => !c.locked);
    const colMap = new Map(nonLocked.map((c) => [c.key, c]));

    // Order from overrides
    const ordered: TableDataColumn<T>[] = [];
    for (const key of ov.order) {
      const col = colMap.get(key as keyof T & string);
      if (col) {
        const visible = ov.visibility[key] ?? col.visible !== false;
        ordered.push({ ...col, visible });
        colMap.delete(key as keyof T & string);
      }
    }

    // New columns not in saved order appear at the end
    for (const [, col] of colMap) {
      ordered.push({ ...col, visible: ov.visibility[col.key] ?? col.visible !== false });
    }

    return [...locked, ...ordered];
  });

  /** Whether any rows are selected. */
  readonly hasSelection = computed(() => this._selectedKeys().size > 0);

  /** Number of selected rows. */
  readonly selectedCount = computed(() => this._selectedKeys().size);

  /** The actual selected row objects. */
  readonly selectedRows = computed(() => {
    const keys = this._selectedKeys();
    const rk = this.rowKey();
    return this.data().filter((row) => keys.has(row[rk]));
  });

  protected onSearchChange(query: string): void {
    this._search$.next(query);
  }

  protected onTabChange(tab: string): void {
    this._pageIndex.set(1);
    this.filterState.set({});
    this.tabChange.emit(tab);
  }

  protected onFilterChange(state: TableDataFilterState): void {
    this.filterState.set(state);
    this._pageIndex.set(1);
    this.filterChange.emit(state);
  }

  protected onClearFilters(): void {
    const def = structuredClone(this.defaultFilterState());
    this.filterState.set(def);
    this._pageIndex.set(1);
    this.filterChange.emit(def);
  }

  protected onInlineFilterChange(key: string, value: TableDataFilterValue): void {
    this.filterState.update((s) => ({ ...s, [key]: value }));
    this._pageIndex.set(1);
    this.filterChange.emit(this.filterState());
  }

  protected onClearInlineFilters(): void {
    const defaults = this.defaultFilterState();
    this.filterState.update((s) => {
      const next = { ...s };
      for (const col of this._visibleInlineFilterColumns()) {
        if (defaults[col.key] != null) {
          next[col.key] = structuredClone(defaults[col.key]);
        } else {
          delete next[col.key];
        }
      }
      return next;
    });
    // Also clear the search input — it's an active filter from the user's POV.
    this.searchValue.set('');
    this._pageIndex.set(1);
    this.filterChange.emit(this.filterState());
  }

  /** Clear all filters, search, and sort — used by the empty state "Clear Filters" button. */
  protected onClearAllState(): void {
    const def = structuredClone(this.defaultFilterState());
    this.filterState.set(def);
    this.searchValue.set('');
    this._sort.set(null);
    this._pageIndex.set(1);
    this.filterChange.emit(def);
  }

  protected onSortClick(columnKey: string): void {
    const current = this._sort();
    let direction: 'asc' | 'desc' | null;
    if (current?.columnKey === columnKey) {
      direction = current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? null : 'asc';
    } else {
      direction = 'asc';
    }
    const sort: TableDataSort = { columnKey, direction };
    this._sort.set(sort);
    this._pageIndex.set(1);
    this.sortChange.emit(sort);
  }

  protected onPageSizeChange(size: number): void {
    this._pageSize.set(size);
    this._pageIndex.set(1);
    this.pageSizeChange.emit(size);
  }

  /** Scroll the host element into view when pagination changes. */
  protected scrollToTop(): void {
    const el = this._elRef.nativeElement;
    const scroller = el.closest('main') ?? el.closest('[class*="overflow"]') ?? el.parentElement;
    if (!scroller) return;

    const target = el.offsetTop - scroller.offsetTop;
    const start = scroller.scrollTop;
    const distance = target - start;
    const duration = 150;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const ease = elapsed * (2 - elapsed); // ease-out
      scroller.scrollTop = start + distance * ease;
      if (elapsed < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  protected onColumnStateChange(state: ColumnOverrideState): void {
    this._columnOverrides.set(state);
    const key = this.columnKey();
    if (key) {
      localStorage.setItem(`table-columns-${key}`, JSON.stringify(state));
    }
  }

  protected onResetColumns(): void {
    this._columnOverrides.set(null);
    const key = this.columnKey();
    if (key) {
      localStorage.removeItem(`table-columns-${key}`);
    }
  }

  protected onClearSelection(): void {
    this._selectedKeys.set(new Set());
    this.selectionChange.emit([]);
  }

  protected onBulkUpdate(event: { field: string; value: unknown }): void {
    this.bulkUpdate.emit({
      field: event.field,
      value: event.value,
      selectedRows: this.selectedRows(),
    });
  }

  protected onBulkArchive(): void {
    this.bulkArchive.emit(this.selectedRows());
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}
