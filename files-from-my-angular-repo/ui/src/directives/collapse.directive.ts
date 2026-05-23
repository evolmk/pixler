import {
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';

/**
 * `[uiCollapse]` — Smooth height + opacity collapse via CSS transitions.
 *
 * Prefer `<ui-collapsible>` for compound expand/collapse patterns.
 * Use this directive for single-element show/hide without a trigger component.
 *
 * Usage:
 * ```html
 * <div [uiCollapse]="isOpen">Content here…</div>
 * ```
 */
@Directive({
  selector: '[uiCollapse]',
  standalone: true,
  host: {
    style: 'overflow: hidden; transition: max-height 250ms ease, opacity 200ms ease;',
  },
})
export class CollapseDirective implements OnChanges {
  /** When `false` the element collapses. */
  readonly uiCollapse = input.required<boolean>();

  private readonly _el = inject(ElementRef<HTMLElement>);

  ngOnChanges(changes: SimpleChanges): void {
    if ('uiCollapse' in changes) {
      this._apply(this.uiCollapse());
    }
  }

  private _apply(open: boolean): void {
    const el = this._el.nativeElement;
    if (open) {
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.opacity = '1';
    } else {
      el.style.maxHeight = '0';
      el.style.opacity = '0';
    }
  }
}
