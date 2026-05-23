import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  InjectionToken,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import type { Observable } from 'rxjs';
import { cn } from '../../utils/cn';

// ── Public interfaces ──────────────────────────────────────────────────────────

export interface GroupSelectNode {
  id: string;
  name: string;
  children: GroupSelectNode[];
}

export interface GroupSelectDataProvider {
  getTree(groupTypeAbbr?: string): Observable<GroupSelectNode[]>;
}

export const GROUP_SELECT_DATA_PROVIDER = new InjectionToken<GroupSelectDataProvider>('GroupSelectDataProvider');

// ── Helpers ────────────────────────────────────────────────────────────────────

interface FlatNode {
  id: string;
  name: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

function flattenTree(nodes: GroupSelectNode[], depth: number, expandedSet: Set<string>): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    const hasChildren = node.children.length > 0;
    const expanded = expandedSet.has(node.id);
    result.push({ id: node.id, name: node.name, depth, hasChildren, expanded });
    if (hasChildren && expanded) {
      result.push(...flattenTree(node.children, depth + 1, expandedSet));
    }
  }
  return result;
}

function findNodeName(nodes: GroupSelectNode[], id: string): string | null {
  for (const node of nodes) {
    if (node.id === id) return node.name;
    const found = findNodeName(node.children, id);
    if (found) return found;
  }
  return null;
}

function filterTree(nodes: GroupSelectNode[], query: string): GroupSelectNode[] {
  const result: GroupSelectNode[] = [];
  for (const node of nodes) {
    const childMatches = filterTree(node.children, query);
    if (node.name.toLowerCase().includes(query) || childMatches.length > 0) {
      result.push({ ...node, children: childMatches });
    }
  }
  return result;
}

function collectAllIds(nodes: GroupSelectNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.id);
    ids.push(...collectAllIds(node.children));
  }
  return ids;
}

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-group-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()', '(document:click)': 'onDocumentClick($event)' },
  template: `
    <button
      type="button"
      #trigger
      (click)="toggleOpen()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [disabled]="disabled()"
      [class]="triggerClass()"
    >
      <span class="flex-1 text-start truncate" [class.text-muted-foreground]="!selectedLabel()">
        {{ selectedLabel() || placeholder() }}
      </span>
      <svg
        class="size-4 shrink-0 text-muted-foreground transition-transform"
        [class.rotate-180]="isOpen()"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
    @if (isOpen()) {
      <div [class]="dropdownClass()">
        @if (searchable()) {
          <div class="p-2 border-b border-border">
            <input
              type="text"
              [placeholder]="searchPlaceholder()"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        }
        <ul role="listbox" class="max-h-96 overflow-y-auto p-1">
          @for (node of visibleNodes(); track node.id) {
            <li
              role="option"
              [attr.aria-selected]="node.id === value()"
              [class]="nodeClass(node)"
              [style.padding-left.px]="node.depth * 16 + 8"
              (click)="onNodeClick(node, $event)"
            >
              <!-- Expand/collapse toggle for parent nodes -->
              @if (node.hasChildren) {
                <button
                  type="button"
                  class="shrink-0 size-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  (click)="toggleExpand(node, $event)"
                >
                  <svg
                    class="size-3 transition-transform"
                    [class.rotate-90]="node.expanded"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              } @else {
                <span class="shrink-0 size-4"></span>
              }
              <span class="truncate">{{ node.name }}</span>
            </li>
          }
          @if (visibleNodes().length === 0) {
            <li class="px-3 py-2 text-sm text-muted-foreground text-center">
              {{ loading() ? 'Loading...' : emptyMessage() }}
            </li>
          }
        </ul>
        @if (clearable() && value()) {
          <div class="border-t border-border p-1">
            <button
              type="button"
              class="w-full text-left px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              (click)="clearSelection($event)"
            >
              {{ clearLabel() }}
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class GroupSelectComponent {
  private readonly provider = inject(GROUP_SELECT_DATA_PROVIDER);

  // ── Inputs ──────────────────────────────────────────────────────────────────
  readonly groupTypeAbbr = input<string>('');
  /** Optional: only show children under this root group name (e.g. 'Parts' under 'Images'). */
  readonly rootGroupName = input<string>('');
  readonly value = model<string>('');
  readonly parentSelectable = input<boolean>(true);
  readonly searchable = input<boolean>(true);
  readonly placeholder = input<string>('Select group');
  readonly searchPlaceholder = input<string>('Search...');
  readonly emptyMessage = input<string>('No groups found');
  readonly expanded = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly clearable = input<boolean>(true);
  readonly clearLabel = input<string>('Clear selection');
  readonly class = input<string>('');

  // ── State ───────────────────────────────────────────────────────────────────
  protected readonly isOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly loading = signal(false);
  private readonly tree = signal<GroupSelectNode[]>([]);
  private readonly expandedIds = signal<Set<string>>(new Set());

  // ── Computed ────────────────────────────────────────────────────────────────
  protected readonly computedClass = computed(() => cn('relative w-full block', this.class()));

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      this.isOpen() && 'ring-2 ring-ring',
    ),
  );

  protected readonly dropdownClass = computed(() =>
    cn('absolute z-50 w-full mt-1 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg'),
  );

  protected readonly selectedLabel = computed(() => {
    const id = this.value();
    if (!id) return '';
    return findNodeName(this.tree(), id) ?? '';
  });

  protected readonly visibleNodes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const source = query ? filterTree(this.tree(), query) : this.tree();
    const expanded = query
      ? new Set(collectAllIds(source)) // expand all when searching
      : this.expandedIds();
    return flattenTree(source, 0, expanded);
  });

  constructor() {
    // Load tree data when groupTypeAbbr changes (empty = all groups).
    // Cancel the previous subscription on re-run so a late full-tree response
    // can't overwrite a filtered response that arrived first.
    effect((onCleanup) => {
      const abbr = this.groupTypeAbbr();
      const rootName = this.rootGroupName();
      this.loading.set(true);
      const sub = this.provider.getTree(abbr || undefined).subscribe({
        next: (nodes) => {
          // If rootGroupName is set, find that node and only show its children
          let filtered = nodes;
          if (rootName) {
            const root = nodes.find((n) => n.name.toLowerCase() === rootName.toLowerCase());
            filtered = root?.children ?? [];
          }
          this.tree.set(filtered);
          if (this.expanded()) {
            this.expandedIds.set(new Set(collectAllIds(filtered)));
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  protected toggleOpen(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
      if (!this.isOpen()) {
        this.searchQuery.set('');
      }
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    const el = (event.target as HTMLElement).closest('ui-group-select');
    if (!el || el !== (event.target as HTMLElement).closest('ui-group-select')) {
      this.isOpen.set(false);
    }
  }

  protected toggleExpand(node: FlatNode, event: Event): void {
    event.stopPropagation();
    this.expandedIds.update((set) => {
      const next = new Set(set);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }

  protected onNodeClick(node: FlatNode, event: Event): void {
    event.stopPropagation();
    if (node.hasChildren && !this.parentSelectable()) {
      // If parent not selectable, just toggle expand
      this.toggleExpand(node, event);
      return;
    }
    this.value.set(node.id);
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected clearSelection(event: Event): void {
    event.stopPropagation();
    this.value.set('');
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  protected nodeClass(node: FlatNode): string {
    const isSelected = node.id === this.value();
    const isDisabledParent = node.hasChildren && !this.parentSelectable();
    return cn(
      'flex items-center gap-1.5 rounded-md py-1.5 pr-3 text-sm transition-colors',
      isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-accent hover:text-accent-foreground',
      isDisabledParent && 'text-muted-foreground font-medium',
      !isDisabledParent && 'cursor-pointer',
    );
  }
}
