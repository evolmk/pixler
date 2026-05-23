import { inject, Injectable, Injector, signal, type Type } from '@angular/core';
import { DialogRef } from '../components/dialog/dialog-ref';
import { DIALOG_DATA } from '../components/dialog/dialog.tokens';
import { DIALOG_TOKEN, type DialogSize } from '../components/dialog/dialog.component';
import type { DialogConfig } from '../components/dialog/dialog.types';

/** @internal — Represents a single dialog entry in the stack. */
export interface DialogEntry {
  id: string;
  component: Type<unknown>;
  injector: Injector;
  config: {
    size: DialogSize;
    panelClass: string;
    closeOnBackdropClick: boolean;
    closeOnEscape: boolean;
    autoFocus: boolean;
  };
  ref: DialogRef<any>;
}

let dialogCounter = 0;

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly parentInjector = inject(Injector);
  private readonly dialogsSignal = signal<DialogEntry[]>([]);

  /** Readonly signal of the dialog stack — consumed by a dialog container component. */
  readonly dialogs = this.dialogsSignal.asReadonly();

  /**
   * Open a component as a dialog.
   *
   * @param component The component class to render inside the dialog.
   * @param config Optional configuration (data, size, panelClass, close behaviour).
   * @returns DialogRef that allows closing and subscribing to afterClosed().
   */
  open<C, D = unknown, R = unknown>(component: Type<C>, config?: DialogConfig<D>): DialogRef<R> {
    const id = `dialog-${++dialogCounter}`;
    const ref = new DialogRef<R>();

    const resolvedConfig = {
      size: config?.size ?? 'default',
      panelClass: config?.panelClass ?? '',
      closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
      closeOnEscape: config?.closeOnEscape ?? true,
      autoFocus: config?.autoFocus ?? true,
    };

    const injector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DIALOG_DATA, useValue: config?.data ?? null },
        { provide: DialogRef, useValue: ref },
        {
          provide: DIALOG_TOKEN,
          useValue: { size: signal(resolvedConfig.size), isOpen: signal(true) },
        },
      ],
    });

    const entry: DialogEntry = { id, component, injector, config: resolvedConfig, ref };

    ref._onClose = () => {
      this.dialogsSignal.update((stack) => stack.filter((d) => d.id !== id));
      if (this.dialogsSignal().length === 0) {
        document.body.style.overflow = '';
      }
    };

    document.body.style.overflow = 'hidden';
    this.dialogsSignal.update((stack) => [...stack, entry]);

    return ref;
  }

  /** Close all open dialogs (topmost first). */
  closeAll(): void {
    const current = this.dialogsSignal();
    for (let i = current.length - 1; i >= 0; i--) {
      current[i].ref.close();
    }
  }
}
