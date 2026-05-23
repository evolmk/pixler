import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  OnDestroy,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const TABS_TOKEN = new InjectionToken<TabsComponent>('TABS_TOKEN');

type TabsVariant = 'default' | 'underline' | 'pills' | 'card';
type TabsPosition = 'top' | 'bottom' | 'left' | 'right';
type TabsAlign = 'start' | 'center' | 'end';

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: TABS_TOKEN, useExisting: forwardRef(() => TabsComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TabsComponent {
  readonly value = model<string>('');
  readonly variant = input<TabsVariant>('default');
  readonly position = input<TabsPosition>('top');
  readonly class = input<string>('');

  isActive(tab: string): boolean {
    return this.value() === tab;
  }
  select(tab: string): void {
    this.value.set(tab);
  }

  protected readonly computedClass = computed(() =>
    cn('block', this.position() === 'left' || this.position() === 'right' ? 'flex flex-row' : '', this.class()),
  );
}

// ── List ─────────────────────────────────────────────────────────────────────

const LIST_VARIANT: Record<TabsVariant, string> = {
  default: 'inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground',
  underline: 'inline-flex h-10 items-center justify-start border-b',
  pills: 'inline-flex h-10 items-center justify-start gap-1',
  card: 'inline-flex h-10 items-center justify-start',
};

/**
 * Scrollable tab list architecture:
 *
 * Problem: overflow-x-auto clips position:absolute children.
 * Solution: separate the scroll container (inner div) from the
 * positioning context (host element). Arrows are absolutely
 * positioned children of the host, overlaying the scroll container.
 *
 * Host (position:relative, NO overflow)
 *   ├── Inner div (variant styling, overflow-x-auto, hidden scrollbar)
 *   │   └── ng-content (tab triggers)
 *   ├── Left arrow (position:absolute, gradient fade)
 *   └── Right arrow (position:absolute, gradient fade)
 *
 * Non-scrollable: host uses display:contents so the inner div
 * behaves exactly like the old host element did.
 */
@Component({
  selector: 'ui-tabs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'scrollable() ? "relative block w-full" : ""',
    '[style.display]': 'scrollable() ? null : "contents"',
    role: 'tablist',
  },
  template: `
    <div
      #scrollContainer
      [class]="innerClass()"
      [style.scrollbar-width]="scrollable() ? 'none' : null"
      (wheel)="onWheel($event)"
    >
      <ng-content />
    </div>
    @if (scrollable()) {
      <div
        class="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-0.5 pr-4 transition-opacity"
        [class]="showLeft() ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        style="background: linear-gradient(to right, var(--color-muted) 30%, transparent)"
      >
        <button
          type="button"
          class="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          (click)="scroll('left')"
          aria-label="Scroll tabs left"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div
        class="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-0.5 pl-4 transition-opacity"
        [class]="showRight() ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        style="background: linear-gradient(to left, var(--color-muted) 30%, transparent)"
      >
        <button
          type="button"
          class="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          (click)="scroll('right')"
          aria-label="Scroll tabs right"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    }
  `,
})
export class TabsListComponent implements AfterViewInit, OnDestroy {
  readonly align = input<TabsAlign>('start');
  readonly class = input<string>('');

  /** Enable horizontal scroll with arrow buttons when tabs overflow. */
  readonly scrollable = input<boolean>(false);

  protected readonly _tabs = inject(TABS_TOKEN);

  private readonly scrollRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  protected readonly showLeft = signal(false);
  protected readonly showRight = signal(false);

  private resizeObs: ResizeObserver | null = null;
  private mutationObs: MutationObserver | null = null;
  private boundUpdate = () => this.updateArrows();

  /** Inner div classes — always gets the variant styling. When scrollable, adds overflow. */
  protected readonly innerClass = computed(() => {
    const variant = this._tabs.variant();
    const align = this.align();
    const base = cn(
      LIST_VARIANT[variant],
      align === 'center' ? 'justify-center' : align === 'end' ? 'justify-end' : '',
      this.class(),
    );
    if (this.scrollable()) {
      return cn(base, '!flex w-full overflow-x-auto !justify-start');
    }
    return base;
  });

  ngAfterViewInit(): void {
    if (!this.scrollable()) return;
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;

    el.addEventListener('scroll', this.boundUpdate, { passive: true });
    window.addEventListener('resize', this.boundUpdate, { passive: true });

    this.resizeObs = new ResizeObserver(this.boundUpdate);
    this.resizeObs.observe(el);

    this.mutationObs = new MutationObserver(this.boundUpdate);
    this.mutationObs.observe(el, { childList: true, subtree: true });

    this.updateArrows();
    setTimeout(() => this.updateArrows(), 200);
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.mutationObs?.disconnect();
    window.removeEventListener('resize', this.boundUpdate);
  }

  onWheel(event: WheelEvent): void {
    if (!this.scrollable()) return;
    if (event.deltaY === 0) return;
    const el = this.scrollRef()?.nativeElement;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
  }

  scroll(direction: 'left' | 'right'): void {
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;
    const step = el.clientWidth * 0.7;
    if (direction === 'left') {
      el.scrollTo({ left: Math.max(0, el.scrollLeft - step), behavior: 'smooth' });
    } else {
      el.scrollTo({ left: Math.min(el.scrollWidth, el.scrollLeft + step), behavior: 'smooth' });
    }
    setTimeout(() => this.updateArrows(), 350);
  }

  private updateArrows(): void {
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;
    this.showLeft.set(el.scrollLeft > 1);
    this.showRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }
}

// ── Trigger ──────────────────────────────────────────────────────────────────

const TRIGGER_ACTIVE_VARIANT: Record<TabsVariant, string> = {
  default: 'data-[state=active]:bg-background data-[state=active]:text-foreground',
  underline: 'data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground',
  pills: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
  card: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-border',
};

@Component({
  selector: 'ui-tabs-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"tab"',
    '[attr.tabindex]': '_tabs.isActive(value()) ? 0 : -1',
    '[attr.aria-selected]': '_tabs.isActive(value())',
    '[attr.data-state]': '_tabs.isActive(value()) ? "active" : "inactive"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(click)': '_select()',
    '(keydown.enter)': '_select()',
    '(keydown.space)': '_select()',
  },
  template: `<ng-content />`,
})
export class TabsTriggerComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly _tabs = inject(TABS_TOKEN);

  protected readonly computedClass = computed(() => {
    const variant = this._tabs.variant();
    return cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium',
      'cursor-pointer ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      TRIGGER_ACTIVE_VARIANT[variant],
      variant === 'default'
        ? 'rounded-sm'
        : variant === 'pills'
          ? 'rounded-full'
          : variant === 'card'
            ? 'rounded-md'
            : '',
      this.class(),
    );
  });

  protected _select(): void {
    if (this.disabled()) return;
    this._tabs.select(this.value());
  }
}

// ── Content ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-tabs-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"tabpanel"',
    '[attr.tabindex]': '"0"',
    '[attr.data-state]': '_tabs.isActive(value()) ? "active" : "inactive"',
    '[style.display]': '_tabs.isActive(value()) ? null : "none"',
  },
  template: `<ng-content />`,
})
export class TabsContentComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');

  protected readonly _tabs = inject(TABS_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'block mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      this.class(),
    ),
  );
}
