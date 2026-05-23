import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { SpinnerComponent, type SpinnerSize } from '../components/spinner/spinner.component';

/**
 * `[uiBusy]` — Overlay a small spinner on any element while a task runs.
 *
 * When `[uiBusy]` is truthy:
 * - The host element gets `aria-busy="true"`.
 * - Pointer events on its children are blocked.
 * - Children dim to ~50% opacity.
 * - A centered `<ui-spinner>` is rendered on top.
 *
 * Usage:
 * ```html
 * <div [uiBusy]="isUpdating()">
 *   <ui-input-number [(value)]="qty" />
 * </div>
 * ```
 *
 * Notes:
 * - Adds `position: relative` to the host if it isn't already positioned.
 * - Use `[uiBusySize]` to control the spinner size: `'sm' | 'default' | 'lg'`.
 */
@Directive({
  selector: '[uiBusy]',
  standalone: true,
  host: {
    '[attr.aria-busy]': 'uiBusy() ? "true" : null',
    '[class.ui-busy]': 'uiBusy()',
  },
})
export class BusyDirective {
  readonly uiBusy = input<boolean>(false);
  readonly uiBusySize = input<SpinnerSize>('sm');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly vcr = inject(ViewContainerRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private overlay: HTMLElement | null = null;
  private spinnerRef: ComponentRef<SpinnerComponent> | null = null;
  private styleInstalled = false;

  constructor() {
    effect(() => {
      const busy = this.uiBusy();
      if (busy) this.show();
      else this.hide();
    });
  }

  private show(): void {
    if (this.overlay) return;
    this.installStyles();

    const el = this.host.nativeElement;
    // Ensure positioning context for absolute overlay.
    const computed = getComputedStyle(el);
    if (computed.position === 'static') {
      this.renderer.setStyle(el, 'position', 'relative');
    }
    el.classList.add('ui-busy-host');

    const overlay = this.renderer.createElement('span') as HTMLElement;
    overlay.className = 'ui-busy-overlay';
    this.renderer.appendChild(el, overlay);
    this.overlay = overlay;

    const spinner = this.vcr.createComponent(SpinnerComponent);
    spinner.setInput('size', this.uiBusySize());
    spinner.setInput('class', 'text-brand');
    this.renderer.appendChild(overlay, spinner.location.nativeElement);
    this.spinnerRef = spinner;
    this.cdr.markForCheck();
  }

  private hide(): void {
    if (this.spinnerRef) {
      this.spinnerRef.destroy();
      this.spinnerRef = null;
    }
    if (this.overlay) {
      this.renderer.removeChild(this.host.nativeElement, this.overlay);
      this.overlay = null;
    }
    this.host.nativeElement.classList.remove('ui-busy-host');
  }

  private installStyles(): void {
    if (this.styleInstalled || typeof document === 'undefined') return;
    if (document.getElementById('ui-busy-styles')) {
      this.styleInstalled = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'ui-busy-styles';
    style.textContent = `
      .ui-busy-host > *:not(.ui-busy-overlay) {
        opacity: 0.5;
        transition: opacity 120ms ease;
        pointer-events: none;
      }
      .ui-busy-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 5;
      }
    `;
    document.head.appendChild(style);
    this.styleInstalled = true;
  }
}
