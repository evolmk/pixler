import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks in-flight async operations for the global `<ui-loading-bar>` indicator.
 *
 * Increment with `start()` before kicking off an async task and decrement with
 * `complete()` when it resolves (success or error). An HTTP interceptor or
 * service wrapper can call these automatically.
 *
 * The bar only renders when `inFlight() > 0`.
 */
@Injectable({ providedIn: 'root' })
export class LoadingBarService {
  private readonly _count = signal(0);
  readonly inFlight = computed(() => this._count() > 0);
  readonly count = this._count.asReadonly();

  start(): void {
    this._count.update((n) => n + 1);
  }

  complete(): void {
    this._count.update((n) => Math.max(0, n - 1));
  }

  /** Force-reset (rare — only for emergency error recovery). */
  reset(): void {
    this._count.set(0);
  }
}
