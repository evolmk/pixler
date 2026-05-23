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

export const HOVER_CARD_TOKEN = new InjectionToken<HoverCardComponent>('HOVER_CARD_TOKEN');

export type HoverCardPlacement = 'top' | 'bottom' | 'auto';
type ResolvedH = 'left' | 'right';

@Component({
  selector: 'ui-hover-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: HOVER_CARD_TOKEN, useExisting: forwardRef(() => HoverCardComponent) }],
  host: {
    '[class]': 'computedClass()',
    '(mouseenter)': '_scheduleOpen()',
    '(mouseleave)': '_scheduleClose()',
  },
  template: `<ng-content />`,
})
export class HoverCardComponent {
  readonly class = input<string>('');
  readonly isOpen = signal(false);
  readonly elRef = inject(ElementRef);

  protected readonly computedClass = computed(() => cn('relative inline-block', this.class()));
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;

  _scheduleOpen(): void {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this._openTimer = setTimeout(() => this.isOpen.set(true), 200);
  }

  _scheduleClose(): void {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    this._closeTimer = setTimeout(() => this.isOpen.set(false), 100);
  }
}

/** Marks the trigger element inside a ui-hover-card. The parent handles hover events. */
@Directive({
  selector: '[uiHoverCardTrigger]',
  standalone: true,
})
export class HoverCardTriggerDirective {}

@Component({
  selector: 'ui-hover-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_visible()) {
      <div #panel [class]="computedClass()" [style]="_positionStyle()">
        <ng-content />
      </div>
    }
  `,
})
export class HoverCardContentComponent {
  readonly class = input<string>('');
  readonly placement = input<HoverCardPlacement>('bottom');
  protected readonly _hoverCard = inject(HOVER_CARD_TOKEN);
  protected readonly _visible = signal(false);
  protected readonly _resolvedPlacement = signal<'top' | 'bottom'>('bottom');
  protected readonly _resolvedH = signal<ResolvedH>('left');
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private _closing = false;

  constructor() {
    effect(() => {
      const open = this._hoverCard.isOpen();
      if (open) {
        this._closing = false;
        this._resolvePlacement();
        this._visible.set(true);
        queueMicrotask(() => {
          const el = this._panelRef()?.nativeElement;
          if (el) overlayEnter(el, 'fade');
        });
      } else if (this._visible()) {
        this._animatedClose();
      }
    });
  }

  private _resolvePlacement(): void {
    const pref = this.placement();
    const trigger = this._hoverCard.elRef.nativeElement as HTMLElement;
    const rect = trigger.getBoundingClientRect();

    if (pref !== 'auto') {
      this._resolvedPlacement.set(pref);
    } else {
      this._resolvedPlacement.set(rect.top > window.innerHeight / 2 ? 'top' : 'bottom');
    }

    // Horizontal: if trigger is in the right half, align to right edge
    this._resolvedH.set(rect.left > window.innerWidth / 2 ? 'right' : 'left');
  }

  protected readonly _positionStyle = computed(() => {
    const p = this._resolvedPlacement();
    const h = this._resolvedH();
    const vertical =
      p === 'top'
        ? { bottom: '100%', top: 'auto', marginBottom: '0.5rem' }
        : { top: '100%', bottom: 'auto', marginTop: '0.5rem' };
    const horizontal = h === 'right' ? { right: '0', left: 'auto' } : { left: '0', right: 'auto' };
    return { ...vertical, ...horizontal };
  });

  private _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    const el = this._panelRef()?.nativeElement;
    if (el) {
      void overlayExit(el, 'fade').then(() => {
        this._visible.set(false);
        this._hoverCard.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._hoverCard.isOpen.set(false);
    }
  }

  protected readonly computedClass = computed(() =>
    cn(
      'absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      this.class(),
    ),
  );
}
