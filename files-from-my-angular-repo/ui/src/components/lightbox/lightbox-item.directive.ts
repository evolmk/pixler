import { Directive, ElementRef, inject, input } from '@angular/core';
import type { LightboxItem, LightboxItemType, LightboxPin } from './lightbox.types';

/**
 * Marks an element as a lightbox item within a `[lbGallery]` container.
 *
 * Usage:
 * ```html
 * <img lbItem [src]="img.src" [thumb]="img.thumb" [caption]="img.caption" />
 * ```
 */
@Directive({
  selector: '[lbItem]',
  standalone: true,
  host: {
    class: 'cursor-pointer',
    // Reflect the src input back onto the host element so <img lbItem [src]="...">
    // actually renders — without this, Angular routes [src] to the directive input
    // and the native img src attribute is never set.
    '[attr.src]': 'src()',
  },
})
export class LightboxItemDirective {
  /** @internal — used by lbGallery to match click targets to their index. */
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly src = input.required<string>();
  readonly thumb = input<string>('');
  readonly caption = input<string>('');
  readonly type = input<LightboxItemType | undefined>(undefined);
  readonly slug = input<string>('');
  readonly poster = input<string>('');
  readonly alt = input<string>('');
  readonly downloadSrc = input<string>('');
  readonly pins = input<LightboxPin[] | undefined>(undefined);

  /** Convert directive inputs into a plain `LightboxItem` object. */
  toItem(): LightboxItem {
    return {
      src: this.src(),
      thumb: this.thumb() || undefined,
      caption: this.caption() || undefined,
      type: this.type(),
      slug: this.slug() || undefined,
      poster: this.poster() || undefined,
      alt: this.alt() || undefined,
      downloadSrc: this.downloadSrc() || undefined,
      pins: this.pins(),
    };
  }
}
