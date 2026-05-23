import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '../../utils';
import { gsap } from 'gsap';
import { ToastStateService } from './toast-state.service';
import { ToastProgressComponent } from './toast-progress.component';
import { toastVariants, richColorClasses, iconColorClasses } from './toast.variants';
import type { ToastItem, ToastProgressType } from './toast.types';

@Component({
  selector: 'ui-toast-item',
  standalone: true,
  imports: [ToastProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Wrapper: handles enter/exit animations -->
    <div
      [class]="wrapperClass()"
      [attr.role]="'status'"
      [attr.aria-live]="'polite'"
      [attr.data-type]="toast().type"
      [attr.data-variant]="toast().variant"
      [attr.data-exiting]="toast().exiting || null"
    >
      <!-- Icon -->
      @if (toast().type !== 'default') {
        <div class="shrink-0" [class]="iconClass()">
          @switch (toast().type) {
            @case ('success') {
              <svg
                class="size-4 md:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            }
            @case ('error') {
              <svg
                class="size-4 md:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
            }
            @case ('warning') {
              <svg
                class="size-4 md:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            }
            @case ('info') {
              <svg
                class="size-4 md:size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            }
            @case ('loading') {
              <!-- Animated spinner -->
              <svg
                class="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            }
          }
        </div>
      }

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="text-sm md:text-base font-medium leading-snug">{{ toast().message }}</p>
        @if (toast().description) {
          <p class="mt-1 text-xs md:text-sm leading-relaxed opacity-80">{{ toast().description }}</p>
        }
      </div>

      <!-- Right side: action + circle progress + close -->
      <div class="ml-auto flex shrink-0 items-center gap-2">
        @if (toast().action) {
          <button
            type="button"
            class="shrink-0 rounded-md border border-current/20 px-3 py-1.5 text-xs md:text-sm font-medium hover:bg-current/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            (click)="onAction()"
          >
            {{ toast().action!.label }}
          </button>
        }
        @if (progress() === 'circle') {
          <ui-toast-progress type="circle" [duration]="duration()" [toastType]="toast().type" />
        }
        @if (showClose()) {
          <button
            type="button"
            class="shrink-0 rounded-sm p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            [attr.aria-label]="'Dismiss notification'"
            (click)="onDismiss()"
          >
            <svg
              class="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        }
      </div>

      <!-- Bar progress -->
      @if (progress() === 'bar') {
        <ui-toast-progress type="bar" [duration]="duration()" [toastType]="toast().type" />
      }
    </div>
  `,
})
export class ToastItemComponent implements AfterViewInit {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  readonly toast = input.required<ToastItem>();
  readonly richColors = input<boolean>(false);
  readonly closeButton = input<boolean>(false);
  readonly isTop = input<boolean>(false);
  readonly progress = input<ToastProgressType>('none');
  readonly duration = input<number>(4000);

  // ── Outputs ─────────────────────────────────────────────────────────────────
  readonly dismissed = output<void>();

  private readonly _state = inject(ToastStateService);
  private readonly _el = inject(ElementRef<HTMLElement>);

  // ── Computed ─────────────────────────────────────────────────────────────────
  protected readonly showClose = computed(() => this.toast().closeButton ?? this.closeButton());

  protected readonly effectiveRichColors = computed(() => this.toast().richColors ?? this.richColors());

  protected readonly wrapperClass = computed(() => {
    const t = this.toast();
    const useRich = this.effectiveRichColors() && t.variant !== 'destructive';
    const richClass = useRich && t.type !== 'default' && t.type !== 'loading' ? (richColorClasses[t.type] ?? '') : '';

    return cn(toastVariants({ variant: t.variant }), richClass, t.dismissible && 'cursor-pointer');
  });

  protected readonly iconClass = computed(() => {
    const t = this.toast();
    if (t.variant === 'destructive') return iconColorClasses['destructive'];
    return iconColorClasses[t.type] ?? iconColorClasses['default'];
  });

  constructor() {
    effect(() => {
      const t = this.toast();
      if (t.exiting) {
        const wrapper = this._el.nativeElement.querySelector('[data-type]') as HTMLElement | null;
        if (wrapper) {
          const yDir = this.isTop() ? -12 : 12;
          gsap.to(wrapper, { opacity: 0, y: yDir, scale: 0.95, duration: 0.25, ease: 'power2.in' });
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const wrapper = this._el.nativeElement.querySelector('[data-type]') as HTMLElement | null;
    if (wrapper) {
      const yFrom = this.isTop() ? -16 : 16;
      gsap.fromTo(
        wrapper,
        { opacity: 0, y: yFrom, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' },
      );
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  protected onDismiss(): void {
    this._state.dismiss(this.toast().id);
    this.dismissed.emit();
  }

  protected onAction(): void {
    this.toast().action?.onClick();
  }
}
