import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '../../utils';
import { gsap } from 'gsap';
import { ToastStateService } from './toast-state.service';
import { ToastItemComponent } from './toast-item.component';
import type { ToasterPosition, ToastProgressType, ToastVariant } from './toast.types';

/** Container component — place once in your root template: `<ui-toaster />` */
@Component({
  selector: 'ui-toaster',
  standalone: true,
  imports: [ToastItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol
      [class]="containerClass()"
      [attr.dir]="resolvedDir()"
      [attr.aria-label]="'Notifications'"
      [attr.aria-live]="'polite'"
      [attr.aria-relevant]="'additions text'"
      [attr.aria-atomic]="'false'"
      (mouseenter)="onHover(true)"
      (mouseleave)="onHover(false)"
    >
      @for (item of visibleItems(); track item.id) {
        <li class="w-full">
          <ui-toast-item
            [toast]="item"
            [richColors]="item.richColors ?? richColors()"
            [closeButton]="item.closeButton ?? closeButton()"
            [isTop]="isTop()"
            [progress]="progress()"
            [duration]="item.duration || duration()"
          />
        </li>
      }
    </ol>
  `,
})
export class ToasterComponent implements AfterViewInit {
  /** Global default variant for all toasts. */
  readonly variant = input<ToastVariant>('default');
  /** Theme override for the toaster area (integrates with ThemeService). */
  readonly theme = input<'light' | 'dark' | 'system'>('system');
  /** Corner/edge position of the toast stack. */
  readonly position = input<ToasterPosition>('bottom-center');
  /** Use type-specific colors (green/red/yellow/blue) instead of neutral. */
  readonly richColors = input<boolean>(true);
  /** Default auto-dismiss duration in ms for all toasts (0 = persist). */
  readonly duration = input<number>(4000);
  /** Progress indicator type shown on each toast. */
  readonly progress = input<ToastProgressType>('none');
  /** Maximum number of toasts visible at once. */
  readonly visibleToasts = input<number>(3);
  /** Show a close (×) button on each toast. */
  readonly closeButton = input<boolean>(false);
  /** Text direction — passed to the container's [dir] attribute. */
  readonly dir = input<'ltr' | 'rtl' | 'auto'>('auto');

  private readonly _state = inject(ToastStateService);
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _destroyRef = inject(DestroyRef);
  private _prevCount = 0;
  private _isHovered = signal(false);

  // ── Computed ─────────────────────────────────────────────────────────────────

  /** Whether the position anchor is at the top of the screen. */
  protected readonly isTop = computed(() => this.position().startsWith('top'));

  /** Slice the signal to the visible limit — take the most recent (last) items. */
  protected readonly visibleItems = computed(() => {
    const all = this._state.toasts();
    return all.slice(Math.max(0, all.length - this.visibleToasts()));
  });

  /** Resolved dir attribute value. */
  protected readonly resolvedDir = computed(() => (this.dir() === 'auto' ? null : this.dir()));

  /**
   * Fixed container class: position, sizing, pointer-events.
   * Using fixed width of sm:max-w-sm (356px equivalent) matching sonner's default.
   */
  protected readonly containerClass = computed(() => {
    const pos = this.position();

    const positionClasses: Record<ToasterPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-6 left-4',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-6 right-4',
    };

    return cn(
      'fixed z-50 w-full px-4 sm:px-0 sm:max-w-md list-none m-0 py-0 flex flex-col gap-2',
      positionClasses[pos],
    );
  });

  constructor() {
    // Animate existing toasts when count changes
    effect(() => {
      const count = this.visibleItems().length;
      const prev = this._prevCount;
      this._prevCount = count;

      if (prev === 0 || count === 0) return;

      const ol = this._el.nativeElement.querySelector('ol');
      if (!ol) return;
      const items = ol.querySelectorAll(':scope > li');

      if (count > prev) {
        // New toast added — animate existing items (all except the newest/last)
        items.forEach((item: Element, i: number) => {
          if (i < items.length - 1) {
            gsap.fromTo(item, { y: 10 }, { y: 0, duration: 0.3, ease: 'power2.out' });
          }
        });
      } else if (count < prev) {
        // Toast removed — settle remaining items
        items.forEach((item: Element) => {
          gsap.fromTo(item, { y: -4 }, { y: 0, duration: 0.25, ease: 'power2.out' });
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this._prevCount = this.visibleItems().length;
  }

  // ── Hover expand ──────────────────────────────────────────────────────────────

  protected onHover(hovered: boolean): void {
    this._isHovered.set(hovered);
    const ol = this._el.nativeElement.querySelector('ol');
    if (!ol) return;
    const items = ol.querySelectorAll(':scope > li');
    if (items.length <= 1) return;

    if (hovered) {
      // Fan out: add spacing between items
      gsap.to(items, {
        marginBottom: 4,
        duration: 0.25,
        ease: 'power2.out',
        stagger: 0.03,
      });
    } else {
      gsap.to(items, {
        marginBottom: 0,
        duration: 0.2,
        ease: 'power2.in',
        stagger: 0.02,
      });
    }
  }
}
