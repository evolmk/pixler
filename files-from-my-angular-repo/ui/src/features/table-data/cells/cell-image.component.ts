import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { cn } from '../../../utils/cn';
import { LightboxService } from '../../../components/lightbox/lightbox.service';
import type { LightboxItem } from '../../../components/lightbox/lightbox.types';

@Component({
  selector: 'ui-cell-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <div class="relative inline-flex">
      <div
        class="size-[46px] rounded border border-border bg-muted/30 overflow-hidden flex items-center justify-center"
        [class.cursor-pointer]="!!src()"
        [class.hover:border-primary]="!!src()"
        [class.transition-colors]="!!src()"
        (click)="onImageClick($event)"
      >
        @if (src()) {
          <img [src]="src()" [alt]="alt()" class="max-h-full max-w-full object-contain p-0.5" loading="lazy" />
        } @else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4 text-muted-foreground/40"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        }
      </div>
      @if (count() > 0) {
        <span
          class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none"
        >
          {{ count() }}
        </span>
      }
    </div>
  `,
})
export class CellImageComponent {
  private readonly lightboxService = inject(LightboxService);

  readonly src = input<string | null>(null);
  readonly alt = input<string>('');
  readonly count = input<number>(0);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('inline-flex', this.class()));

  protected onImageClick(event: MouseEvent): void {
    const imgSrc = this.src();
    if (!imgSrc) return;
    event.stopPropagation();
    const label = this.alt() || 'Image Preview';
    const items: LightboxItem[] = [{ src: imgSrc, thumb: imgSrc, alt: label, caption: label }];
    this.lightboxService.open(items, {
      startIndex: 0,
      size: 'md',
      theme: 'auto',
      openFrom: 'center',
      closeOnBackdropClick: true,
      backdropBlur: true,
      showClose: true,
      showCaption: false,
      showCounter: false,
      showThumbs: false,
      toolbarLeft: ['caption'],
      toolbarRight: ['close'],
    });
  }
}
