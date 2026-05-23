import { Injectable, signal } from '@angular/core';
import type { ToastItem, ToastOptions, ToastType } from './toast.types';

/**
 * Module-level singleton reference so the free `toast()` function can call
 * the service without Angular injection. Set in the constructor when the
 * ToastStateService is first created (which happens when ToasterComponent
 * is initialised at app root).
 */
let _instance: ToastStateService | null = null;

export function getToastStateInstance(): ToastStateService | null {
  return _instance;
}

/** Duration of the exit animation in ms — must match the CSS duration. */
const EXIT_DURATION_MS = 300;

let _counter = 0;

@Injectable({ providedIn: 'root' })
export class ToastStateService {
  private readonly _toasts = signal<ToastItem[]>([]);
  private readonly _timers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Readonly signal consumed by ToasterComponent. */
  readonly toasts = this._toasts.asReadonly();

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    _instance = this;
  }

  /**
   * Add a new toast to the stack. Returns the toast ID.
   * If an `id` is provided and a toast with that ID already exists,
   * it updates the existing entry (deduplication).
   */
  add(input: { message: string; type: ToastType } & ToastOptions): string {
    const id = input.id ?? `toast-${++_counter}-${Math.random().toString(36).slice(2, 6)}`;
    const duration = input.duration ?? 4000;

    // Deduplication: update existing toast with same explicit ID
    if (input.id && this._toasts().some((t) => t.id === id)) {
      this.update(id, {
        message: input.message,
        type: input.type,
        description: input.description,
        exiting: false,
      });
      return id;
    }

    const item: ToastItem = {
      id,
      message: input.message,
      description: input.description,
      type: input.type,
      variant: input.variant ?? 'default',
      duration,
      dismissible: input.dismissible ?? true,
      closeButton: input.closeButton,
      richColors: input.richColors,
      action: input.action,
      position: input.position,
      createdAt: Date.now(),
      exiting: false,
    };

    // Newest toast is appended (last index = bottom of stack)
    this._toasts.update((ts) => [...ts, item]);

    if (duration > 0) {
      this._timers.set(
        id,
        setTimeout(() => this.dismiss(id), duration),
      );
    }

    return id;
  }

  /** Update properties on an existing toast by ID (used by toast.promise). */
  update(id: string, updates: Partial<ToastItem>): void {
    // Reset the auto-dismiss timer if duration is being updated
    if (updates.duration !== undefined && updates.duration > 0) {
      this._clearTimer(id);
      this._timers.set(
        id,
        setTimeout(() => this.dismiss(id), updates.duration),
      );
    }
    this._toasts.update((ts) => ts.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  /**
   * Dismiss a toast: first marks it `exiting` (triggers CSS exit animation),
   * then removes it from the signal after the animation completes.
   */
  dismiss(id: string): void {
    this._clearTimer(id);
    // Mark as exiting to trigger exit animation
    this._toasts.update((ts) => ts.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    // Remove after animation
    setTimeout(() => {
      this._toasts.update((ts) => ts.filter((t) => t.id !== id));
    }, EXIT_DURATION_MS);
  }

  /** Dismiss all active toasts. */
  dismissAll(): void {
    this._toasts().forEach((t) => this._clearTimer(t.id));
    this._toasts.update((ts) => ts.map((t) => ({ ...t, exiting: true })));
    setTimeout(() => this._toasts.set([]), EXIT_DURATION_MS);
  }

  private _clearTimer(id: string): void {
    const timer = this._timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this._timers.delete(id);
    }
  }
}
