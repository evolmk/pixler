import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const TABLE_TOKEN = new InjectionToken<TableComponent>('TABLE_TOKEN');

type TableVariant = 'default' | 'bordered';
type TableSize = 'sm' | 'default' | 'lg';

const CELL_SIZE: Record<TableSize, string> = {
  sm: 'p-1.5',
  default: 'p-3',
  lg: 'p-5',
};

const HEAD_SIZE: Record<TableSize, string> = {
  sm: 'h-8 px-2',
  default: 'h-12 px-4',
  lg: 'h-14 px-6',
};

// ── Data table types ──────────────────────────────────────────────────────────

export interface DataTableColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  /** Custom cell renderer: receives row data, returns display string */
  cell?: (row: T) => string;
  /** CSS class applied to each body cell in this column */
  cellClass?: string;
  /** CSS class applied to the header cell */
  headerClass?: string;
}

export interface DataTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTablePage {
  page: number;
  pageSize: number;
}

// ── Table ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: TABLE_TOKEN, useExisting: forwardRef(() => TableComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `
    @if (_isDataDriven()) {
      <!-- ── Data-driven mode ──────────────────────────────────────────── -->
      @if (filterable()) {
        <div class="mb-3 flex items-center gap-2">
          <input
            type="search"
            [value]="_filter()"
            placeholder=""
            class="h-8 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm
                   placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring
                   [&::-webkit-search-cancel-button]:appearance-none"
            (input)="_onFilter($event)"
          />
          <span class="text-xs text-muted-foreground">{{ _filtered().length }} results</span>
        </div>
      }

      <div class="relative w-full overflow-x-auto">
        <table [class]="tableClass()">
          <thead class="table-header-group [&>tr]:border-b">
            <tr class="table-row">
              @for (col of _cols(); track col.key) {
                <th
                  [class]="thClass(col)"
                  [style.width]="col.width ?? null"
                  (click)="col.sortable && _applySort(col.key)"
                >
                  <div class="flex items-center gap-1">
                    {{ col.header }}
                    @if (col.sortable) {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        [class]="sortIconClass(col.key)"
                      >
                        @if (_sortState()?.key === col.key && _sortState()?.direction === 'asc') {
                          <path d="m18 15-6-6-6 6" />
                        } @else if (_sortState()?.key === col.key && _sortState()?.direction === 'desc') {
                          <path d="m6 9 6 6 6-6" />
                        } @else {
                          <path d="m7 15 5 5 5-5" />
                          <path d="m7 9 5-5 5 5" />
                        }
                      </svg>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody class="table-row-group [&>tr:last-child]:border-0">
            @if (_paged().length === 0) {
              <tr class="table-row">
                <td [attr.colspan]="_cols().length" class="table-cell py-8 text-center text-sm text-muted-foreground">
                  No data
                </td>
              </tr>
            }
            @for (row of _paged(); track _rowId(row)) {
              <tr [class]="trClass(row)" (click)="rowClick.emit(row)">
                @for (col of _cols(); track col.key) {
                  <td [class]="tdClass(col)">
                    {{ col.cell ? col.cell(row) : _cellValue(row, col.key) }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (paginated()) {
        <div class="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {{ _currentPage() + 1 }} of {{ _totalPages() }}</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
              [disabled]="_currentPage() === 0"
              (click)="_prevPage()"
            >
              Prev
            </button>
            <button
              type="button"
              class="rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
              [disabled]="_currentPage() >= _totalPages() - 1"
              (click)="_nextPage()"
            >
              Next
            </button>
          </div>
        </div>
      }
    } @else {
      <!-- ── Primitive/compositional mode ──────────────────────────────── -->
      <div class="relative w-full overflow-x-auto">
        <table [class]="tableClass()">
          <ng-content />
        </table>
      </div>
    }
  `,
})
export class TableComponent {
  // ── Primitive inputs ──────────────────────────────────────────────────────
  readonly variant = input<TableVariant>('default');
  readonly size = input<TableSize>('default');
  readonly class = input<string>('');

  // ── Data-driven inputs (all optional) ────────────────────────────────────
  readonly data = input<Record<string, unknown>[]>();
  readonly columns = input<DataTableColumn[]>();
  readonly rowId = input<string>('id');
  readonly filterable = input<boolean>(false);
  readonly paginated = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly striped = input<boolean>(false);

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly rowClick = output<Record<string, unknown>>();
  readonly sortChange = output<DataTableSort>();
  readonly pageChange = output<DataTablePage>();

  // ── Internal state ────────────────────────────────────────────────────────
  protected readonly _sortState = signal<DataTableSort | null>(null);
  protected readonly _filter = signal('');
  protected readonly _currentPage = signal(0);

  // ── Computed ──────────────────────────────────────────────────────────────
  protected readonly _isDataDriven = computed(() => !!this.data() && !!this.columns());

  protected readonly _cols = computed(() => this.columns() ?? []);

  protected readonly computedClass = computed(() => cn('block w-full', this.class()));

  protected readonly tableClass = computed(() =>
    cn(
      'w-full caption-bottom text-sm',
      this.variant() === 'bordered' ? 'border border-border [&_td]:border [&_th]:border' : '',
    ),
  );

  protected readonly _filtered = computed(() => {
    const q = this._filter().toLowerCase();
    if (!q) return this.data() ?? [];
    return (this.data() ?? []).filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
  });

  protected readonly _sorted = computed(() => {
    const s = this._sortState();
    if (!s) return this._filtered();
    return [...this._filtered()].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const av = String(a[s.key] ?? '');
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const bv = String(b[s.key] ?? '');
      return s.direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  });

  protected readonly _totalPages = computed(() => Math.max(1, Math.ceil(this._sorted().length / this.pageSize())));

  protected readonly _paged = computed(() => {
    if (!this.paginated()) return this._sorted();
    const start = this._currentPage() * this.pageSize();
    return this._sorted().slice(start, start + this.pageSize());
  });

  // ── Template helpers ──────────────────────────────────────────────────────

  protected _rowId(row: Record<string, unknown>): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(row[this.rowId()] ?? JSON.stringify(row));
  }

  protected _cellValue(row: Record<string, unknown>, key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(row[key] ?? '');
  }

  protected _prevPage(): void {
    this._currentPage.update((p) => p - 1);
    this.pageChange.emit({ page: this._currentPage(), pageSize: this.pageSize() });
  }

  protected _nextPage(): void {
    this._currentPage.update((p) => p + 1);
    this.pageChange.emit({ page: this._currentPage(), pageSize: this.pageSize() });
  }

  protected _applySort(key: string): void {
    const current = this._sortState();
    const next: DataTableSort =
      current?.key === key && current.direction === 'asc' ? { key, direction: 'desc' } : { key, direction: 'asc' };
    this._sortState.set(next);
    this.sortChange.emit(next);
    this._currentPage.set(0);
  }

  protected _onFilter(event: Event): void {
    this._filter.set((event.target as HTMLInputElement).value);
    this._currentPage.set(0);
  }

  protected sortIconClass(key: string): string {
    return cn('h-3 w-3', this._sortState()?.key === key ? 'text-foreground' : 'text-muted-foreground');
  }

  protected thClass(col: DataTableColumn): string {
    return cn(
      'table-cell text-left align-middle font-medium text-muted-foreground',
      HEAD_SIZE[this.size()],
      col.sortable ? 'cursor-pointer select-none hover:text-foreground' : '',
      col.headerClass ?? '',
    );
  }

  protected tdClass(col: DataTableColumn): string {
    return cn('table-cell align-middle', CELL_SIZE[this.size()], col.cellClass ?? '');
  }

  protected trClass(_row: Record<string, unknown>): string {
    return cn('table-row border-b', this.striped() ? 'odd:bg-muted/30' : 'hover:bg-muted/50');
  }
}

// ── Header ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableHeaderComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('table-header-group [&>*]:border-b', this.class()));
}

// ── Body ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableBodyComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('table-row-group [&>*:last-child]:border-0', this.class()));
}

// ── Footer ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableFooterComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('table-footer-group border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', this.class()),
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-row, [uiTableRow]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableRowComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('table-row border-b hover:bg-muted/50 data-[state=selected]:bg-muted', this.class()),
  );
}

// ── Head ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-head, [uiTableHead]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableHeadComponent {
  readonly class = input<string>('');
  protected readonly _table = inject(TABLE_TOKEN, { optional: true });

  protected readonly computedClass = computed(() =>
    cn(
      'table-cell text-left align-middle font-medium text-muted-foreground',
      '[&:has([role=checkbox])]:pr-0',
      HEAD_SIZE[this._table?.size() ?? 'default'],
      this.class(),
    ),
  );
}

// ── Cell ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-cell, [uiTableCell]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableCellComponent {
  readonly class = input<string>('');
  protected readonly _table = inject(TABLE_TOKEN, { optional: true });

  protected readonly computedClass = computed(() =>
    cn(
      'table-cell align-middle [&:has([role=checkbox])]:pr-0',
      CELL_SIZE[this._table?.size() ?? 'default'],
      this.class(),
    ),
  );
}

// ── Caption ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-table-caption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TableCaptionComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('table-caption mt-4 text-sm text-muted-foreground', this.class()),
  );
}
