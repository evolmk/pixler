import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../components/button/button.component';
import { DrawerComponent, DrawerContentComponent } from '../../../components/drawer/drawer.component';
import { SwitchComponent } from '../../../components/switch/switch.component';
import { cn } from '../../../utils/cn';
import { TableDataColumn } from '../types/column.types';

export interface ColumnOverrideState {
  visibility: Record<string, boolean>;
  order: string[];
}

interface ColumnItem {
  key: string;
  label: string;
  visible: boolean;
  locked: boolean;
}

@Component({
  selector: 'ui-table-data-column-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DrawerComponent,
    DrawerContentComponent,
    ButtonComponent,
    SwitchComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDragPreview,
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-drawer #drawerRef>
      <ui-drawer-content side="right" size="default" [showClose]="false" class="flex flex-col">
        <!-- Header -->
        <div class="shrink-0 flex items-center justify-between pb-2">
          <span class="text-lg font-semibold text-foreground">Manage Columns</span>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            (click)="close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>

        <!-- Column list (scrollable) -->
        <div class="flex-1 min-h-0 overflow-y-auto py-4">
          <!-- Locked columns (not draggable) -->
          @for (col of lockedColumns(); track col.key) {
            <div class="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 mb-1">
              <!-- Lock icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4 text-muted-foreground shrink-0"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span class="font-medium text-muted-foreground flex-1">{{ col.label }}</span>
            </div>
          }

          <!-- Reorderable columns -->
          <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="space-y-1">
            @for (col of reorderableColumns(); track col.key) {
              <div cdkDrag class="flex items-center rounded-lg border border-border bg-background">
                <!-- Placeholder: the ghost slot shown where the item will land -->
                <div
                  *cdkDragPlaceholder
                  class="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 h-9"
                ></div>

                <!-- Drag handle area — only this initiates drag -->
                <div
                  cdkDragHandle
                  class="flex items-center justify-center w-10 shrink-0 self-stretch cursor-grab active:cursor-grabbing rounded-l-lg hover:bg-muted/50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 text-muted-foreground"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </div>

                <!-- Label -->
                <span class="font-medium text-foreground flex-1 py-1.5 select-none">{{ col.label }}</span>

                <!-- Toggle area — padded for easier clicking -->
                <div
                  class="flex items-center justify-center w-14 shrink-0 self-stretch rounded-r-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  (click)="onToggleVisibility(col.key, !col.visible); $event.stopPropagation()"
                >
                  <ui-switch
                    [checked]="col.visible"
                    (checkedChange)="onToggleVisibility(col.key, $event)"
                    size="sm"
                    [showValue]="false"
                  />
                </div>

                <!-- Drag preview: what follows the cursor -->
                <div
                  *cdkDragPreview
                  class="flex items-center gap-3 rounded-lg border border-primary/40 bg-background px-3 py-1.5 shadow-lg w-[280px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                  <span class="font-medium text-foreground">{{ col.label }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Footer -->
        <div class="shrink-0 flex gap-2 pt-2">
          <button ui-button variant="outline" type="button" class="flex-1" (click)="onReset()">Reset to Default</button>
          <button ui-button variant="default" type="button" class="flex-1" (click)="onSave()">Save</button>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `,
})
export class TableDataColumnDrawerComponent {
  @ViewChild('drawerRef') private _drawer!: DrawerComponent;

  readonly columns = input.required<TableDataColumn<any>[]>();
  readonly overrides = input<ColumnOverrideState | null>(null);
  readonly class = input<string>('');

  readonly stateChange = output<ColumnOverrideState>();
  readonly reset = output<void>();

  /** Local working copy of column items */
  private readonly _localColumns = signal<ColumnItem[]>([]);

  readonly lockedColumns = computed(() => this._localColumns().filter((c) => c.locked));
  readonly reorderableColumns = computed(() => this._localColumns().filter((c) => !c.locked));

  open(): void {
    this._localColumns.set(this.buildColumnItems());
    this._drawer.open();
  }

  close(): void {
    this._drawer.close();
  }

  protected onToggleVisibility(key: string, visible: boolean): void {
    this._localColumns.update((cols) => cols.map((c) => (c.key === key ? { ...c, visible } : c)));
  }

  protected onDrop(event: CdkDragDrop<ColumnItem[]>): void {
    const reorderable = this.reorderableColumns().slice();
    moveItemInArray(reorderable, event.previousIndex, event.currentIndex);

    // Rebuild full list: locked columns at their original positions, then reorderable
    const locked = this._localColumns().filter((c) => c.locked);
    this._localColumns.set([...locked, ...reorderable]);
  }

  protected onReset(): void {
    this.reset.emit();
    this._drawer.close();
  }

  protected onSave(): void {
    const visibility: Record<string, boolean> = {};
    const order: string[] = [];

    for (const col of this._localColumns()) {
      if (!col.locked) {
        visibility[col.key] = col.visible;
        order.push(col.key);
      }
    }

    this.stateChange.emit({ visibility, order });
    this._drawer.close();
  }

  private buildColumnItems(): ColumnItem[] {
    const cols = this.columns();
    const ov = this.overrides();

    if (!ov) {
      return cols.map((c) => ({
        key: c.key,
        label: c.label,
        visible: c.visible !== false,
        locked: !!c.locked,
      }));
    }

    const locked = cols
      .filter((c) => c.locked)
      .map((c) => ({
        key: c.key,
        label: c.label,
        visible: true,
        locked: true,
      }));

    const nonLocked = cols.filter((c) => !c.locked);
    const colMap = new Map(nonLocked.map((c) => [c.key, c]));

    // Order from overrides, then any new columns not in the saved order
    const ordered: ColumnItem[] = [];
    for (const key of ov.order) {
      const col = colMap.get(key);
      if (col) {
        ordered.push({
          key: col.key,
          label: col.label,
          visible: ov.visibility[col.key] ?? col.visible !== false,
          locked: false,
        });
        colMap.delete(key);
      }
    }

    // Remaining columns not in saved order
    for (const [, col] of colMap) {
      ordered.push({
        key: col.key,
        label: col.label,
        visible: ov.visibility[col.key] ?? col.visible !== false,
        locked: false,
      });
    }

    return [...locked, ...ordered];
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}
