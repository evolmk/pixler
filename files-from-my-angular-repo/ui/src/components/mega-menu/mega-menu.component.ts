import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { cn } from '../../utils/cn';

export type MegaMenuMode = 'default' | 'tabs' | 'shared';

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-mega-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  host: { '[class]': '"relative flex items-center gap-1"' },
  template: `
    <ng-content />

    @if (mode() === 'shared') {
      <div
        #overlay
        class="ui-mm-overlay"
        [class.is-open]="_activeItem() !== null"
        [class.is-morphing]="_morphing()"
        [style.left.px]="_overlayLeft()"
        [style.width.px]="_overlayWidth()"
        [style.height.px]="_overlayHeight()"
        (mouseenter)="_onOverlayEnter()"
        (mouseleave)="_onOverlayLeave()"
        (click)="_onOverlayClick($event)"
      >
        <div class="ui-mm-overlay-inner">
          @if (_activeItem(); as item) {
            @if (item._contentTemplate(); as tpl) {
              <ng-container *ngTemplateOutlet="tpl" />
            }
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ui-mm-overlay {
        position: absolute;
        top: 100%;
        margin-top: 0.5rem;
        z-index: 50;
        border: 1px solid var(--border, hsl(var(--border)));
        background: var(--popover, hsl(var(--popover)));
        border-radius: 1rem;
        box-shadow:
          0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.08);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-4px);
        pointer-events: none;
        overflow: hidden;
        transition:
          opacity 160ms ease-out,
          transform 160ms ease-out,
          visibility 0s linear 160ms;
      }
      .ui-mm-overlay.is-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
        transition:
          opacity 160ms ease-out,
          transform 160ms ease-out,
          visibility 0s;
      }
      .ui-mm-overlay.is-morphing {
        transition:
          left 260ms cubic-bezier(0.22, 1, 0.36, 1),
          width 260ms cubic-bezier(0.22, 1, 0.36, 1),
          height 260ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 160ms ease-out;
      }
      .ui-mm-overlay-inner {
        width: max-content;
        animation: ui-mm-fade-in 180ms ease-out;
      }
      @keyframes ui-mm-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class MegaMenuComponent implements AfterViewInit {
  readonly mode = input<MegaMenuMode>('default');

  private readonly _hostEl = inject(ElementRef<HTMLElement>);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _items: MegaMenuItemComponent[] = [];

  /** Currently-active item (shared mode). */
  readonly _activeItem = signal<MegaMenuItemComponent | null>(null);
  /** True while morphing dimensions between siblings. */
  readonly _morphing = signal(false);

  readonly _overlayLeft = signal(0);
  readonly _overlayWidth = signal(0);
  readonly _overlayHeight = signal(0);

  @ViewChild('overlay') private overlayRef?: ElementRef<HTMLElement>;

  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _morphTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Recompute overlay size whenever the active item changes (shared mode).
    effect(() => {
      const item = this._activeItem();
      if (this.mode() !== 'shared') return;
      if (!item) return;
      // Defer to next frame so the new template instantiates and we can measure.
      queueMicrotask(() => this._measureAndPosition(item));
    });
  }

  ngAfterViewInit(): void {
    // Click-outside close (shared mode)
    if (typeof document !== 'undefined') {
      const onDocClick = (e: Event) => {
        if (this.mode() !== 'shared') return;
        if (!this._activeItem()) return;
        const target = e.target as HTMLElement;
        if (this._hostEl.nativeElement.contains(target)) return;
        if (this.overlayRef?.nativeElement.contains(target)) return;
        this._activeItem.set(null);
      };
      document.addEventListener('click', onDocClick, true);
      this._destroyRef.onDestroy(() => document.removeEventListener('click', onDocClick, true));
    }
  }

  _register(item: MegaMenuItemComponent): void {
    this._items.push(item);
  }

  _unregister(item: MegaMenuItemComponent): void {
    const idx = this._items.indexOf(item);
    if (idx >= 0) this._items.splice(idx, 1);
    if (this._activeItem() === item) this._activeItem.set(null);
  }

  _closeOthers(except: MegaMenuItemComponent): void {
    for (const item of this._items) {
      if (item !== except) item.close();
    }
  }

  /** Shared-mode: request that this item becomes active (with morph if already open). */
  _setActive(item: MegaMenuItemComponent): void {
    if (this.mode() !== 'shared') return;
    this._cancelClose();
    const prev = this._activeItem();
    if (prev === item) return;
    if (prev !== null) {
      // Morph from prev → item
      this._morphing.set(true);
      if (this._morphTimer) clearTimeout(this._morphTimer);
      this._morphTimer = setTimeout(() => this._morphing.set(false), 280);
    }
    this._activeItem.set(item);
  }

  /** Shared-mode: schedule closing the active overlay (grace period). */
  _scheduleClose(): void {
    if (this.mode() !== 'shared') return;
    this._cancelClose();
    this._closeTimer = setTimeout(() => this._activeItem.set(null), 250);
  }

  _cancelClose(): void {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  _onOverlayEnter(): void {
    this._cancelClose();
  }

  _onOverlayLeave(): void {
    this._scheduleClose();
  }

  /** Close overlay immediately when a routerLink inside is clicked. */
  _onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[href]')) {
      this._activeItem.set(null);
    }
  }

  /** Measure the active item's content and position the shared overlay under its trigger. */
  private _measureAndPosition(item: MegaMenuItemComponent): void {
    const overlay = this.overlayRef?.nativeElement;
    if (!overlay) return;
    const trigger = item._hostEl.nativeElement.querySelector('[uiMegaMenuTrigger]') as HTMLElement | null;
    const triggerRect = trigger?.getBoundingClientRect();
    const rootRect = this._hostEl.nativeElement.getBoundingClientRect();

    // Measure inner content's natural size. Inner has `width: max-content`, so
    // it sizes to its content regardless of the overlay's current animated width.
    // We measure directly with no style mutation — avoids flashes and preserves
    // the running width/height transition.
    const inner = overlay.querySelector('.ui-mm-overlay-inner');
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);

    // Center horizontally under the trigger, clamp to root bounds
    let left = 0;
    if (triggerRect) {
      const triggerCenter = triggerRect.left - rootRect.left + triggerRect.width / 2;
      left = Math.round(triggerCenter - w / 2);
      if (left < 0) left = 0;
    }
    this._overlayLeft.set(left);
    this._overlayWidth.set(w);
    this._overlayHeight.set(h);
  }
}

// ── Item (wrapper) ────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-mega-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"relative"',
    '(mouseenter)': '_onMouseEnter()',
    '(mouseleave)': '_onMouseLeave()',
  },
  template: `<ng-content />`,
})
export class MegaMenuItemComponent {
  private readonly _menu = inject(MegaMenuComponent, { optional: true });
  readonly _hostEl = inject(ElementRef<HTMLElement>);
  readonly _open = signal(false);
  readonly _contentTemplate = signal<TemplateRef<unknown> | null>(null);

  private _hoverOpenTimer: ReturnType<typeof setTimeout> | null = null;
  private _legacyCloseTimer: ReturnType<typeof setTimeout> | null = null;

  get _mode(): MegaMenuMode {
    return this._menu?.mode() ?? 'default';
  }

  get isShared(): boolean {
    return this._mode === 'shared';
  }

  /** Whether this item is currently the visible one. Works for both modes. */
  get isVisible(): boolean {
    if (this.isShared) return this._menu?._activeItem() === this;
    return this._open();
  }

  constructor() {
    this._menu?._register(this);
    inject(DestroyRef).onDestroy(() => this._menu?._unregister(this));
  }

  _setContentTemplate(tpl: TemplateRef<unknown>): void {
    this._contentTemplate.set(tpl);
  }

  toggle(): void {
    if (this.isShared) {
      if (this._menu?._activeItem() === this) {
        this._menu._activeItem.set(null);
      } else {
        this._menu?._setActive(this);
      }
      return;
    }
    const opening = !this._open();
    if (opening) this._menu?._closeOthers(this);
    this._open.set(opening);
  }

  close(): void {
    if (this.isShared) {
      if (this._menu?._activeItem() === this) this._menu._activeItem.set(null);
      return;
    }
    this._cancelLegacyClose();
    this._open.set(false);
  }

  _onMouseEnter(): void {
    if (!this.isShared) return;
    this._menu?._cancelClose();
    if (this._hoverOpenTimer) clearTimeout(this._hoverOpenTimer);
    // If another item is already active, switch immediately (smooth morph).
    if (this._menu?._activeItem() && this._menu._activeItem() !== this) {
      this._menu._setActive(this);
      return;
    }
    this._hoverOpenTimer = setTimeout(() => this._menu?._setActive(this), 120);
  }

  _onMouseLeave(): void {
    if (!this.isShared) return;
    if (this._hoverOpenTimer) {
      clearTimeout(this._hoverOpenTimer);
      this._hoverOpenTimer = null;
    }
    this._menu?._scheduleClose();
  }

  // ── Legacy (non-shared) close timer used by old MegaMenuContentComponent ──

  _scheduleClose(): void {
    this._legacyCloseTimer = setTimeout(() => this._open.set(false), 300);
  }

  cancelClose(): void {
    this._cancelLegacyClose();
  }

  private _cancelLegacyClose(): void {
    if (this._legacyCloseTimer) {
      clearTimeout(this._legacyCloseTimer);
      this._legacyCloseTimer = null;
    }
  }
}

// ── Trigger button ────────────────────────────────────────────────────────────

@Component({
  selector: 'button[uiMegaMenuTrigger], a[uiMegaMenuTrigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '(click)': 'onClick($event)',
  },
  template: `
    <ng-content />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-3 w-3 transition-transform duration-200"
      [class.rotate-180]="isOpen()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  `,
})
export class MegaMenuTriggerDirective {
  private readonly parentItem = inject(MegaMenuItemComponent, { optional: true });
  private readonly menu = inject(MegaMenuComponent, { optional: true });
  readonly active = input<boolean>(false);
  readonly unstyled = input<boolean>(false);
  readonly class = input<string>('');
  readonly openClass = input<string>('');

  readonly isOpen = computed(() => {
    if (!this.parentItem) return false;
    if (this.menu?.mode() === 'shared') return this.menu._activeItem() === this.parentItem;
    return this.parentItem._open();
  });

  private get mode(): MegaMenuMode {
    return this.menu?.mode() ?? 'default';
  }

  onClick(event: Event): void {
    if (this.menu?.mode() === 'shared') {
      // Close the overlay so navigation proceeds with menu dismissed.
      this.menu._activeItem.set(null);
      return;
    }
    event.preventDefault();
    this.parentItem?.toggle();
  }

  protected readonly computedClass = computed(() => {
    const open = this.isOpen();
    const isTabs = this.mode === 'tabs';

    const base = this.unstyled()
      ? cn('inline-flex items-center gap-1 cursor-pointer', isTabs ? 'border border-transparent' : '', this.class())
      : cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isTabs ? 'border border-transparent' : '',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          this.active()
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          this.class(),
        );

    if (!open) return base;

    // Tabs mode: seamless connection with overlay
    if (isTabs) {
      return cn(
        base,
        'relative z-[51] rounded-b-none !border-border !border-b-transparent bg-popover',
        this.openClass(),
      );
    }

    // Default + shared mode: highlight the trigger
    return cn(base, 'bg-accent text-accent-foreground', this.openClass());
  });
}

// ── Template directive (shared mode) ──────────────────────────────────────────

/**
 * Shared-mode content provider. Wrap the menu's content in:
 *   <ng-template uiMegaMenuTemplate>...content...</ng-template>
 * The template is registered with the parent <ui-mega-menu-item> and rendered
 * inside the shared overlay owned by the root <ui-mega-menu>.
 */
@Directive({
  selector: '[uiMegaMenuTemplate]',
  standalone: true,
})
export class MegaMenuTemplateDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly parentItem = inject(MegaMenuItemComponent, { optional: true });

  constructor() {
    this.parentItem?._setContentTemplate(this.tpl);
  }
}

// ── Content panel (legacy / non-shared modes) ─────────────────────────────────

@Component({
  selector: 'ui-mega-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"menu"',
    '[style.display]': 'shouldShow() ? null : "none"',
    '(click)': 'onContentClick($event)',
  },
  template: `<ng-content />`,
})
export class MegaMenuContentComponent {
  readonly parentItem = inject(MegaMenuItemComponent, { optional: true });
  readonly columns = input<number>(3);
  readonly class = input<string>('');

  private clickOutsideListener: ((e: Event) => void) | null = null;

  protected shouldShow(): boolean {
    return this.parentItem?._open() ?? false;
  }

  protected readonly computedClass = computed(() => {
    const isTabs = this.parentItem?._mode === 'tabs';
    return cn(
      'absolute left-0 top-full z-50 border border-border bg-popover p-4 shadow-lg shadow-black/8',
      isTabs ? '-mt-px rounded-xl rounded-tl-none' : 'mt-1 rounded-xl',
      'min-w-[600px]',
      `grid grid-cols-${this.columns()}`,
      'gap-6',
      this.class(),
    );
  });

  constructor() {
    const DOCUMENT = typeof document !== 'undefined' ? document : null;
    if (DOCUMENT) {
      this.clickOutsideListener = (e: Event) => {
        const target = e.target as HTMLElement;
        if (this.parentItem?._open() && !target.closest('ui-mega-menu-item')) {
          this.parentItem.close();
        }
      };
      DOCUMENT.addEventListener('click', this.clickOutsideListener, true);
    }
  }

  /** Close menu when a link inside is clicked */
  onContentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[href], a[uiMegaMenuLink]')) {
      this.parentItem?.close();
    }
  }
}

// ── Section ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-mega-menu-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex flex-col gap-1"' },
  template: `<ng-content />`,
})
export class MegaMenuSectionComponent {}

// ── Section title ─────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-mega-menu-section-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"' },
  template: `<ng-content />`,
})
export class MegaMenuSectionTitleComponent {}

// ── Link item ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'a[uiMegaMenuLink], button[uiMegaMenuLink]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <ng-content select="[icon]" />
    <div class="flex flex-col min-w-0">
      <span class="text-sm font-medium text-foreground"><ng-content /></span>
      <span class="text-xs text-muted-foreground truncate"><ng-content select="[description]" /></span>
    </div>
  `,
})
export class MegaMenuLinkComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center gap-1.5 rounded px-2 py-0.5 text-sm',
      'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.class(),
    ),
  );
}
