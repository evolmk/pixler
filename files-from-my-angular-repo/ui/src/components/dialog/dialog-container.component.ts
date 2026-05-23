import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { cn } from '../../utils/cn';
import { DialogService, type DialogEntry } from '../../services/dialog.service';

/**
 * Renders all open dialogs managed by DialogService.
 * Place once in the root app template: `<ui-dialog-container />`
 */
@Component({
  selector: 'ui-dialog-container',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @for (entry of dialogService.dialogs(); track entry.id) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Centering wrapper -->
      <div
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        (click)="onBackdropClick(entry)"
      >
        <!-- Content box -->
        <div [class]="getContentClass(entry)" (click)="$event.stopPropagation()">
          <ng-container *ngComponentOutlet="entry.component; injector: entry.injector" />
        </div>
      </div>
    }
  `,
})
export class DialogContainerComponent {
  readonly dialogService = inject(DialogService);

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    const stack = this.dialogService.dialogs();
    if (stack.length === 0) return;
    const top = stack[stack.length - 1];
    if (top.config.closeOnEscape) {
      top.ref.close();
    }
  }

  onBackdropClick(entry: DialogEntry): void {
    if (entry.config.closeOnBackdropClick) {
      entry.ref.close();
    }
  }

  getContentClass(entry: DialogEntry): string {
    return cn(
      'relative bg-background rounded-xl shadow-lg flex flex-col max-h-[85vh] overflow-hidden',
      '[&>*]:flex [&>*]:flex-col [&>*]:flex-1 [&>*]:min-h-0 [&>*]:overflow-hidden',
      entry.config.size === 'sm' && 'w-full max-w-sm',
      entry.config.size === 'default' && 'w-full max-w-lg',
      entry.config.size === 'lg' && 'w-full max-w-2xl',
      entry.config.size === 'xl' && 'w-full max-w-4xl',
      entry.config.size === 'full' && 'w-screen h-screen max-w-none rounded-none max-h-none',
      entry.config.panelClass,
    );
  }
}
