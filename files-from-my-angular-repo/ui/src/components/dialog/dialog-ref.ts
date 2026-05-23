import { Subject, type Observable } from 'rxjs';

/**
 * Handle to an open dialog. Injected into the dialog component for
 * programmatic close and result passing.
 */
export class DialogRef<R = unknown> {
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Emits once when the dialog is closed, then completes. */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /** Close the dialog, optionally passing a result value. */
  close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._onClose?.(result);
  }

  /** @internal — set by DialogService to remove from the stack. */
  _onClose?: (result?: R) => void;
}
