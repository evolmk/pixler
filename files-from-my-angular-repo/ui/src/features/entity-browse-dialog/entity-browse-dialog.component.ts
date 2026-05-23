import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '../../components/dialog';
import {
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogBodyComponent,
  DialogFooterComponent,
} from '../../components/dialog/dialog.component';
import { ButtonComponent } from '../../components/button';
import { InputComponent } from '../../components/input';
import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { type TreeNode } from '../../components/tree/tree.component';

/** A single entity item that can be selected in the browse dialog. */
export interface EntityBrowseItem {
  id: string;
  name: string;
  /** Optional group ID for tree filtering. */
  groupId?: string;
  /** Optional group name for display in search results. */
  groupName?: string;
  /** Optional secondary text (e.g., file extension, part number). */
  subtitle?: string;
  /** Optional thumbnail URL (e.g., for images). */
  thumbnailUrl?: string;
  /** Arbitrary extra data passed through on selection. */
  data?: Record<string, unknown>;
}

/** Configuration passed via DIALOG_DATA when opening the dialog. */
export interface EntityBrowseDialogData {
  /** Dialog title (e.g., "Select Images", "Select Drawings"). */
  title: string;
  /** Tree nodes representing the group hierarchy. */
  groupTree: TreeNode[];
  /** All available items to browse/search. */
  items: EntityBrowseItem[];
  /** IDs of items already in the array (to exclude or mark). */
  excludeIds?: string[];
  /** Whether to allow multi-select. Defaults to true. */
  multiSelect?: boolean;
}

/** Result returned when the dialog closes with selections. */
export interface EntityBrowseDialogResult {
  selectedItems: EntityBrowseItem[];
}

@Component({
  selector: 'ui-entity-browse-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    ButtonComponent,
    InputComponent,
    CheckboxComponent,
  ],
  template: `
    <!-- Header -->
    <ui-dialog-header [class]="'flex-row items-center justify-between !space-y-0 !pb-3'">
      <ui-dialog-title>{{ data.title }}</ui-dialog-title>
      <button
        type="button"
        class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
        aria-label="Close"
        (click)="onCancel()"
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
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </ui-dialog-header>

    <!-- Body -->
    <ui-dialog-body [class]="'!p-0 !overflow-hidden'">
      <div class="flex h-[60vh]">
        <!-- Left: Group Tree -->
        <div class="w-64 shrink-0 border-r border-border overflow-auto p-3">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Groups</p>
          @if (data.groupTree.length > 0) {
            <div class="space-y-0.5">
              <button
                type="button"
                class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer"
                [class]="
                  selectedGroupId() === null
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-foreground hover:bg-muted'
                "
                (click)="selectGroup(null)"
              >
                All ({{ allItems().length }})
              </button>
              @for (node of flatGroupNodes(); track node.id) {
                <button
                  type="button"
                  class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer"
                  [style.padding-left.px]="8 + node.depth * 16"
                  [class]="
                    selectedGroupId() === node.id
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground hover:bg-muted'
                  "
                  (click)="selectGroup(node.id)"
                >
                  {{ node.label }} ({{ getGroupItemCount(node.id) }})
                </button>
              }
            </div>
          } @else {
            <p class="text-xs text-muted-foreground">No groups available.</p>
          }
        </div>

        <!-- Right: Items list -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Search bar -->
          <div class="p-3 border-b border-border">
            <input uiInput [(ngModel)]="searchQuery" placeholder="Search items..." class="w-full" />
          </div>

          <!-- Items -->
          <div class="flex-1 overflow-auto">
            @if (filteredItems().length > 0) {
              <div class="divide-y divide-border">
                @for (item of filteredItems(); track item.id) {
                  @if (excludeSet.has(item.id)) {
                    <!-- Already-linked item: visible but grayed out -->
                    <div class="w-full flex items-center gap-3 px-4 py-2.5 opacity-40 cursor-default">
                      <ui-checkbox [checked]="true" [disabled]="true" />
                      @if (item.thumbnailUrl) {
                        <div
                          class="size-10 rounded border border-border bg-white overflow-hidden flex items-center justify-center shrink-0"
                        >
                          <img
                            [src]="item.thumbnailUrl"
                            [alt]="item.name"
                            class="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      }
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-foreground truncate">{{ item.name }}</p>
                        <p class="text-xs text-muted-foreground truncate">Already added</p>
                      </div>
                    </div>
                  } @else {
                    <!-- Selectable item -->
                    <button
                      type="button"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer"
                      [class]="selectedIds().has(item.id) ? 'bg-accent/50' : 'hover:bg-muted/50'"
                      (click)="toggleItem(item)"
                    >
                      <ui-checkbox
                        [checked]="selectedIds().has(item.id)"
                        (click)="$event.stopPropagation()"
                        (checkedChange)="toggleItem(item)"
                      />
                      @if (item.thumbnailUrl) {
                        <div
                          class="size-10 rounded border border-border bg-white overflow-hidden flex items-center justify-center shrink-0"
                        >
                          <img
                            [src]="item.thumbnailUrl"
                            [alt]="item.name"
                            class="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      }
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-foreground truncate">{{ item.name }}</p>
                        @if (item.subtitle || item.groupName) {
                          <p class="text-xs text-muted-foreground truncate">
                            {{ item.groupName ?? '' }}{{ item.subtitle && item.groupName ? ' · ' : ''
                            }}{{ item.subtitle ?? '' }}
                          </p>
                        }
                      </div>
                    </button>
                  }
                }
              </div>
            } @else {
              <div class="flex items-center justify-center h-full">
                <p class="text-sm text-muted-foreground">No items found.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </ui-dialog-body>

    <!-- Footer -->
    <ui-dialog-footer [class]="'!flex-row !justify-between items-center !p-4'">
      <span class="text-sm text-muted-foreground">
        {{ selectedIds().size }} item{{ selectedIds().size !== 1 ? 's' : '' }} selected
      </span>
      <div class="flex items-center gap-2">
        <button uiButton variant="outline" (click)="onCancel()">Cancel</button>
        <button uiButton variant="default" [disabled]="selectedIds().size === 0" (click)="onConfirm()">
          Add Selected
        </button>
      </div>
    </ui-dialog-footer>
  `,
})
export class EntityBrowseDialogComponent {
  private readonly dialogRef = inject(DialogRef);
  readonly data = inject(DIALOG_DATA) as EntityBrowseDialogData;

  protected readonly searchQuery = signal('');
  protected readonly selectedGroupId = signal<string | null>(null);
  protected readonly selectedIds = signal(new Set<string>());

  readonly excludeSet = new Set(this.data.excludeIds ?? []);

  /** All items (including already-linked, shown grayed out). */
  protected readonly allItems = computed(() => this.data.items);

  /** Items not already in the target array (selectable). */
  protected readonly availableItems = computed(() => this.data.items.filter((item) => !this.excludeSet.has(item.id)));

  /** Flatten group tree for simple rendering with depth. */
  protected readonly flatGroupNodes = computed(() => {
    const result: { id: string; label: string; depth: number }[] = [];
    const walk = (nodes: TreeNode[], depth: number) => {
      for (const node of nodes) {
        result.push({ id: node.id, label: node.label, depth });
        if (node.children?.length) walk(node.children, depth + 1);
      }
    };
    walk(this.data.groupTree, 0);
    return result;
  });

  /** Collect all descendant group IDs for a given group (inclusive). */
  private getDescendantIds(groupId: string): Set<string> {
    const ids = new Set<string>();
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.id === groupId) {
          const collect = (n: TreeNode) => {
            ids.add(n.id);
            n.children?.forEach(collect);
          };
          collect(node);
          return true;
        }
        if (node.children?.length && walk(node.children)) return true;
      }
      return false;
    };
    walk(this.data.groupTree);
    return ids;
  }

  /** Items filtered by selected group and search query (includes excluded items shown grayed out). */
  protected readonly filteredItems = computed(() => {
    let items = this.allItems();
    const groupId = this.selectedGroupId();
    if (groupId) {
      const descendantIds = this.getDescendantIds(groupId);
      items = items.filter((item) => item.groupId && descendantIds.has(item.groupId));
    }
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.subtitle?.toLowerCase().includes(query) ?? false) ||
          (item.groupName?.toLowerCase().includes(query) ?? false),
      );
    }
    // Sort: available items first, then excluded items
    return items.sort((a, b) => {
      const aExcluded = this.excludeSet.has(a.id) ? 1 : 0;
      const bExcluded = this.excludeSet.has(b.id) ? 1 : 0;
      return aExcluded - bExcluded;
    });
  });

  protected getGroupItemCount(groupId: string): number {
    const descendantIds = this.getDescendantIds(groupId);
    return this.allItems().filter((item) => item.groupId && descendantIds.has(item.groupId)).length;
  }

  protected selectGroup(groupId: string | null): void {
    this.selectedGroupId.set(groupId);
  }

  protected toggleItem(item: EntityBrowseItem): void {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        if (this.data.multiSelect === false) next.clear();
        next.add(item.id);
      }
      return next;
    });
  }

  protected onConfirm(): void {
    const selectedItems = this.data.items.filter((item) => this.selectedIds().has(item.id));
    this.dialogRef.close({ selectedItems } satisfies EntityBrowseDialogResult);
  }

  protected onCancel(): void {
    this.dialogRef.close(undefined);
  }
}
