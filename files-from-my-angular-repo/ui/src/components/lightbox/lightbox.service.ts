import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  Injectable,
  DOCUMENT,
  createComponent,
  inject,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LightboxComponent } from './lightbox.component';
import type { LightboxItem, LightboxOptions, LightboxRef } from './lightbox.types';

/**
 * Programmatic API for opening a lightbox without a host component.
 *
 * Usage:
 * ```ts
 * const ref = lightboxService.open(items, { startIndex: 2 });
 * await ref.afterClosed$;
 * ```
 */
@Injectable({ providedIn: 'root' })
export class LightboxService {
  private readonly _appRef = inject(ApplicationRef);
  private readonly _envInjector = inject(EnvironmentInjector);
  private readonly _doc = inject(DOCUMENT);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private _activeRef: LightboxRef | null = null;

  constructor() {
    this._router.events.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart && this._activeRef) {
        this._activeRef.close();
        this._activeRef = null;
      }
    });
  }

  open(items: LightboxItem[], options?: Partial<LightboxOptions>): LightboxRef {
    const ref = createComponent(LightboxComponent, {
      environmentInjector: this._envInjector,
    });

    // Apply options as inputs before attaching to DOM
    ref.setInput('items', items);
    if (options) {
      const { startIndex: _startIndex, ...rest } = options;
      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          ref.setInput(key, value);
        }
      }
    }

    this._appRef.attachView(ref.hostView);
    this._doc.body.appendChild(ref.location.nativeElement);

    const instance = ref.instance;
    const idx = options?.startIndex ?? 0;
    instance.open(idx);

    let _resolve!: (n: number) => void;
    const afterClosed$ = new Promise<number>((r) => (_resolve = r));

    const sub = instance.closed.subscribe((closedAt) => {
      _resolve(closedAt);
      sub.unsubscribe();
      // Defer teardown so close animation can finish
      setTimeout(() => {
        this._appRef.detachView(ref.hostView);
        ref.destroy();
      }, 0);
    });

    const lightboxRef: LightboxRef = {
      close: () => instance.close(),
      goTo: (n: number) => instance.goTo(n),
      afterClosed$,
    };

    this._activeRef = lightboxRef;
    void afterClosed$.then(() => {
      if (this._activeRef === lightboxRef) this._activeRef = null;
    });

    return lightboxRef;
  }
}
