export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastProgressType = 'bar' | 'circle' | 'none';

export type ToastVariant = 'default' | 'destructive';

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Secondary text displayed below the main message. */
  description?: string;
  /** Auto-dismiss timeout in ms. Set to 0 to persist indefinitely. */
  duration?: number;
  /** Override the global toaster position for this specific toast. */
  position?: ToasterPosition;
  /** Override the global closeButton setting for this specific toast. */
  closeButton?: boolean;
  /** Action button shown inside the toast. */
  action?: ToastAction;
  /** Visual variant — use 'destructive' for error/danger styling. */
  variant?: ToastVariant;
  /** Override the global richColors setting for this specific toast. */
  richColors?: boolean;
  /** Custom ID — used for deduplication and targeted dismissal. */
  id?: string;
  /** Whether the user can dismiss by clicking. Default: true. */
  dismissible?: boolean;
}

/** Internal representation of an active toast in the signal stack. */
export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  variant: ToastVariant;
  duration: number;
  dismissible: boolean;
  closeButton?: boolean;
  richColors?: boolean;
  action?: ToastAction;
  position?: ToasterPosition;
  createdAt: number;
  /** True while the exit animation is playing, before removal from signal. */
  exiting: boolean;
}
