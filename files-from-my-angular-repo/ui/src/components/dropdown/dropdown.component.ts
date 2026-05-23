import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  InjectionToken,
  ViewChild,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedOverlayPositionChange,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import { ChevronsUpDown, type LucideIconData } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit, type MotionPreset } from '../../utils/motion';
import { IconComponent } from '../icon';

export const DROPDOWN_TOKEN = new InjectionToken<DropdownComponent>('DROPDOWN_TOKEN');

export interface DropdownItem {
  label: string;
  value: string;
  icon?: LucideIconData;
  /** When set, renders as an `<a>` link enabling right-click → open in new tab */
  href?: string;
}

const POSITIONS_BELOW: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

const POSITIONS_BELOW_END: ConnectedPosition[] = [
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

const POSITIONS_ABOVE: ConnectedPosition[] = [
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
];

type DropdownAlign = 'start' | 'end' | 'above';

const POSITION_MAP: Record<DropdownAlign, ConnectedPosition[]> = {
  start: POSITIONS_BELOW,
  end: POSITIONS_BELOW_END,
  above: POSITIONS_ABOVE,
};

// ── Root ────────────────────────────────────────────────────────────────────
// Two modes:
// 1. Items mode: [items] + [value] + (valueChange) — renders built-in item list with switcher trigger
// 2. Content projection mode: <div uiDropdownTrigger> + <div uiDropdownContent> — fully custom

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkConnectedOverlay, IconComponent],
  hostDirectives: [CdkOverlayOrigin],
  providers: [{ provide: DROPDOWN_TOKEN, useExisting: forwardRef(() => DropdownComponent) }],
  host: {
    '[class]': '"relative inline-block"',
    '(mouseenter)': '_onTriggerMouseEnter()',
    '(mouseleave)': '_onTriggerMouseLeave()',
  },
  template: `
    <!-- Items mode: built-in trigger -->
    @if (items().length) {
      <button type="button" (click)="toggle()" [class]="triggerClass()">
        {{ activeLabel() }}
        <ui-icon [name]="ChevronsUpDown" [size]="16" [strokeWidth]="2" class="text-muted-foreground" />
      </button>
    }

    <!-- Content projection mode: custom trigger -->
    <ng-content select="[uiDropdownTrigger]" />

    <!-- Dropdown panel -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="_origin"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="_computedPositions()"
      [cdkConnectedOverlayHasBackdrop]="!openOnHover()"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      (positionChange)="_onPositionChange($event)"
      (attach)="_onAttach()"
      (backdropClick)="_onBackdropClick($event)"
      (detach)="_onDetach()"
    >
      <div #panel (mouseenter)="_onPanelMouseEnter()" (mouseleave)="_onPanelMouseLeave()">
        <!-- Items mode: built-in panel -->
        @if (items().length) {
          <div [class]="panelClass()">
            @for (item of items(); track item.value) {
              @if (item.href) {
                <a
                  [href]="item.href"
                  (click)="onItemLinkClick($event, item.value)"
                  class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm transition-colors w-full text-left no-underline rounded-sm"
                  [class]="
                    value() === item.value
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-popover-foreground hover:bg-accent'
                  "
                >
                  @if (item.icon) {
                    <ui-icon
                      [name]="item.icon"
                      [size]="16"
                      [strokeWidth]="1.5"
                      class="shrink-0 text-muted-foreground"
                    />
                  }
                  {{ item.label }}
                </a>
              } @else {
                <button
                  type="button"
                  (click)="select(item.value)"
                  class="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm transition-colors w-full text-left rounded-sm"
                  [class]="
                    value() === item.value
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-popover-foreground hover:bg-accent'
                  "
                >
                  @if (item.icon) {
                    <ui-icon
                      [name]="item.icon"
                      [size]="16"
                      [strokeWidth]="1.5"
                      class="shrink-0 text-muted-foreground"
                    />
                  }
                  {{ item.label }}
                </button>
              }
            }
          </div>
        }

        <!-- Content projection mode: custom panel content -->
        <ng-content select="[uiDropdownContent]" />
      </div>
    </ng-template>
  `,
})
export class DropdownComponent {
  @ViewChild(CdkConnectedOverlay) private _overlay!: CdkConnectedOverlay;
  @ViewChild('panel') private _panelRef!: ElementRef<HTMLElement>;

  protected readonly ChevronsUpDown = ChevronsUpDown;
  protected readonly _origin = inject(CdkOverlayOrigin);

  // ── Shared inputs ───────────────────────────────────────────
  readonly align = input<DropdownAlign>('start');
  readonly class = input<string>('');

  // ── Items mode inputs ───────────────────────────────────────
  readonly items = input<DropdownItem[]>([]);
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  /**
   * Emits when the user clicks the trigger element while the overlay is
   * already open. Useful for "click again to navigate" patterns where the
   * second click should send the user to a full page (e.g. header
   * cart/wishlist/quote dropdowns).
   *
   * Note: when an overlay backdrop is in front of the trigger, the trigger
   * itself never receives a `(click)`. This event covers that case by
   * detecting backdrop clicks that land on the trigger's bounding rect.
   */
  readonly triggerClickWhileOpen = output<void>();

  /**
   * When true, the dropdown opens on hover (mouseenter on trigger area or
   * panel) and closes on mouseleave with a brief grace period so the cursor
   * can travel between the two. Backdrop is disabled in this mode so the
   * trigger button still receives its own click events. On touch devices
   * (no `(hover: hover)` capability) this is a no-op — the dropdown only
   * opens via click-toggle if `clickToToggle` is also true.
   */
  readonly openOnHover = input<boolean>(false);

  /**
   * Hover-intent delay (ms) before the dropdown opens after the cursor enters
   * the trigger. Only applies when `openOnHover` is true. Set to a small value
   * (e.g. 150–250ms) to avoid opening when the user is just passing by.
   * Defaults to 0 (open immediately) to preserve legacy behavior.
   */
  readonly openHoverDelay = input<number>(0);

  /**
   * Whether `[uiDropdownTrigger]` clicks toggle the dropdown. Default true
   * preserves legacy behavior. Set false when the parent wants the trigger
   * click to do something else (e.g. navigate to a page) without the
   * directive opening the panel.
   */
  readonly clickToToggle = input<boolean>(true);

  // ── State ───────────────────────────────────────────────────
  readonly isOpen = signal(false);
  private _closing = false;
  private _motionPreset: MotionPreset = 'slide-down';
  private _closeTimer: ReturnType<typeof setTimeout> | undefined;
  private _openTimer: ReturnType<typeof setTimeout> | undefined;
  private static readonly _CLOSE_GRACE_MS = 150;

  protected readonly _computedPositions = computed(() => POSITION_MAP[this.align()]);

  protected readonly activeLabel = computed(() => {
    const v = this.value();
    return this.items().find((i) => i.value === v)?.label ?? '';
  });

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex items-center gap-1.5 font-semibold text-foreground',
      'hover:bg-accent rounded-md pl-3 pr-2 py-1.5 transition-colors text-lg cursor-pointer',
      this.class(),
    ),
  );

  protected readonly panelClass = computed(() =>
    cn('w-48 rounded-lg border border-border bg-popover shadow-lg p-1 text-popover-foreground'),
  );

  toggle(): void {
    if (this.isOpen()) {
      void this.animatedClose();
    } else {
      this.isOpen.set(true);
    }
  }

  select(val: string): void {
    this.valueChange.emit(val);
    void this.animatedClose();
  }

  /** Handles link clicks — allows modifier keys for open-in-new-tab, otherwise uses SPA navigation */
  onItemLinkClick(event: MouseEvent, val: string): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) {
      // Let the browser handle it (new tab / new window)
      void this.animatedClose();
      return;
    }
    event.preventDefault();
    this.select(val);
  }

  async animatedClose(): Promise<void> {
    if (!this.isOpen() || this._closing) return;
    this._closing = true;
    const el = this._panelRef?.nativeElement;
    if (el) {
      await overlayExit(el, this._motionPreset);
    }
    this.isOpen.set(false);
    this._closing = false;
  }

  _onBackdropClick(event: MouseEvent): void {
    // If the click landed on the trigger element, treat it as a
    // "click while open" reactivation rather than a plain outside click.
    const triggerEl = this._origin.elementRef.nativeElement as HTMLElement;
    const rect = triggerEl.getBoundingClientRect();
    const inTrigger =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (inTrigger) {
      this.triggerClickWhileOpen.emit();
    }
    void this.animatedClose();
  }

  _onPositionChange(event: ConnectedOverlayPositionChange): void {
    this._motionPreset = event.connectionPair.overlayY === 'bottom' ? 'slide-up' : 'slide-down';
  }

  _onAttach(): void {
    // Delay to ensure ViewChild resolves after overlay template is stamped
    queueMicrotask(() => {
      const el = this._panelRef?.nativeElement;
      if (el) overlayEnter(el, this._motionPreset);
    });
  }

  _onDetach(): void {
    this._closing = false;
    this.isOpen.set(false);
  }

  // ── Hover mode ──────────────────────────────────────────────
  // Detects pointer hover capability so touch-only devices skip hover open.
  private _hasHoverCapability(): boolean {
    return typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  }

  _onTriggerMouseEnter(): void {
    if (!this.openOnHover() || !this._hasHoverCapability()) return;
    this._cancelScheduledClose();
    if (this.isOpen()) return;
    const delay = this.openHoverDelay();
    if (delay > 0) {
      this._cancelScheduledOpen();
      this._openTimer = setTimeout(() => {
        this._openTimer = undefined;
        this.isOpen.set(true);
      }, delay);
    } else {
      this.isOpen.set(true);
    }
  }

  _onTriggerMouseLeave(): void {
    if (!this.openOnHover() || !this._hasHoverCapability()) return;
    this._cancelScheduledOpen();
    this._scheduleClose();
  }

  _onPanelMouseEnter(): void {
    if (!this.openOnHover() || !this._hasHoverCapability()) return;
    this._cancelScheduledClose();
  }

  _onPanelMouseLeave(): void {
    if (!this.openOnHover() || !this._hasHoverCapability()) return;
    this._scheduleClose();
  }

  private _cancelScheduledClose(): void {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = undefined;
    }
  }

  private _cancelScheduledOpen(): void {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = undefined;
    }
  }

  private _scheduleClose(): void {
    this._cancelScheduledClose();
    this._closeTimer = setTimeout(() => {
      this._closeTimer = undefined;
      void this.animatedClose();
    }, DropdownComponent._CLOSE_GRACE_MS);
  }
}

// ── Trigger Directive ────────────────────────────────────────────────────────

@Directive({
  selector: '[uiDropdownTrigger]',
  standalone: true,
  host: {
    '(click)': '_handleClick()',
    '[class]': '"cursor-pointer"',
  },
})
export class DropdownTriggerDirective {
  readonly _dropdown = inject(DROPDOWN_TOKEN);

  _handleClick(): void {
    if (!this._dropdown.clickToToggle()) return;
    this._dropdown.toggle();
  }
}

// ── Content Directive ────────────────────────────────────────────────────────

@Directive({
  selector: '[uiDropdownContent]',
  standalone: true,
})
export class DropdownContentDirective {}

// ── Item ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-dropdown-item, [uiDropdownItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': '"0"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': '_handleClick()',
    '(keydown.enter)': '_handleClick()',
    '(keydown.space)': '_handleClick()',
  },
  template: `<ng-content />`,
})
export class DropdownItemComponent {
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly closeOnClick = input<boolean>(true);

  protected readonly _dropdown = inject(DROPDOWN_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors',
      'focus:bg-accent focus:text-accent-foreground',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      this.class(),
    ),
  );

  protected _handleClick(): void {
    if (this.disabled()) return;
    if (this.closeOnClick()) void this._dropdown.animatedClose();
  }
}

// ── Group ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-dropdown-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { role: 'group' },
  template: `<ng-content />`,
})
export class DropdownGroupComponent {}

// ── Label ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-dropdown-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DropdownLabelComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block px-2 py-1.5 text-sm font-semibold', this.class()));
}

// ── Separator ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-dropdown-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': '"horizontal"',
  },
  template: ``,
})
export class DropdownSeparatorComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block -mx-1 my-1 h-px bg-muted', this.class()));
}

// ── Shortcut ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-dropdown-shortcut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DropdownShortcutComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('ml-auto text-xs tracking-widest opacity-60', this.class()));
}
