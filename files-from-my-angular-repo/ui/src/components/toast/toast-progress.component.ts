import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import type { ToastProgressType, ToastType } from './toast.types';

const PROGRESS_COLORS: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  loading: 'bg-muted-foreground',
  default: 'bg-muted-foreground',
};

const STROKE_COLORS: Record<string, string> = {
  success: 'stroke-green-500',
  error: 'stroke-red-500',
  warning: 'stroke-yellow-500',
  info: 'stroke-blue-500',
  loading: 'stroke-muted-foreground',
  default: 'stroke-muted-foreground',
};

@Component({
  selector: 'ui-toast-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (type() === 'bar') {
      <div class="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-lg">
        <div
          class="h-full origin-left"
          [class]="barColorClass()"
          [style.animation]="'toast-progress-shrink ' + duration() + 'ms linear forwards'"
        ></div>
      </div>
    }
    @if (type() === 'circle') {
      <svg class="size-5 -rotate-90 shrink-0" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" class="stroke-muted" stroke-width="2" />
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          [class]="circleColorClass()"
          stroke-width="2"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [style.animation]="'toast-progress-circle ' + duration() + 'ms linear forwards'"
        />
      </svg>
    }
  `,
  styles: [
    `
      @keyframes toast-progress-shrink {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
      @keyframes toast-progress-circle {
        from {
          stroke-dashoffset: 0;
        }
        to {
          stroke-dashoffset: 50.265;
        }
      }
    `,
  ],
})
export class ToastProgressComponent {
  readonly type = input.required<ToastProgressType>();
  readonly duration = input<number>(4000);
  readonly toastType = input<ToastType>('default');

  /** Circumference of the SVG circle (2 * PI * r where r=8) */
  readonly circumference = 2 * Math.PI * 8; // ~50.265

  protected readonly barColorClass = computed(() => PROGRESS_COLORS[this.toastType()] ?? PROGRESS_COLORS['default']);

  protected readonly circleColorClass = computed(() => STROKE_COLORS[this.toastType()] ?? STROKE_COLORS['default']);
}
