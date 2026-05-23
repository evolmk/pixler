import { getToastStateInstance } from './toast-state.service';
import type { ToastOptions } from './toast.types';

interface ToastPromiseOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
  /** Description for the loading state. */
  description?: string;
}

/**
 * Imperative toast function
 *
 * Requires `<ui-toaster />` to be present in the root template so the
 * ToastStateService singleton is initialised.
 *
 * @example
 * toast('Event created');
 * toast.success('Saved!', { description: 'All changes have been persisted.' });
 * toast.promise(saveData(), { loading: 'Saving…', success: 'Done!', error: 'Failed.' });
 */
function toastFn(message: string, options?: ToastOptions): string {
  return getToastStateInstance()?.add({ message, type: 'default', ...options }) ?? '';
}

toastFn.success = (message: string, options?: ToastOptions): string =>
  getToastStateInstance()?.add({ message, type: 'success', ...options }) ?? '';

toastFn.error = (message: string, options?: ToastOptions): string =>
  getToastStateInstance()?.add({ message, type: 'error', ...options }) ?? '';

toastFn.warning = (message: string, options?: ToastOptions): string =>
  getToastStateInstance()?.add({ message, type: 'warning', ...options }) ?? '';

toastFn.info = (message: string, options?: ToastOptions): string =>
  getToastStateInstance()?.add({ message, type: 'info', ...options }) ?? '';

/**
 * Show a loading toast that persists until the promise resolves.
 * (duration defaults to 0 = persist)
 */
toastFn.loading = (message: string, options?: ToastOptions): string =>
  getToastStateInstance()?.add({ message, type: 'loading', duration: 0, ...options }) ?? '';

/**
 * Promise-based toast:
 * 1. Shows a loading toast immediately.
 * 2. On resolution → updates to success type + message.
 * 3. On rejection → updates to error type + message.
 * Returns the toast ID.
 */
toastFn.promise = <T>(
  promiseFn: Promise<T> | (() => Promise<T>),
  options: ToastPromiseOptions<T>,
): string => {
  const id = toastFn.loading(options.loading, {
    description: options.description,
    duration: 0,
  });

  const promise = typeof promiseFn === 'function' ? promiseFn() : promiseFn;

  promise
    .then((data) => {
      const msg =
        typeof options.success === 'function' ? options.success(data) : options.success;
      const state = getToastStateInstance();
      state?.update(id, { message: msg, type: 'success', duration: 4000, exiting: false });
      setTimeout(() => state?.dismiss(id), 4000);
    })
    .catch((err: unknown) => {
      const msg =
        typeof options.error === 'function' ? options.error(err) : options.error;
      const state = getToastStateInstance();
      state?.update(id, { message: msg, type: 'error', duration: 4000, exiting: false });
      setTimeout(() => state?.dismiss(id), 4000);
    });

  return id;
};

/**
 * Dismiss a toast by ID, or all toasts if no ID is provided.
 */
toastFn.dismiss = (id?: string): void => {
  const state = getToastStateInstance();
  if (id !== undefined) {
    state?.dismiss(id);
  } else {
    state?.dismissAll();
  }
};

export const toast = toastFn;
