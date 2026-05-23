import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  InjectionToken,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit } from '../../utils/motion';

export const TOOLTIP_TOKEN = new InjectionToken<TooltipComponent>('TOOLTIP_TOKEN');

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type TooltipTriggerType = 'hover' | 'click';
type TooltipVariant = 'primary' | 'secondary' | 'accent' | 'sidebar' | 'destructive';

/** Named delay presets shared by `<ui-tooltip>` and `[uiTooltip]`. */
export type TooltipDelayPreset = 'instant' | 'fast' | 'normal' | 'slow';

const TOOLTIP_DELAY_PRESET: Record<TooltipDelayPreset, number> = {
  instant: 0,
  fast: 100,
  normal: 300,
  slow: 700,
};

/** Convert a delay (number ms or preset name) to milliseconds. */
export function resolveTooltipDelay(value: number | TooltipDelayPreset): number {
  return typeof value === 'string' ? TOOLTIP_DELAY_PRESET[value] : value;
}

const VARIANT_CLASS: Record<TooltipVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  sidebar: 'bg-sidebar-primary text-sidebar-primary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

const ARROW_VARIANT_CLASS: Record<TooltipVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  sidebar: 'bg-sidebar-primary',
  destructive: 'bg-destructive',
};

const PLACEMENT_CLASS: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/** Transform classes for fixed positioning (top/left set via inline style). */
const FIXED_TRANSFORM_CLASS: Record<TooltipPlacement, string> = {
  top: '-translate-x-1/2 -translate-y-full',
  bottom: '-translate-x-1/2',
  left: '-translate-x-full -translate-y-1/2',
  right: '-translate-y-1/2',
};

@Component({
  selector: 'ui-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: TOOLTIP_TOKEN, useExisting: forwardRef(() => TooltipComponent) }],
  host: {
    '[class]': 'hostClass()',
    '(mouseenter)': '_onMouseEnter()',
    '(mouseleave)': '_onMouseLeave()',
    '(focusin)': '_onFocusIn()',
    '(focusout)': '_onFocusOut()',
    '(click)': '_onClick()',
  },
  template: `<ng-content />`,
})
export class TooltipComponent {
  readonly trigger = input<TooltipTriggerType>('hover');
  readonly delay = input<number | TooltipDelayPreset>('fast');
  readonly class = input<string>('');
  readonly isOpen = signal(false);
  protected readonly hostClass = computed(() => cn('relative inline-block', this.class()));
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;
  private _showTimer: ReturnType<typeof setTimeout> | null = null;

  _show(): void {
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
    if (this.isOpen() || this._showTimer) return;
    const ms = resolveTooltipDelay(this.delay());
    if (ms <= 0) {
      this.isOpen.set(true);
      return;
    }
    this._showTimer = setTimeout(() => {
      this._showTimer = null;
      this.isOpen.set(true);
    }, ms);
  }

  _scheduleHide(): void {
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
    this._hideTimer = setTimeout(() => this.isOpen.set(false), 50);
  }

  _onMouseEnter(): void {
    if (this.trigger() === 'hover') this._show();
  }

  _onMouseLeave(): void {
    if (this.trigger() === 'hover') this._scheduleHide();
  }

  _onFocusIn(): void {
    if (this.trigger() === 'hover') this._show();
  }

  _onFocusOut(): void {
    if (this.trigger() === 'hover') this._scheduleHide();
  }

  _onClick(): void {
    if (this.trigger() === 'click') this.isOpen.update((v) => !v);
  }
}

/** Marks the trigger element inside a ui-tooltip. */
@Directive({
  selector: '[uiTooltipTrigger]',
  standalone: true,
})
export class TooltipTriggerDirective {}

const ARROW_CLASS: Record<TooltipPlacement, string> = {
  top: 'left-1/2 -translate-x-1/2 -bottom-1 rotate-45',
  bottom: 'left-1/2 -translate-x-1/2 -top-1 rotate-45',
  left: 'top-1/2 -translate-y-1/2 -right-1 rotate-45',
  right: 'top-1/2 -translate-y-1/2 -left-1 rotate-45',
};

@Component({
  selector: 'ui-tooltip-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'contents' },
  template: `
    @if (_visible()) {
      <div #panel [class]="computedClass()" [style]="_fixedStyle()" role="tooltip">
        <ng-content />
        @if (arrow()) {
          <div [class]="arrowClass()"></div>
        }
      </div>
    }
  `,
})
export class TooltipContentComponent {
  readonly placement = input<TooltipPlacement>('top');
  readonly arrow = input<boolean>(true);
  readonly variant = input<TooltipVariant>('primary');
  /** Use fixed positioning to escape overflow-hidden containers (e.g. sidebar). */
  readonly fixed = input<boolean>(false);
  readonly radius = input<string>('rounded');
  readonly padding = input<string>('px-3 py-1.5');
  readonly class = input<string>('');
  protected readonly _tooltip = inject(TOOLTIP_TOKEN);
  protected readonly _visible = signal(false);
  protected readonly _fixedStyle = signal<Record<string, string>>({});
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly _elRef = inject(ElementRef<HTMLElement>);
  private _closing = false;

  constructor() {
    effect(() => {
      const open = this._tooltip.isOpen();
      if (open) {
        this._closing = false;
        this._visible.set(true);
        queueMicrotask(() => {
          const el = this._panelRef()?.nativeElement;
          if (el) {
            if (this.fixed()) this._updateFixedPosition(el);
            overlayEnter(el, 'fade');
          }
        });
      } else if (this._visible()) {
        this._animatedClose();
      }
    });
  }

  /** Calculate fixed position based on the tooltip host's bounding rect. */
  private _updateFixedPosition(_panel: HTMLElement): void {
    const host = this._elRef.nativeElement.closest('ui-tooltip');
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const placement = this.placement();
    const gap = 8;

    let top: string;
    let left: string;

    switch (placement) {
      case 'right':
        top = `${rect.top + rect.height / 2}px`;
        left = `${rect.right + gap}px`;
        break;
      case 'left':
        top = `${rect.top + rect.height / 2}px`;
        left = `${rect.left - gap}px`;
        break;
      case 'bottom':
        top = `${rect.bottom + gap}px`;
        left = `${rect.left + rect.width / 2}px`;
        break;
      default: // top
        top = `${rect.top - gap}px`;
        left = `${rect.left + rect.width / 2}px`;
        break;
    }

    this._fixedStyle.set({ top, left });
  }

  private _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    // Fixed tooltips (e.g. collapsed sidebar nav) close instantly — prevents
    // ghosting when moving quickly between items during animated exit.
    if (this.fixed()) {
      this._visible.set(false);
      this._tooltip.isOpen.set(false);
      return;
    }
    const el = this._panelRef()?.nativeElement;
    if (el) {
      void overlayExit(el, 'fade').then(() => {
        this._visible.set(false);
        this._tooltip.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._tooltip.isOpen.set(false);
    }
  }

  protected readonly computedClass = computed(() => {
    const isFixed = this.fixed();
    const pos = isFixed ? 'fixed' : 'absolute';
    const placementCls = isFixed ? FIXED_TRANSFORM_CLASS[this.placement()] : PLACEMENT_CLASS[this.placement()];
    return cn(
      `${pos} z-50 ${this.radius()} ${this.padding()} text-xs whitespace-nowrap`,
      VARIANT_CLASS[this.variant()],
      placementCls,
      this.class(),
    );
  });

  protected readonly arrowClass = computed(() =>
    cn('absolute size-2', ARROW_VARIANT_CLASS[this.variant()], ARROW_CLASS[this.placement()]),
  );
}
