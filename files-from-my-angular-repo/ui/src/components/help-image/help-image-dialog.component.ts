import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { DIALOG_DATA } from '../dialog/dialog.tokens';
import { DialogRef } from '../dialog/dialog-ref';
import { DialogHeaderComponent, DialogTitleComponent, DialogBodyComponent } from '../dialog/dialog.component';

export interface HelpImageDialogData {
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'ui-help-image-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogHeaderComponent, DialogTitleComponent, DialogBodyComponent],
  template: `
    <ui-dialog-header [class]="'flex-row items-center justify-between !space-y-0'">
      <ui-dialog-title>{{ data.title }}</ui-dialog-title>
      <button
        type="button"
        class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none cursor-pointer"
        aria-label="Close"
        (click)="close()"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </ui-dialog-header>
    <ui-dialog-body>
      <div class="flex items-center justify-center p-4">
        <img [src]="data.imageUrl" [alt]="data.title" class="max-w-full h-auto rounded" />
      </div>
    </ui-dialog-body>
  `,
})
export class HelpImageDialogComponent {
  readonly data = inject(DIALOG_DATA) as HelpImageDialogData;
  private readonly dialogRef = inject(DialogRef);

  close(): void {
    this.dialogRef.close();
  }
}
