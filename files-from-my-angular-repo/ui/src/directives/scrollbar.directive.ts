import {
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';

export type ScrollbarSize = 'thin' | 'default' | 'hidden';

/**
 * `[uiScrollbar]` — Applies custom scrollbar styling via inline styles.
 *
 * Prefer `<ui-scroll-area>` for full-featured scroll containers.
 * Use this directive for quick scrollbar theming on existing elements.
 *
 * Usage:
 * ```html
 * <div [uiScrollbar]="'thin'" class="overflow-auto h-64">…</div>
 * ```
 */
@Directive({
  selector: '[uiScrollbar]',
  standalone: true,
})
export class ScrollbarDirective implements OnChanges {
  readonly uiScrollbar = input<ScrollbarSize>('default');

  private readonly _el = inject(ElementRef<HTMLElement>);

  ngOnChanges(changes: SimpleChanges): void {
    if ('uiScrollbar' in changes) {
      this._apply(this.uiScrollbar());
    }
  }

  private _apply(size: ScrollbarSize): void {
    const el = this._el.nativeElement;
    const base = 'scrollbar-color: var(--color-border) transparent;';

    switch (size) {
      case 'hidden':
        el.style.cssText += 'scrollbar-width: none;';
        el.style.setProperty('&::-webkit-scrollbar', 'display:none');
        break;
      case 'thin':
        el.style.cssText += `scrollbar-width: thin; ${base}`;
        break;
      default:
        el.style.cssText += `scrollbar-width: auto; ${base}`;
        break;
    }
  }
}
