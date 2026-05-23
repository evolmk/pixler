import { Directive, ElementRef, OnDestroy, OnInit, contentChildren, inject, input } from '@angular/core';
import { LightboxItemDirective } from './lightbox-item.directive';
import { LightboxService } from './lightbox.service';
import type { LightboxOptions } from './lightbox.types';

/**
 * Declarative gallery directive — wraps a group of `[lbItem]` elements and
 * opens the lightbox when any item is clicked.
 *
 * Usage:
 * ```html
 * <div lbGallery [options]="{ loop: true, showThumbs: true }">
 *   @for (img of images; track img.src) {
 *     <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" />
 *   }
 * </div>
 * ```
 */
@Directive({
  selector: '[lbGallery]',
  standalone: true,
})
export class LightboxGalleryDirective implements OnInit, OnDestroy {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _service = inject(LightboxService);

  /** Optional lightbox configuration overrides. */
  readonly options = input<Partial<LightboxOptions>>({});

  /** All descendant `[lbItem]` directives (reactive — updates on `@for` changes). */
  readonly _items = contentChildren(LightboxItemDirective, { descendants: true });

  ngOnInit(): void {
    this._el.nativeElement.addEventListener('click', this._handleClick);
  }

  ngOnDestroy(): void {
    this._el.nativeElement.removeEventListener('click', this._handleClick);
  }

  private readonly _handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const itemsArr = this._items();
    const clicked = itemsArr.find((d) => d.el.nativeElement.contains(target));
    if (!clicked) return;

    event.preventDefault();
    const index = itemsArr.indexOf(clicked);
    const lbItems = itemsArr.map((d) => d.toItem());
    this._service.open(lbItems, { startIndex: index, ...this.options() });
  };
}
