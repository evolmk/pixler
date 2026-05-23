import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  InjectionToken,
  ViewEncapsulation,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { ButtonComponent } from '../button/button.component';
import { type ButtonVariants } from '../button/button.variants';

export const PAGINATION_TOKEN = new InjectionToken<PaginationComponent>('PAGINATION_TOKEN');

// ── Content ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class PaginationContentComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex flex-row items-center gap-1', this.class()));
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
})
export class PaginationItemComponent {}

// ── Link ──────────────────────────────────────────────────────────────────────

@Directive({
  selector: 'a[uiPaginationLink], button[uiPaginationLink]',
  standalone: true,
  host: { '[class]': 'computedClass()' },
})
export class PaginationLinkDirective {
  readonly class = input<string>('');
  readonly isActive = input<boolean>(false);
  readonly size = input<'default' | 'sm' | 'lg' | 'icon'>('icon');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
      'ring-offset-background transition-colors cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      this.isActive()
        ? 'bg-accent text-accent-foreground border border-transparent'
        : 'border border-transparent hover:border-input hover:bg-background',
      this.size() === 'default'
        ? 'h-10 px-4 py-2'
        : this.size() === 'sm'
          ? 'h-9 px-3'
          : this.size() === 'lg'
            ? 'h-11 px-8'
            : 'h-10 w-10',
      this.class(),
    ),
  );
}

// ── Previous ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination-previous',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': '"Go to previous page"',
  },
  template: `
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
      <path d="m15 18-6-6 6-6" />
    </svg>
    <span>Previous</span>
  `,
})
export class PaginationPreviousComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center gap-1 pl-2.5 rounded-md text-sm font-medium cursor-pointer',
      'ring-offset-background transition-colors h-10 px-4 py-2',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

// ── Next ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination-next',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': '"Go to next page"',
  },
  template: `
    <span>Next</span>
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
})
export class PaginationNextComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center justify-center gap-1 pr-2.5 rounded-md text-sm font-medium cursor-pointer',
      'ring-offset-background transition-colors h-10 px-4 py-2',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

// ── Ellipsis ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination-ellipsis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"flex h-10 w-10 items-center justify-center"',
    '[attr.aria-hidden]': '"true"',
  },
  template: `
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
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span class="sr-only">More pages</span>
  `,
})
export class PaginationEllipsisComponent {}

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: PAGINATION_TOKEN, useExisting: forwardRef(() => PaginationComponent) }],
  imports: [
    PaginationContentComponent,
    PaginationItemComponent,
    PaginationLinkDirective,
    PaginationEllipsisComponent,
    ButtonComponent,
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"navigation"',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <!-- Optional page-size picker (left) -->
    @if (showPageSize()) {
      <select
        class="h-8 w-[72px] shrink-0 cursor-pointer rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        (change)="onPageSizeSelectChange($event)"
      >
        @for (opt of pageSizeOptions(); track opt) {
          <option [value]="opt" [selected]="opt === pageSize()">{{ opt === 0 ? 'All' : opt }}</option>
        }
      </select>
    }

    @if (_hasCustomContent()) {
      <ng-content />
    } @else {
      <ui-pagination-content>
        <!-- First button -->
        @if (showFirstLast()) {
          <ui-pagination-item>
            <button
              ui-button
              [variant]="navButtonVariant()"
              size="icon"
              [disabled]="pageIndex() <= 1"
              (click)="goToPage(1)"
              aria-label="Go to first page"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path d="m11 17-5-5 5-5" />
                <path d="m18 17-5-5 5-5" />
              </svg>
            </button>
          </ui-pagination-item>
        }

        <!-- Previous button -->
        <ui-pagination-item>
          <button
            ui-button
            [variant]="navButtonVariant()"
            size="default"
            [disabled]="pageIndex() <= 1"
            (click)="goToPage(pageIndex() - 1)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {{ previousLabel() }}
          </button>
        </ui-pagination-item>

        @if (variant() === 'default') {
          @for (page of visiblePages(); track $index) {
            @if (page === -1) {
              <ui-pagination-ellipsis />
            } @else {
              <ui-pagination-item>
                <button uiPaginationLink [isActive]="page === pageIndex()" (click)="goToPage(page)">{{ page }}</button>
              </ui-pagination-item>
            }
          }
        }

        <!-- Next button -->
        <ui-pagination-item>
          <button
            ui-button
            [variant]="navButtonVariant()"
            size="default"
            [disabled]="pageIndex() >= totalPages()"
            (click)="goToPage(pageIndex() + 1)"
          >
            {{ nextLabel() }}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </ui-pagination-item>

        <!-- Last button -->
        @if (showFirstLast()) {
          <ui-pagination-item>
            <button
              ui-button
              [variant]="navButtonVariant()"
              size="icon"
              [disabled]="pageIndex() >= totalPages()"
              (click)="goToPage(totalPages())"
              aria-label="Go to last page"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
                aria-hidden="true"
              >
                <path d="m6 17 5-5-5-5" />
                <path d="m13 17 5-5-5-5" />
              </svg>
            </button>
          </ui-pagination-item>
        }
      </ui-pagination-content>
    }

    <!-- Optional record count (right) -->
    @if (showCount()) {
      <span class="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{{ countText() }}</span>
    }
  `,
})
export class PaginationComponent {
  readonly pageIndex = model<number>(1);
  readonly total = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('pagination');
  readonly class = input<string>('');

  /** `'default'` — auto-generates page numbers with ellipsis. `'minimal'` — Prev/Next only. */
  readonly variant = input<'default' | 'minimal'>('default');
  /** Show First / Last jump buttons alongside Prev / Next. */
  readonly showFirstLast = input<boolean>(false);
  /** Max number of page links shown between Prev and Next (default: 7). */
  readonly maxVisiblePages = input<number>(7);
  /** Label for the previous button (default: 'Prev'). */
  readonly previousLabel = input<string>('Prev');
  /** Label for the next button (default: 'Next'). */
  readonly nextLabel = input<string>('Next');
  /** Variant for the Prev / Next / First / Last nav buttons (default: 'ghost'). */
  readonly navButtonVariant = input<ButtonVariants['variant']>('ghost');
  /** Show a page-size picker to the left of the pagination buttons. */
  readonly showPageSize = input<boolean>(false);
  /** Options for the page-size picker. Use 0 to add an "All" option. */
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  /** Show a "X–Y of Z" record count to the right of the pagination buttons. */
  readonly showCount = input<boolean>(false);

  /** Emitted when the user selects a new page size. */
  readonly pageSizeChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  /** Detect projected custom content for backwards compatibility. */
  private readonly _customContent = contentChild(PaginationContentComponent);
  protected readonly _hasCustomContent = computed(() => !!this._customContent());

  /**
   * Returns page numbers and -1 sentinels for ellipsis.
   * `maxVisiblePages` is the total number of rendered items (page buttons + ellipses).
   * Example for page 5 of 10 with maxVisiblePages=7: [1, -1, 4, 5, 6, -1, 10] (7 items)
   */
  readonly visiblePages = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    const max = this.maxVisiblePages();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Budget: first + last = 2 fixed slots; each ellipsis = 1 slot; window = remaining.
    // With both ellipses: window = max - 4. Center window around current.
    const windowSize = Math.max(1, max - 4);
    const half = Math.floor(windowSize / 2);

    let rangeStart = Math.max(2, current - half);
    let rangeEnd = Math.min(total - 1, rangeStart + windowSize - 1);

    // Pull rangeStart back if we hit the right boundary
    if (rangeEnd - rangeStart + 1 < windowSize) {
      rangeStart = Math.max(2, rangeEnd - windowSize + 1);
    }

    // If no left ellipsis, spend that freed slot on one more page at the right
    if (rangeStart === 2) {
      rangeEnd = Math.min(total - 1, rangeEnd + 1);
    }
    // If no right ellipsis, spend that freed slot on one more page at the left
    if (rangeEnd === total - 1) {
      rangeStart = Math.max(2, rangeStart - 1);
    }

    const pages: number[] = [1];
    if (rangeStart > 2) pages.push(-1); // left ellipsis
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < total - 1) pages.push(-1); // right ellipsis
    pages.push(total);

    return pages;
  });

  protected readonly countText = computed(() => {
    const total = this.total();
    if (total === 0) return '0 results';
    const ps = this.pageSize();
    if (ps === 0) return `All ${total}`;
    const start = (this.pageIndex() - 1) * ps + 1;
    const end = Math.min(this.pageIndex() * ps, total);
    return `${start}–${end} of ${total}`;
  });

  goToPage(page: number): void {
    if (this.disabled()) return;
    const clamped = Math.max(1, Math.min(this.totalPages(), page));
    this.pageIndex.set(clamped);
  }

  protected onPageSizeSelectChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSizeChange.emit(value);
  }

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full items-center',
      this.showPageSize() || this.showCount() ? 'justify-between gap-4' : 'justify-center',
      this.class(),
    ),
  );
}
