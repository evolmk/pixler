import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number; // 0–100
  error?: string;
}

// ── Drop Zone ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '(dragover)': '$event.preventDefault(); _dragging.set(true)',
    '(dragleave)': '_dragging.set(false)',
    '(drop)': '_onDrop($event)',
  },
  template: `
    <input
      #fileInput
      type="file"
      class="sr-only"
      [accept]="accept()"
      [multiple]="multiple()"
      (change)="_onFileInput($event)"
    />

    <div class="flex flex-col items-center gap-2 text-center pointer-events-none">
      <!-- Cloud upload icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
      <p class="text-sm font-medium text-foreground">
        <button
          type="button"
          class="cursor-pointer text-primary underline-offset-2 hover:underline pointer-events-auto"
          (click)="fileInput.click()"
        >
          Click to upload
        </button>
        &nbsp;or drag and drop
      </p>
      @if (hint()) {
        <p class="text-xs text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class FileUploadComponent {
  readonly accept = input<string>('');
  readonly multiple = input<boolean>(true);
  readonly maxSizeMb = input<number | null>(null);
  readonly hint = input<string>('');
  readonly class = input<string>('');

  readonly filesSelected = output<File[]>();

  protected readonly _dragging = signal(false);

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors',
      this._dragging() ? 'border-primary bg-primary/5' : 'border-input hover:border-muted-foreground hover:bg-muted/30',
      this.class(),
    ),
  );

  protected _onDrop(event: DragEvent): void {
    event.preventDefault();
    this._dragging.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    this._emit(files);
  }

  protected _onFileInput(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this._emit(files);
  }

  private _emit(files: File[]): void {
    const maxBytes = this.maxSizeMb() != null ? this.maxSizeMb()! * 1024 * 1024 : Infinity;
    const valid = files.filter((f) => f.size <= maxBytes);
    if (valid.length) this.filesSelected.emit(valid);
  }
}

// ── Upload Progress Row ───────────────────────────────────────────────────────

@Component({
  selector: 'ui-file-upload-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex flex-col gap-1"' },
  template: `
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="truncate text-foreground">{{ file().name }}</span>
      <div class="flex items-center gap-1 shrink-0">
        @if (file().error) {
          <span class="text-destructive text-xs">{{ file().error }}</span>
        } @else {
          <span class="tabular-nums text-muted-foreground">{{ file().progress }}%</span>
        }
        <button
          type="button"
          (click)="remove.emit()"
          aria-label="Remove file"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
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
      </div>
    </div>
    <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        class="h-full rounded-full transition-all duration-300"
        [class]="file().error ? 'bg-destructive' : 'bg-primary'"
        [style.width.%]="file().progress"
      ></div>
    </div>
  `,
})
export class FileUploadProgressComponent {
  readonly file = input.required<UploadedFile>();
  readonly remove = output<void>();
  /** Two-way bind to update progress externally */
  readonly fileChange = model<UploadedFile | null>(null);
}
