import {
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

/**
 * `[uiScrollspy]` — Tracks which section is currently in the viewport as the user
 * scrolls.  Emits the `id` of the active section via `activeSection`.
 *
 * Usage:
 * ```html
 * <div [uiScrollspy]="['#about', '#work', '#contact']" (activeSection)="active = $event">
 * ```
 */
@Directive({
  selector: '[uiScrollspy]',
  standalone: true,
})
export class ScrollspyDirective implements OnInit {
  /** List of CSS selectors (e.g. '#section-1', '.section') to observe. */
  readonly uiScrollspy = input.required<string[]>();
  /** Pixels from the top of the scroll container at which a section becomes "active". */
  readonly offset = input<number>(0);

  /** Emits the id/selector of the currently visible section. */
  readonly activeSection = output<string>();

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const container: HTMLElement | Window =
      this._el.nativeElement.tagName === 'BODY' || this._el.nativeElement.tagName === 'HTML'
        ? window
        : this._el.nativeElement;

    fromEvent(container, 'scroll', { passive: true })
      .pipe(auditTime(50), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._check());

    // Initial check
    this._check();
  }

  private _check(): void {
    const selectors = this.uiScrollspy();
    const off = this.offset();

    let active: string | null = null;
    for (let i = selectors.length - 1; i >= 0; i--) {
      const el = document.querySelector<HTMLElement>(selectors[i]);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= off + 1) {
        active = selectors[i];
        break;
      }
    }

    if (active) {
      this.activeSection.emit(active);
    }
  }
}
