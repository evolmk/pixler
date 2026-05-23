import { CdkTrapFocus } from '@angular/cdk/a11y';
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
  output,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit } from '../../utils/motion';
import { gsap } from 'gsap';

export const DIALOG_TOKEN = new InjectionToken<DialogComponent>('DIALOG_TOKEN');

/** Size presets for dialogs (template-based and programmatic). */
export type DialogSize = 'xxs' | 'xs' | 'sm' | 'md' | 'default' | 'lg' | 'xl' | 'xxl' | 'full';

/** Maps size → max-width class for the panel. */
const SIZE_WIDTH: Record<DialogSize, string> = {
  xxs: 'max-w-2xs',
  xs: 'max-w-xs',
  sm: 'max-w-md',
  md: 'max-w-lg',
  default: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  xxl: 'max-w-5xl',
  full: 'w-screen h-screen max-w-none max-h-none rounded-none',
};

/** Maps size → padding tier (compact / standard / spacious). */
type PaddingSlot = 'header' | 'body' | 'footer' | 'close';
const SIZE_PADDING: Record<DialogSize, Record<PaddingSlot, string>> = {
  xxs: { header: 'px-4 pt-4', body: 'px-4 py-2', footer: 'px-4 pb-4', close: 'right-3 top-3' },
  xs: { header: 'px-4 pt-4', body: 'px-4 py-2', footer: 'px-4 pb-4', close: 'right-3 top-3' },
  sm: { header: 'px-5 pt-5', body: 'px-5 py-3', footer: 'px-5 pb-5', close: 'right-4 top-4' },
  md: { header: 'px-5 pt-5', body: 'px-5 py-3', footer: 'px-5 pb-5', close: 'right-4 top-4' },
  default: { header: 'px-6 pt-6', body: 'px-6 py-4', footer: 'px-6 pb-6', close: 'right-5 top-5' },
  lg: { header: 'px-6 pt-6', body: 'px-6 py-4', footer: 'px-6 pb-6', close: 'right-5 top-5' },
  xl: { header: 'px-8 pt-7', body: 'px-8 py-5', footer: 'px-8 pb-7', close: 'right-6 top-6' },
  xxl: { header: 'px-8 pt-7', body: 'px-8 py-5', footer: 'px-8 pb-7', close: 'right-6 top-6' },
  full: { header: 'px-8 pt-7', body: 'px-8 py-5', footer: 'px-8 pb-7', close: 'right-6 top-6' },
};

@Component({
  selector: 'ui-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DIALOG_TOKEN, useExisting: forwardRef(() => DialogComponent) }],
  template: `<ng-content />`,
})
export class DialogComponent {
  readonly size = input<DialogSize>('default');
  readonly isOpen = signal(false);
  open(): void {
    this.isOpen.set(true);
  }
  close(): void {
    this.isOpen.set(false);
  }
}

@Directive({
  selector: '[uiDialogTrigger]',
  standalone: true,
  host: { '(click)': '_dialog.open()' },
})
export class DialogTriggerDirective {
  protected readonly _dialog = inject(DIALOG_TOKEN);
}

export type DialogMode = 'dialog' | 'alert';

@Component({
  selector: 'ui-dialog-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkTrapFocus],
  template: `
    @if (_visible()) {
      <div #backdrop class="fixed inset-0 z-50 bg-black/80" (click)="_onBackdropClick()"></div>
      <div
        #panel
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="false"
        [class]="_panelClass()"
        [attr.role]="mode() === 'alert' ? 'alertdialog' : 'dialog'"
        aria-modal="true"
        (click)="$event.stopPropagation()"
        (keydown.escape)="_onEscape()"
      >
        <ng-content />
        @if (mode() === 'dialog') {
          <button type="button" [class]="_closeClass()" (click)="_animatedClose()" aria-label="Close">
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        }
      </div>
    }
  `,
})
export class DialogContentComponent {
  /** Dialog mode: 'dialog' (default) shows close X + backdrop dismiss, 'alert' hides both */
  readonly mode = input<DialogMode>('dialog');

  protected readonly _dialog = inject(DIALOG_TOKEN);
  protected readonly _visible = signal(false);
  private readonly _backdropRef = viewChild<ElementRef<HTMLElement>>('backdrop');
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private _closing = false;

  protected readonly _panelClass = computed(() =>
    cn(
      'fixed left-[50%] top-[50%] z-50 flex flex-col w-[calc(100%-1rem)] max-h-[calc(100dvh-2rem)] translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg rounded-lg overflow-hidden',
      SIZE_WIDTH[this._dialog.size()],
    ),
  );

  protected readonly _closeClass = computed(() =>
    cn(
      'absolute rounded-md p-1 opacity-70 transition-[opacity,background-color] hover:opacity-100 hover:bg-muted focus:outline-none',
      SIZE_PADDING[this._dialog.size()].close,
    ),
  );

  constructor() {
    effect(() => {
      const open = this._dialog.isOpen();
      if (open) {
        this._closing = false;
        this._visible.set(true);
        queueMicrotask(() => {
          const backdrop = this._backdropRef()?.nativeElement;
          const panel = this._panelRef()?.nativeElement;
          if (backdrop) gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
          if (panel) overlayEnter(panel, 'dialog');
        });
      } else if (this._visible()) {
        this._animatedClose();
      }
    });
  }

  protected _onBackdropClick(): void {
    if (this.mode() === 'dialog') this._animatedClose();
  }

  protected _onEscape(): void {
    if (this.mode() === 'dialog') this._animatedClose();
  }

  protected _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    const backdrop = this._backdropRef()?.nativeElement;
    const panel = this._panelRef()?.nativeElement;
    if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.15, ease: 'power2.in' });
    if (panel) {
      void overlayExit(panel, 'dialog').then(() => {
        this._visible.set(false);
        this._dialog.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._dialog.isOpen.set(false);
    }
  }
}

@Component({
  selector: 'ui-dialog-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DialogHeaderComponent {
  readonly class = input<string>('');
  private readonly _dialog = inject(DIALOG_TOKEN);
  protected readonly computedClass = computed(() =>
    cn('flex flex-col space-y-1.5 text-left', SIZE_PADDING[this._dialog.size()].header, this.class()),
  );
}

@Component({
  selector: 'ui-dialog-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DialogFooterComponent {
  readonly class = input<string>('');
  private readonly _dialog = inject(DIALOG_TOKEN);
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col-reverse gap-4 sm:flex-row sm:justify-end',
      SIZE_PADDING[this._dialog.size()].footer,
      this.class(),
    ),
  );
}

@Component({
  selector: 'ui-dialog-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DialogTitleComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-lg font-semibold leading-none tracking-tight', this.class()),
  );
}

@Component({
  selector: 'ui-dialog-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DialogDescriptionComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

@Component({
  selector: 'ui-dialog-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class DialogBodyComponent {
  readonly class = input<string>('');
  private readonly _dialog = inject(DIALOG_TOKEN);
  protected readonly computedClass = computed(() =>
    cn('block flex-1 overflow-y-auto', SIZE_PADDING[this._dialog.size()].body, this.class()),
  );
}

@Directive({
  selector: '[uiDialogClose]',
  standalone: true,
  host: { '(click)': '_dialog.close()' },
})
export class DialogCloseDirective {
  protected readonly _dialog = inject(DIALOG_TOKEN);
}

/** Closes the dialog and emits the `confirm` event. Apply to the primary action button. */
@Directive({
  selector: '[uiDialogAction]',
  standalone: true,
  host: { '(click)': '_onAction()' },
})
export class DialogActionDirective {
  readonly confirm = output<void>();
  protected readonly _dialog = inject(DIALOG_TOKEN);

  protected _onAction(): void {
    this.confirm.emit();
    this._dialog.close();
  }
}

/** Closes the dialog without action. Apply to the cancel button. */
@Directive({
  selector: '[uiDialogCancel]',
  standalone: true,
  host: { '(click)': '_dialog.close()' },
})
export class DialogCancelDirective {
  protected readonly _dialog = inject(DIALOG_TOKEN);
}
