import { Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { resolveTooltipDelay, type TooltipDelayPreset } from '../components/tooltip/tooltip.component';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'default' | 'accent' | 'primary';

/**
 * `[uiTooltip]` — Simple string-only tooltip shorthand.
 *
 * The canonical compound tooltip is `<ui-tooltip>` + `<ui-tooltip-content>`.
 * Use this directive for quick one-liner tooltips where the compound API is overkill.
 *
 * Usage:
 * ```html
 * <button uiTooltip="Save changes" uiTooltipPlacement="top">Save</button>
 * <button uiTooltip="Quick" uiTooltipDelay="instant">Snappy</button>
 * <button uiTooltip="Custom" [uiTooltipDelay]="250">Numeric ms</button>
 * ```
 *
 * `uiTooltipDelay` accepts a number (ms) or a preset:
 * `'instant'` (0), `'fast'` (100, default), `'normal'` (300), `'slow'` (700).
 */
@Directive({
  selector: '[uiTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': '_show()',
    '(mouseleave)': '_hide()',
    '(focus)': '_show()',
    '(blur)': '_hide()',
  },
})
export class TooltipDirective implements OnDestroy {
  readonly uiTooltip = input.required<string>();
  readonly uiTooltipDescription = input<string>('');
  readonly uiTooltipPlacement = input<TooltipPlacement>('top');
  readonly uiTooltipDelay = input<number | TooltipDelayPreset>('fast');
  readonly uiTooltipArrow = input<boolean>(true);
  readonly uiTooltipVariant = input<TooltipVariant>('default');

  private readonly _el = inject(ElementRef<HTMLElement>);
  private _tip: HTMLDivElement | null = null;
  private _timeout: ReturnType<typeof setTimeout> | null = null;

  _show(): void {
    this._timeout = setTimeout(() => {
      if (this._tip) return;
      const label = this.uiTooltip();
      if (!label) return;

      const description = this.uiTooltipDescription();
      const hasDescription = !!description;
      const variant = this.uiTooltipVariant();
      const bgVar =
        variant === 'accent' ? '--color-accent' : variant === 'primary' ? '--color-primary' : '--color-popover';
      const fgVar =
        variant === 'accent'
          ? '--color-accent-foreground'
          : variant === 'primary'
            ? '--color-primary-foreground'
            : '--color-popover-foreground';

      const tip = document.createElement('div');
      tip.setAttribute('role', 'tooltip');
      tip.style.cssText = [
        'position:fixed',
        'z-index:9999',
        'pointer-events:none',
        `background:var(${bgVar},#1e1e1e)`,
        `color:var(${fgVar},#fff)`,
        'font-size:0.75rem',
        'line-height:1.25rem',
        'padding:0.25rem 0.5rem',
        'border-radius:0.25rem',
        hasDescription ? 'white-space:normal' : 'white-space:nowrap',
        hasDescription ? 'max-width:16rem' : '',
        // M142 Sprint 6a — shadow removed; flat tooltips read cleaner against
        // accent backgrounds and match the rest of the header surface.
      ]
        .filter(Boolean)
        .join(';');

      if (hasDescription) {
        const titleEl = document.createElement('div');
        titleEl.textContent = label;
        titleEl.style.cssText = 'font-weight:600;font-size:0.75rem';

        const descEl = document.createElement('div');
        descEl.textContent = description;
        descEl.style.cssText = 'font-weight:400;font-size:0.75rem;opacity:0.85;margin-top:0.125rem';

        tip.appendChild(titleEl);
        tip.appendChild(descEl);
      } else {
        tip.textContent = label;
      }

      if (this.uiTooltipArrow()) {
        const arrow = document.createElement('div');
        arrow.style.cssText = [
          'position:absolute',
          'width:8px',
          'height:8px',
          `background:var(${bgVar},#1e1e1e)`,
          'transform:rotate(45deg)',
        ].join(';');
        tip.style.overflow = 'visible';
        tip.appendChild(arrow);
        (tip as any).__arrow = arrow;
      }

      document.body.appendChild(tip);
      this._tip = tip;
      this._position(tip);
    }, resolveTooltipDelay(this.uiTooltipDelay()));
  }

  _hide(): void {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    this._tip?.remove();
    this._tip = null;
  }

  ngOnDestroy(): void {
    this._hide();
  }

  private _position(tip: HTMLDivElement): void {
    const rect = (this._el.nativeElement as HTMLElement).getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    const gap = 6;

    let top = 0;
    let left = 0;
    switch (this.uiTooltipPlacement()) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tr.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tr.height / 2;
        left = rect.left - tr.width - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tr.height / 2;
        left = rect.right + gap;
        break;
      default: // top
        top = rect.top - tr.height - gap;
        left = rect.left + rect.width / 2 - tr.width / 2;
        break;
    }
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';

    const arrow = (tip as any).__arrow as HTMLDivElement | undefined;
    if (arrow) {
      switch (this.uiTooltipPlacement()) {
        case 'bottom':
          arrow.style.top = '-4px';
          arrow.style.left = tr.width / 2 - 4 + 'px';
          break;
        case 'left':
          arrow.style.top = tr.height / 2 - 4 + 'px';
          arrow.style.right = '-4px';
          arrow.style.left = '';
          break;
        case 'right':
          arrow.style.top = tr.height / 2 - 4 + 'px';
          arrow.style.left = '-4px';
          break;
        default: // top
          arrow.style.bottom = '-4px';
          arrow.style.top = '';
          arrow.style.left = tr.width / 2 - 4 + 'px';
          break;
      }
    }
  }
}
