import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { LoadingBarService } from '../../services/loading-bar.service';

/**
 * `<ui-loading-bar>` — Thin top-of-viewport progress indicator.
 *
 * Renders a fixed 2px brand bar across the top of the viewport whenever
 * `LoadingBarService.inFlight()` is true. An indeterminate animation slides
 * across, then fades out when all in-flight requests complete.
 *
 * Mount once at the app shell. Drive it via `LoadingBarService.start()` /
 * `complete()` (typically from an HTTP interceptor).
 */
@Component({
  selector: 'ui-loading-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class]="trackClass()"
      [attr.aria-hidden]="!visible()"
      [attr.role]="visible() ? 'progressbar' : null"
      aria-label="Loading"
    >
      <div class="ui-loading-bar__indicator"></div>
    </div>
  `,
  styles: [
    `
      .ui-loading-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 7px;
        z-index: 10000;
        pointer-events: none;
        background-color: color-mix(in srgb, var(--color-brand) 35%, transparent);
        overflow: hidden;
        opacity: 0;
        transition: opacity 220ms ease;
      }
      .ui-loading-bar--visible {
        opacity: 1;
      }
      .ui-loading-bar__indicator {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 40%;
        background-color: var(--color-brand);
        border-radius: 0 7px 7px 0;
        animation: ui-loading-bar-slide 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        box-shadow: 0 0 10px color-mix(in srgb, var(--color-brand) 70%, transparent);
      }
      @keyframes ui-loading-bar-slide {
        0% {
          left: -40%;
          width: 40%;
        }
        50% {
          left: 30%;
          width: 50%;
        }
        100% {
          left: 100%;
          width: 40%;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .ui-loading-bar__indicator {
          animation: none;
          width: 100%;
          left: 0;
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class LoadingBarComponent {
  readonly class = input<string>('');

  private readonly loading = inject(LoadingBarService);
  protected readonly visible = computed(() => this.loading.inFlight());
  protected readonly trackClass = computed(() =>
    ['ui-loading-bar', this.visible() ? 'ui-loading-bar--visible' : '', this.class()].filter(Boolean).join(' '),
  );
}
