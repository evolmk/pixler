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
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit, type MotionPreset } from '../../utils/motion';
import { gsap } from 'gsap';

export const DRAWER_TOKEN = new InjectionToken<DrawerComponent>('DRAWER_TOKEN');

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DRAWER_TOKEN, useExisting: forwardRef(() => DrawerComponent) }],
  template: `<ng-content />`,
})
export class DrawerComponent {
  readonly isOpen = signal(false);
  open(): void {
    this.isOpen.set(true);
  }
  close(): void {
    this.isOpen.set(false);
  }
  toggle(): void {
    this.isOpen.update((v) => !v);
  }
}

// ── Trigger ───────────────────────────────────────────────────────────────────

@Directive({
  selector: '[uiDrawerTrigger]',
  standalone: true,
  host: { '(click)': '_drawer.open()' },
})
export class DrawerTriggerDirective {
  protected readonly _drawer = inject(DRAWER_TOKEN);
}

// ── Close ─────────────────────────────────────────────────────────────────────

@Directive({
  selector: '[uiDrawerClose]',
  standalone: true,
  host: { '(click)': '_drawer.close()' },
})
export class DrawerCloseDirective {
  protected readonly _drawer = inject(DRAWER_TOKEN);
}

// ── Content ───────────────────────────────────────────────────────────────────

type DrawerSide = 'top' | 'right' | 'bottom' | 'left';
type DrawerSize = 'sm' | 'default' | 'lg' | 'full';

const SIDE_BASE: Record<DrawerSide, string> = {
  top: 'inset-x-0 top-0 border-b',
  right: 'inset-y-0 right-0 h-full border-l',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full border-r',
};

const SIDE_SIZE: Record<DrawerSide, Record<DrawerSize, string>> = {
  top: { sm: 'max-h-48', default: 'max-h-80', lg: 'max-h-[60vh]', full: 'h-full' },
  right: { sm: 'w-64', default: 'w-3/4 sm:max-w-sm', lg: 'w-3/4 sm:max-w-lg', full: 'w-full' },
  bottom: { sm: 'max-h-48', default: 'max-h-80', lg: 'max-h-[60vh]', full: 'h-full' },
  left: { sm: 'w-64', default: 'w-3/4 sm:max-w-sm', lg: 'w-3/4 sm:max-w-lg', full: 'w-full' },
};

const SIDE_PRESET: Record<DrawerSide, MotionPreset> = {
  top: 'slide-top',
  right: 'slide-right',
  bottom: 'slide-bottom',
  left: 'slide-left',
};

@Component({
  selector: 'ui-drawer-content',
  standalone: true,
  imports: [CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_visible()) {
      @if (!hideBackdrop()) {
        <div #backdrop class="fixed inset-0 z-[1050] bg-black/80" (click)="_animatedClose()"></div>
      }
      <div
        #panel
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [class]="computedClass()"
        role="dialog"
        aria-modal="true"
        (keydown.escape)="_animatedClose()"
      >
        <ng-content />
        @if (showClose()) {
          <button
            type="button"
            class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground transition-colors hover:bg-muted-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            [attr.aria-label]="'Close'"
            (click)="_animatedClose()"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        }
      </div>
    }
  `,
})
export class DrawerContentComponent {
  readonly side = input<DrawerSide>('right');
  readonly size = input<DrawerSize>('default');
  readonly showClose = input<boolean>(true);
  readonly hideBackdrop = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly _drawer = inject(DRAWER_TOKEN);
  protected readonly _visible = signal(false);
  private readonly _backdropRef = viewChild<ElementRef<HTMLElement>>('backdrop');
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private _closing = false;

  constructor() {
    effect(() => {
      const open = this._drawer.isOpen();
      if (open) {
        this._closing = false;
        this._visible.set(true);
        queueMicrotask(() => {
          const backdrop = this._backdropRef()?.nativeElement;
          const panel = this._panelRef()?.nativeElement;
          if (backdrop) gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
          if (panel) {
            overlayEnter(panel, SIDE_PRESET[this.side()]);
            // Clear GSAP's inline transform after animation completes.
            // A residual `transform: translate(0,0) scale(1)` creates an
            // unnecessary stacking context that can interfere with pointer-event
            // hit-testing on position:fixed panels.
            setTimeout(() => {
              if (this._visible() && !this._closing) {
                panel.style.transform = '';
                panel.style.opacity = '';
              }
            }, 350);
          }
        });
      } else if (this._visible()) {
        this._animatedClose();
      }
    });
  }

  protected _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    const backdrop = this._backdropRef()?.nativeElement;
    const panel = this._panelRef()?.nativeElement;
    if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.15, ease: 'power2.in' });
    if (panel) {
      void overlayExit(panel, SIDE_PRESET[this.side()]).then(() => {
        this._visible.set(false);
        this._drawer.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._drawer.isOpen.set(false);
    }
  }

  protected readonly computedClass = computed(() =>
    cn(
      'fixed z-[1051] gap-4 bg-background p-6 shadow-lg',
      SIDE_BASE[this.side()],
      SIDE_SIZE[this.side()][this.size()],
      this.class(),
    ),
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-drawer-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DrawerHeaderComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex flex-col space-y-2 text-center sm:text-left', this.class()),
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-drawer-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DrawerFooterComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', this.class()),
  );
}

// ── Title ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-drawer-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DrawerTitleComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block text-lg font-semibold text-foreground', this.class()));
}

// ── Description ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-drawer-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DrawerDescriptionComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block text-sm text-muted-foreground', this.class()));
}
