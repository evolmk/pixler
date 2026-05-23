import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CheckboxComponent } from '../../../components/checkbox/checkbox.component';
import {
  TableBodyComponent,
  TableCellComponent,
  TableComponent,
  TableHeadComponent,
  TableHeaderComponent,
  TableRowComponent,
} from '../../../components/table/table.component';
import { cn } from '../../../utils/cn';
import { CellCompanyComponent } from '../cells/cell-company.component';
import { CellContactComponent } from '../cells/cell-contact.component';
import { CellFlagLocationComponent } from '../cells/cell-flag-location.component';
import { CellStatusPillComponent } from '../cells/cell-status-pill.component';
import { CellAvatarGroupComponent, AvatarGroupItem } from '../cells/cell-avatar-group.component';
import { CellGroupComponent } from '../cells/cell-group.component';
import { CellImageComponent } from '../cells/cell-image.component';
import { CellPartLinkComponent } from '../cells/cell-part-link.component';
import { CellTextImageComponent } from '../cells/cell-text-image.component';
import { CellFileExtComponent } from '../cells/cell-file-ext.component';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';
import { SwitchComponent } from '../../../components/switch/switch.component';
import { TableDataColumn, TableDataStatusColor } from '../types/column.types';
import { TableDataCustomAction, TableDataRowAction } from '../types/row-action.types';
import { TableDataSort } from '../types/sort.types';
import {
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
} from '../../../components/dropdown/dropdown.component';
import { ButtonComponent } from '../../../components/button/button.component';

function timeAgoStrict(date: Date): string {
  const now = Date.now();
  const diff = Math.abs(now - date.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;
  if (years > 0) label = years === 1 ? '1 year' : `${years} years`;
  else if (months > 0) label = months === 1 ? '1 month' : `${months} months`;
  else if (days > 0) label = days === 1 ? '1 day' : `${days} days`;
  else if (hours > 0) label = hours === 1 ? '1 hour' : `${hours} hours`;
  else if (minutes > 0) label = minutes === 1 ? '1 minute' : `${minutes} minutes`;
  else label = 'just now';

  return label === 'just now' ? label : date.getTime() <= now ? `${label} ago` : `in ${label}`;
}

@Component({
  selector: 'ui-table-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    CheckboxComponent,
    CellCompanyComponent,
    CellContactComponent,
    CellFlagLocationComponent,
    CellStatusPillComponent,
    CellAvatarGroupComponent,
    CellGroupComponent,
    CellImageComponent,
    CellPartLinkComponent,
    CellTextImageComponent,
    CellFileExtComponent,
    ProgressBarComponent,
    SwitchComponent,
    DropdownComponent,
    DropdownTriggerDirective,
    DropdownContentDirective,
    ButtonComponent,
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-table [size]="_isMobile() ? 'sm' : 'default'">
      <ui-table-header>
        <ui-table-row>
          <!-- Select-all checkbox (hidden on mobile) -->
          @if (!_isMobile()) {
            <ui-table-head class="w-10">
              <ui-checkbox
                [checked]="allSelected()"
                [indeterminate]="someSelected()"
                (checkedChange)="onToggleAll($event)"
              />
            </ui-table-head>
          }

          @for (col of visibleColumns(); track col.key) {
            <ui-table-head
              [style.width]="col.fit ? '0' : (col.width ?? '')"
              [class]="'eyebrow text-muted-foreground' + (col.fit ? ' whitespace-nowrap' : '')"
            >
              @if (col.sortable) {
                <button
                  type="button"
                  class="flex items-center gap-1 uppercase select-none cursor-pointer hover:text-foreground transition-colors"
                  (click)="sortClick.emit(col.key)"
                >
                  <span>{{ _isMobile() && col.mobileLabel ? col.mobileLabel : col.label }}</span>
                  @if (isSorted(col.key)) {
                    <!-- Active: arrow-up or arrow-down -->
                    @if (sortDirection(col.key) === 'asc') {
                      <svg
                        class="size-3.5 text-emerald-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 7-7 7 7" />
                        <path d="M12 19V5" />
                      </svg>
                    } @else {
                      <svg
                        class="size-3.5 text-emerald-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    }
                  } @else {
                    <!-- Default: dual up/down carets -->
                    <svg
                      class="size-3.5 text-muted-foreground/50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06.04L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  }
                </button>
              } @else {
                <span>{{ _isMobile() && col.mobileLabel ? col.mobileLabel : col.label }}</span>
              }
            </ui-table-head>
          }

          @if (showActions()) {
            <ui-table-head class="w-12"></ui-table-head>
          }
        </ui-table-row>
      </ui-table-header>

      <ui-table-body>
        @if (loading()) {
          @for (_ of skeletonRows; track $index) {
            <ui-table-row>
              @if (!_isMobile()) {
                <ui-table-cell><div class="h-4 w-4 rounded bg-muted animate-pulse"></div></ui-table-cell>
              }
              @for (col of visibleColumns(); track col.key) {
                <ui-table-cell><div class="h-4 w-full rounded bg-muted animate-pulse"></div></ui-table-cell>
              }
              @if (showActions()) {
                <ui-table-cell></ui-table-cell>
              }
            </ui-table-row>
          }
        } @else {
          @for (row of data(); track rowId(row)) {
            <ui-table-row [class]="rowClass(row)" (click)="rowClick.emit(row)">
              @if (!_isMobile()) {
                <ui-table-cell (click)="$event.stopPropagation()">
                  <ui-checkbox [checked]="isRowSelected(row)" (checkedChange)="onToggleRow(row, $event)" />
                </ui-table-cell>
              }

              @for (col of visibleColumns(); track col.key) {
                <ui-table-cell
                  [class]="
                    (col.cellType === 'image' || col.cellType === 'file-ext'
                      ? '!py-1 !px-2'
                      : col.truncate
                        ? 'max-w-0'
                        : '') + (col.fit ? ' whitespace-nowrap' : '')
                  "
                  (click)="col.cellType === 'switch' ? $event.stopPropagation() : null"
                >
                  @switch (col.cellType) {
                    @case ('image') {
                      <ui-cell-image
                        [src]="getCellValue(row, col.key) || null"
                        [alt]="'' + (row['name'] || row['partNumber'] || col.label)"
                        [count]="col.cellData?.countKey ? +getCellValue(row, col.cellData!.countKey!) || 0 : 0"
                      />
                    }
                    @case ('company') {
                      <ui-cell-company
                        [name]="getCellValue(row, col.key)"
                        [description]="
                          col.cellData?.descriptionKey ? getCellValue(row, col.cellData!.descriptionKey!) : ''
                        "
                        [avatarSrc]="col.cellData?.avatarKey ? getCellValue(row, col.cellData!.avatarKey!) : null"
                      />
                    }
                    @case ('flag-location') {
                      <ui-cell-flag-location
                        [flag]="col.cellData?.flagKey ? getCellValue(row, col.cellData!.flagKey!) : ''"
                        [location]="getCellValue(row, col.key)"
                      />
                    }
                    @case ('contact') {
                      <ui-cell-contact
                        [name]="getCellValue(row, col.key)"
                        [description]="
                          col.cellData?.descriptionKey ? getCellValue(row, col.cellData!.descriptionKey!) : ''
                        "
                        [initialsFrom]="col.cellData?.initialsKey ? getCellValue(row, col.cellData!.initialsKey!) : ''"
                        [avatarSrc]="col.cellData?.avatarKey ? getCellValue(row, col.cellData!.avatarKey!) : null"
                      />
                    }
                    @case ('status-pill') {
                      <ui-cell-status-pill [label]="getCellValue(row, col.key)" [color]="getStatusColor(row, col)" />
                    }
                    @case ('avatar-group') {
                      <ui-cell-avatar-group [items]="getAvatarGroupItems(row, col.key)" />
                    }
                    @case ('group') {
                      <ui-cell-group
                        [typeName]="col.cellData?.groupTypeKey ? getCellValue(row, col.cellData!.groupTypeKey!) : ''"
                        [groupName]="getCellValue(row, col.key)"
                      />
                    }
                    @case ('part-link') {
                      <ui-cell-part-link
                        [partNumber]="getCellValue(row, col.key)"
                        [partName]="
                          col.cellData?.descriptionKey ? getCellValue(row, col.cellData!.descriptionKey!) : ''
                        "
                        (linkClick)="
                          onAction(
                            row,
                            'navigate:' + (col.cellData?.linkIdKey ? getCellValue(row, col.cellData!.linkIdKey!) : '')
                          )
                        "
                      />
                    }
                    @case ('text-image') {
                      <ui-cell-text-image
                        [text]="getCellValue(row, col.key)"
                        [imageSrc]="col.cellData?.imageKey ? getCellValue(row, col.cellData!.imageKey!) : null"
                      />
                    }
                    @case ('file-ext') {
                      <ui-cell-file-ext [ext]="getCellValue(row, col.key)" />
                    }
                    @case ('date') {
                      <span class="text-foreground whitespace-nowrap" [title]="getDateTooltip(row, col.key)">{{
                        getDateDisplay(row, col.key)
                      }}</span>
                    }
                    @case ('link') {
                      @if (getCellValue(row, col.key)) {
                        <a
                          [href]="
                            normalizeUrl(
                              col.cellData?.linkKey
                                ? getCellValue(row, col.cellData!.linkKey!)
                                : getCellValue(row, col.key)
                            )
                          "
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline whitespace-nowrap"
                          (click)="$event.stopPropagation()"
                          >{{ getCellValue(row, col.key) }}</a
                        >
                      } @else {
                        <span class="text-muted-foreground">—</span>
                      }
                    }
                    @case ('text-lines') {
                      @if (getTextLines(row, col.key).length === 0) {
                        <span class="text-muted-foreground">—</span>
                      } @else {
                        <div class="flex flex-col gap-0.5">
                          @for (line of getTextLines(row, col.key); track $index) {
                            <span class="text-xs text-foreground leading-tight whitespace-nowrap">{{ line }}</span>
                          }
                        </div>
                      }
                    }
                    @case ('progress') {
                      <span
                        class="inline-block w-full"
                        [attr.title]="col.cellData?.tooltipKey ? getCellValue(row, col.cellData!.tooltipKey!) : null"
                      >
                        <ui-progress-bar [value]="getCellNumberValue(row, col.key)" [showLabel]="true" />
                      </span>
                    }
                    @case ('number') {
                      <span class="text-foreground whitespace-nowrap tabular-nums">{{
                        getCellValue(row, col.key)
                      }}</span>
                    }
                    @case ('switch') {
                      <ui-switch
                        [checked]="getCellValue(row, col.key) === 'Yes' || getCellValue(row, col.key) === 'true'"
                        (checkedChange)="onCellSwitchChange(row, col.key, $event)"
                        size="sm"
                      />
                    }
                    @default {
                      <span
                        [class]="
                          (col.copyable ? 'inline-flex items-center gap-1 group/copy ' : '') +
                          (col.truncate ? 'text-foreground truncate block' : 'text-foreground whitespace-nowrap')
                        "
                        [attr.title]="
                          col.truncate
                            ? getCellValue(row, col.key) || null
                            : col.cellData?.tooltipKey
                              ? getCellValue(row, col.cellData!.tooltipKey!)
                              : col.tooltip
                                ? getCellValue(row, col.key) || null
                                : null
                        "
                      >
                        {{ getCellValue(row, col.key) }}
                        @if (col.copyable && getCellValue(row, col.key)) {
                          <button
                            type="button"
                            title="Copy"
                            class="inline-flex items-center justify-center size-4 rounded-sm text-muted-foreground/0 group-hover/copy:text-muted-foreground/50 hover:!text-foreground transition-colors cursor-pointer"
                            (click)="$event.stopPropagation(); copyToClipboard(getCellValue(row, col.key))"
                          >
                            <svg
                              class="size-3"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </button>
                        }
                      </span>
                    }
                  }
                </ui-table-cell>
              }

              @if (showActions()) {
                <ui-table-cell (click)="$event.stopPropagation()">
                  <ui-dropdown align="end">
                    <button uiDropdownTrigger ui-button variant="ghost" size="icon" class="size-8">
                      <svg
                        class="size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                      <span class="sr-only">Actions</span>
                    </button>
                    <div uiDropdownContent class="w-40 rounded-lg border border-border bg-popover shadow-lg py-1">
                      <button
                        type="button"
                        class="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent transition-colors"
                        (click)="onAction(row, 'edit')"
                      >
                        <svg
                          class="size-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                          />
                        </svg>
                        Edit
                      </button>
                      @for (action of customActions(); track action.key) {
                        @if (!action.visible || action.visible(row)) {
                          @if (action.separator) {
                            <div class="my-1 h-px bg-border"></div>
                          }
                          <button
                            type="button"
                            [disabled]="action.disabled ?? false"
                            [class]="
                              'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ' +
                              (action.disabled
                                ? 'text-muted-foreground/50 cursor-not-allowed'
                                : (action.textClass ?? 'text-popover-foreground hover:bg-accent'))
                            "
                            (click)="onAction(row, action.key)"
                          >
                            @if (action.iconPaths?.length) {
                              <svg
                                class="size-4 text-muted-foreground"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                @for (path of action.iconPaths; track $index) {
                                  <path [attr.d]="path" />
                                }
                              </svg>
                            }
                            {{ action.label }}
                          </button>
                        }
                      }
                      <button
                        type="button"
                        disabled
                        class="flex items-center gap-2 w-full px-3 py-2 text-muted-foreground/50 cursor-not-allowed"
                      >
                        <svg
                          class="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Duplicate
                      </button>
                      <div class="my-1 h-px bg-border"></div>
                      <button
                        type="button"
                        class="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors"
                        (click)="onAction(row, 'delete')"
                      >
                        <svg
                          class="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </ui-dropdown>
                </ui-table-cell>
              }
            </ui-table-row>
          }
        }
      </ui-table-body>
    </ui-table>
  `,
})
export class TableDataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableDataColumn<T>[]>();
  readonly loading = input<boolean>(false);
  readonly sort = input<TableDataSort | null>(null);
  readonly rowKey = input<keyof T>('id' as keyof T);
  readonly selectedKeys = model<Set<unknown>>(new Set());
  readonly class = input<string>('');

  readonly showActions = input<boolean>(true);
  readonly customActions = input<TableDataCustomAction[]>([]);
  readonly activeId = input<string>('');
  readonly sortClick = output<string>();
  readonly selectionChange = output<T[]>();
  readonly rowClick = output<T>();
  readonly rowAction = output<TableDataRowAction<T>>();
  readonly cellValueChange = output<{ row: T; key: string; value: unknown }>();

  private readonly _destroyRef = inject(DestroyRef);
  protected readonly _isMobile = signal(typeof window !== 'undefined' && window.innerWidth < 640);
  protected readonly _isTablet = signal(
    typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024,
  );

  constructor() {
    if (typeof window !== 'undefined') {
      const update = () => {
        const w = window.innerWidth;
        this._isMobile.set(w < 640);
        this._isTablet.set(w >= 640 && w < 1024);
      };
      window.addEventListener('resize', update);
      this._destroyRef.onDestroy(() => window.removeEventListener('resize', update));
    }
  }

  protected readonly skeletonRows = Array(5).fill(null);

  protected readonly visibleColumns = computed(() => {
    const isMobile = this._isMobile();
    const isTablet = this._isTablet();
    return this.columns().filter((c) => {
      if (c.visible === false) return false;
      if (isMobile && c.mobile === false) return false;
      if (isTablet) {
        const tabletVisible = c.tablet ?? c.mobile;
        if (tabletVisible === false) return false;
      }
      return true;
    });
  });

  protected readonly allSelected = computed(() => {
    if (this.data().length === 0) return false;
    return this.data().every((row) => this.selectedKeys().has(this.rowId(row)));
  });

  protected readonly someSelected = computed(() => {
    if (this.allSelected()) return false;
    return this.data().some((row) => this.selectedKeys().has(this.rowId(row)));
  });

  protected rowId(row: T): unknown {
    return row[this.rowKey()];
  }

  protected rowClass(row: T): string {
    const id = this.activeId();
    const isActive = id && String(this.rowId(row)) === id;
    if (isActive) return 'bg-accent/50 cursor-pointer';
    return this.isRowSelected(row) ? 'bg-muted/40 cursor-pointer' : 'cursor-pointer';
  }

  protected isRowSelected(row: T): boolean {
    return this.selectedKeys().has(this.rowId(row));
  }

  protected onToggleAll(checked: boolean): void {
    const keys = new Set(checked ? this.data().map((r) => this.rowId(r)) : []);
    this.selectedKeys.set(keys);
    this.selectionChange.emit(checked ? [...this.data()] : []);
  }

  protected onToggleRow(row: T, checked: boolean): void {
    const keys = new Set(this.selectedKeys());
    if (checked) {
      keys.add(this.rowId(row));
    } else {
      keys.delete(this.rowId(row));
    }
    this.selectedKeys.set(keys);
    this.selectionChange.emit(this.data().filter((r) => keys.has(this.rowId(r))));
  }

  protected getCellValue(row: T, key: string): string {
    const val = row[key as keyof T];
    return val != null ? String(val) : '';
  }

  protected copyToClipboard(value: string): void {
    void navigator.clipboard.writeText(value);
  }

  protected getCellNumberValue(row: T, key: string): number {
    const val = row[key as keyof T];
    return typeof val === 'number' ? val : Number(val) || 0;
  }

  protected getDateDisplay(row: T, key: string): string {
    const val = row[key as keyof T];
    if (!val) return '—';
    try {
      const date = typeof val === 'string' ? new Date(val) : val instanceof Date ? val : null;
      if (!date || isNaN(date.getTime())) return '—';
      return timeAgoStrict(date);
    } catch {
      return '—';
    }
  }

  protected getDateTooltip(row: T, key: string): string {
    const val = row[key as keyof T];
    if (!val) return '';
    try {
      const date = typeof val === 'string' ? new Date(val) : val instanceof Date ? val : null;
      if (!date || isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  }

  protected getStatusColor(row: T, col: TableDataColumn<T>): TableDataStatusColor {
    const rawVal = this.getCellValue(row, col.key);
    return col.cellData?.colorMap?.[rawVal] ?? 'blue';
  }

  protected isSorted(key: string): boolean {
    const s = this.sort();
    return s != null && s.columnKey === key && s.direction != null;
  }

  protected sortDirection(key: string): 'asc' | 'desc' | null {
    const s = this.sort();
    return s != null && s.columnKey === key ? s.direction : null;
  }

  protected onAction(row: T, action: string): void {
    this.rowAction.emit({ row, action });
  }

  protected onCellSwitchChange(row: T, key: string, value: boolean): void {
    this.cellValueChange.emit({ row, key, value });
  }

  protected getTextLines(row: T, key: string): string[] {
    const val = row[key as keyof T];
    return Array.isArray(val) ? val : [];
  }

  protected getAvatarGroupItems(row: T, key: string): AvatarGroupItem[] {
    const val = row[key as keyof T];
    return Array.isArray(val) ? val : [];
  }

  protected normalizeUrl(url: string): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
    return `https://${url}`;
  }

  protected readonly computedClass = computed(() => cn('block w-full', this.class()));
}
