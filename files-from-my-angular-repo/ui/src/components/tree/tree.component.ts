import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { cn } from '../../utils/cn';

export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  parentId?: string;
  hasChildren?: boolean;
  data?: T;
  children?: TreeNode<T>[];
  disabled?: boolean;
}

// ── Node ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-tree-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex items-center gap-1 rounded-md py-0.5 px-1 text-sm"' },
  template: `
    <!-- Action button -->
    @if (showAction()) {
      <button
        type="button"
        class="shrink-0 cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        (click)="$event.stopPropagation(); action.emit()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    }

    <!-- Expand toggle -->
    @if (node().children?.length) {
      <button
        type="button"
        class="shrink-0 cursor-pointer rounded p-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        [attr.aria-expanded]="expandedIds().has(node().id)"
        (click)="toggle.emit()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 transition-transform"
          [class]="expandedIds().has(node().id) ? 'rotate-90' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    } @else {
      <span class="h-5 w-5 shrink-0"></span>
    }

    <!-- Checkbox -->
    @if (checkable()) {
      <input
        type="checkbox"
        [checked]="checkedIds().has(node().id)"
        [disabled]="node().disabled"
        class="shrink-0"
        (change)="check.emit()"
        (click)="$event.stopPropagation()"
      />
    }

    <!-- Label -->
    <button
      type="button"
      [class]="labelClass()"
      [disabled]="node().disabled"
      (click)="!node().disabled && select.emit()"
    >
      <ng-content>{{ node().label }}</ng-content>
    </button>
  `,
})
export class TreeNodeComponent<T = unknown> {
  readonly node = input.required<TreeNode<T>>();
  readonly depth = input<number>(0);
  readonly selectable = input<boolean>(true);
  readonly checkable = input<boolean>(false);
  readonly selectedId = input<string>('');
  readonly expandedIds = input<Set<string>>(new Set());
  readonly checkedIds = input<Set<string>>(new Set());

  readonly showAction = input<boolean>(false);

  readonly select = output<void>();
  readonly toggle = output<void>();
  readonly check = output<void>();
  readonly action = output<void>();

  protected labelClass(): string {
    return cn(
      'flex-1 truncate rounded px-1 py-0.5 text-left text-sm transition-colors cursor-pointer',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      this.selectedId() === this.node().id && this.selectable()
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-foreground',
    );
  }
}

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet, TreeNodeComponent],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"tree"',
  },
  template: `
    @for (node of nodes(); track node.id) {
      <ng-container *ngTemplateOutlet="nodeTemplate() || defaultNodeTpl; context: { $implicit: node, depth: 0 }" />
    }

    <ng-template #defaultNodeTpl let-node let-depth="depth">
      <ui-tree-node
        [node]="node"
        [depth]="depth"
        [selectable]="selectable()"
        [checkable]="checkable()"
        [showAction]="showAction()"
        [selectedId]="selectedId()"
        [expandedIds]="expanded()"
        [checkedIds]="_checked()"
        (select)="selectedId.set(node.id); nodeSelect.emit(node)"
        (toggle)="_toggleExpand(node.id)"
        (check)="_toggleCheck(node.id)"
        (action)="nodeAction.emit(node)"
      />
      @if (expanded().has(node.id) && node.children?.length) {
        <div [style.padding-left.px]="16">
          @for (child of node.children; track child.id) {
            <ng-container
              *ngTemplateOutlet="nodeTemplate() || defaultNodeTpl; context: { $implicit: child, depth: depth + 1 }"
            />
          }
        </div>
      }
    </ng-template>
  `,
})
export class TreeComponent<T = unknown> {
  readonly nodes = input.required<TreeNode<T>[]>();
  readonly selectable = input<boolean>(true);
  readonly checkable = input<boolean>(false);
  readonly selectedId = model<string>('');
  readonly nodeTemplate = input<TemplateRef<unknown> | null>(null);
  readonly class = input<string>('');

  readonly showAction = input<boolean>(false);

  readonly nodeSelect = output<TreeNode<T>>();
  readonly nodeAction = output<TreeNode<T>>();
  readonly nodeExpand = output<string>();

  readonly expanded = model<Set<string>>(new Set());
  protected readonly _checked = model<Set<string>>(new Set());

  protected readonly computedClass = computed(() => cn('flex flex-col gap-0.5', this.class()));

  _toggleExpand(id: string): void {
    const s = new Set(this.expanded());
    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }
    this.expanded.set(s);
    this.nodeExpand.emit(id);
  }

  protected _toggleCheck(id: string): void {
    const s = new Set(this._checked());
    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }
    this._checked.set(s);
  }
}
