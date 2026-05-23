import type { DialogSize } from './dialog.component';

export interface DialogConfig<D = unknown> {
  /** Data to inject via DIALOG_DATA token. */
  data?: D;
  /** Size preset — maps to Tailwind max-width classes. Default: 'default'. */
  size?: DialogSize;
  /** Custom CSS class(es) applied to the content wrapper. */
  panelClass?: string;
  /** Whether clicking the backdrop closes the dialog. Default: true. */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes the dialog. Default: true. */
  closeOnEscape?: boolean;
  /** Whether to auto-focus the first tabbable element. Default: true. */
  autoFocus?: boolean;
}
