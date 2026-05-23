import { Injectable, type WritableSignal } from '@angular/core';
import { defer, finalize, type Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { toast } from '../components/toast';
import type { ToastOptions } from '../components/toast';

export interface Toast {
  message: string;
  title?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
}

/**
 * Options for `ToastService.runWithToast` — wraps a long-running observable
 * (e.g. a bulk update or archive) with a "loading → success/error" toast and
 * an optional saving signal that drives spinner UI on the trigger button.
 */
export interface RunWithToastOptions<T> {
  /** Message shown immediately on subscribe (e.g. `"Saving 500 parts…"`). */
  loading: string;
  /** Builds the success message from the resolved value. */
  success: (result: T) => string;
  /** Static error message; falls back to a generic phrase. */
  error?: string;
  /**
   * Optional `WritableSignal<boolean>` that the helper flips to `true` on
   * subscribe and back to `false` in `finalize` — bind it to a TableData
   * `bulkSaving` input to drive the button spinner.
   */
  saving?: WritableSignal<boolean>;
}

/**
 * Injectable service wrapper around the custom `toast()` function.
 *
 * Requires `<ui-toaster />` to be present in your root component template.
 *
 * @example
 * constructor(private toastService: ToastService) {}
 * this.toastService.success('Saved!');
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  show(options: Toast): void {
    const { message, title, type = 'default', duration, dismissible, action } = options;
    const opts: ToastOptions = {
      description: title,
      duration,
      dismissible,
      action,
    };

    switch (type) {
      case 'success':
        toast.success(message, opts);
        break;
      case 'error':
        toast.error(message, opts);
        break;
      case 'warning':
        toast.warning(message, opts);
        break;
      case 'info':
        toast.info(message, opts);
        break;
      default:
        toast(message, opts);
    }
  }

  success(message: string, options?: Partial<Omit<Toast, 'message' | 'type'>>): void {
    this.show({ message, type: 'success', ...options });
  }

  error(message: string, options?: Partial<Omit<Toast, 'message' | 'type'>>): void {
    this.show({ message, type: 'error', ...options });
  }

  warning(message: string, options?: Partial<Omit<Toast, 'message' | 'type'>>): void {
    this.show({ message, type: 'warning', ...options });
  }

  info(message: string, options?: Partial<Omit<Toast, 'message' | 'type'>>): void {
    this.show({ message, type: 'info', ...options });
  }

  /** Show a persistent loading toast and return its id (use with {@link dismiss} / {@link update}). */
  loading(message: string, options?: Partial<Omit<Toast, 'message' | 'type'>>): string {
    const opts: ToastOptions = {
      description: options?.title,
      duration: options?.duration ?? 0,
      dismissible: options?.dismissible,
      action: options?.action,
    };
    return toast.loading(message, opts);
  }

  /** Dismiss a toast by id (or all toasts if no id). */
  dismiss(id?: string): void {
    toast.dismiss(id);
  }

  /**
   * Wrap a long-running Observable (typically a bulk update / archive call)
   * with a "loading → success/error" toast and an optional `saving` signal.
   *
   * Behavior:
   *   - Sets `saving` to `true` on subscribe.
   *   - Shows a loading toast immediately.
   *   - On the first emitted value: dismisses the loading toast and shows a
   *     success toast built from `options.success(result)`.
   *   - On error: dismisses the loading toast and shows an error toast.
   *   - In `finalize` (success or error): sets `saving` back to `false`.
   *
   * Returns the original observable for further chaining (cache invalidation,
   * data reload, etc.). The wrapper does NOT consume the value — your
   * `subscribe(...)` callbacks still see it.
   *
   * @example
   * ```ts
   * this.toast.runWithToast(this.service.bulkUpdate({ ids, group }), {
   *   loading: `Saving ${ids.length} part(s)…`,
   *   success: (r) => `Updated ${r.updated} part(s)`,
   *   error: 'Failed to bulk update parts',
   *   saving: this.bulkSaving,
   * }).subscribe({ next: () => this.loadAll() });
   * ```
   */
  runWithToast<T>(source$: Observable<T>, options: RunWithToastOptions<T>): Observable<T> {
    return defer(() => {
      options.saving?.set(true);
      const id = this.loading(options.loading);
      return source$.pipe(
        tap({
          next: (result) => {
            this.dismiss(id);
            this.success(options.success(result));
          },
          error: () => {
            this.dismiss(id);
            this.error(options.error ?? 'Operation failed');
          },
        }),
        finalize(() => options.saving?.set(false)),
      );
    });
  }
}
