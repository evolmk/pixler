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

export const POPOVER_TOKEN = new InjectionToken<PopoverComponent>('POPOVER_TOKEN');

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
type PopoverTriggerType = 'click' | 'hover';

const PLACEMENT_CLASS: Record<PopoverPlacement, string> = {
  top: 'bottom-full left-0 mb-2',
  bottom: 'top-full left-0 mt-2',
  left: 'right-full top-0 mr-2',
  right: 'left-full top-0 ml-2',
};

@Component({
  selector: 'ui-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: POPOVER_TOKEN, useExisting: forwardRef(() => PopoverComponent) }],
  host: {
    '[class]': '"relative inline-block"',
    '(mouseenter)': '_onMouseEnter()',
    '(mouseleave)': '_onMouseLeave()',
  },
  template: `<ng-content />`,
})
export class PopoverComponent {
  readonly trigger = input<PopoverTriggerType>('click');
  readonly isOpen = signal(false);
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;

  open(): void {
    this.isOpen.set(true);
  }
  close(): void {
    this.isOpen.set(false);
  }
  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  _onMouseEnter(): void {
    if (this.trigger() === 'hover') {
      if (this._hideTimer) {
        clearTimeout(this._hideTimer);
        this._hideTimer = null;
      }
      this.isOpen.set(true);
    }
  }

  _onMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this._hideTimer = setTimeout(() => this.isOpen.set(false), 150);
    }
  }
}

@Directive({
  selector: '[uiPopoverTrigger]',
  standalone: true,
  host: { '(click)': '_onClick()' },
})
export class PopoverTriggerDirective {
  protected readonly _popover = inject(POPOVER_TOKEN);

  _onClick(): void {
    if (this._popover.trigger() === 'click') this._popover.toggle();
  }
}

@Component({
  selector: 'ui-popover-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_visible()) {
      <div class="fixed inset-0 z-40" (click)="_animatedClose()"></div>
      <div #panel [class]="computedClass()" (click)="$event.stopPropagation()" (keydown.escape)="_animatedClose()">
        <ng-content />
      </div>
    }
  `,
})
export class PopoverContentComponent {
  readonly placement = input<PopoverPlacement>('bottom');
  readonly class = input<string>('');
  protected readonly _popover = inject(POPOVER_TOKEN);
  protected readonly _visible = signal(false);
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private _closing = false;

  constructor() {
    effect(() => {
      const open = this._popover.isOpen();
      if (open) {
        this._closing = false;
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

  protected _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    const el = this._panelRef()?.nativeElement;
    if (el) {
      void overlayExit(el, 'fade').then(() => {
        this._visible.set(false);
        this._popover.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._popover.isOpen.set(false);
    }
  }

  protected readonly computedClass = computed(() =>
    cn(
      'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      PLACEMENT_CLASS[this.placement()],
      this.class(),
    ),
  );
}
