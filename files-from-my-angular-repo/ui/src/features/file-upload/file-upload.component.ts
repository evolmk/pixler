import { ChangeDetectionStrategy, Component, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ProgressComponent } from '../../components/progress';
import { FileUploadService } from './file-upload.service';
import { UploadType, UploadQueueItem, UploadResultEvent, UploadErrorEvent } from './file-upload.types';

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  imports: [ProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Dropzone -->
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
      [class.border-gray-300]="!dragOver()"
      [class.bg-gray-50]="!dragOver()"
      [class.border-brand]="dragOver()"
      [class.bg-brand/5]="dragOver()"
      [class.opacity-50]="disabled()"
      [class.pointer-events-none]="disabled()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        class="hidden"
        [multiple]="allowMultiple()"
        [accept]="accept()"
        (change)="onFileSelected($event)"
      />

      <!-- Upload icon -->
      <svg
        class="mx-auto w-10 h-10 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        />
      </svg>
      <p class="text-sm text-gray-600 mb-1">Drag & drop files here or click to browse</p>
      <p class="text-xs text-gray-400">Max file size: {{ maxFileSizeMb() }}MB</p>
    </div>

    <!-- Upload Queue -->
    @if (queue().length > 0) {
      <div class="mt-4 space-y-2">
        @for (item of queue(); track item.file.name + $index) {
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <!-- File icon -->
            <svg
              class="w-5 h-5 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              @if (isImage(item.file)) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z"
                />
              } @else if (isPdf(item.file)) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              }
            </svg>

            <!-- File info + progress -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ item.file.name }}</p>
              <p class="text-xs text-gray-400">{{ formatSize(item.file.size) }}</p>
              @if (item.status === 'uploading' || item.status === 'confirming') {
                <ui-progress [value]="item.progress" size="sm" color="default" class="mt-1" />
              }
            </div>

            <!-- Status -->
            <div class="shrink-0">
              @switch (item.status) {
                @case ('pending') {
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                @case ('uploading') {
                  <span class="text-xs text-brand font-medium">{{ item.progress }}%</span>
                }
                @case ('confirming') {
                  <svg
                    class="w-5 h-5 text-brand animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                }
                @case ('complete') {
                  <svg
                    class="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                @case ('error') {
                  <svg
                    class="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <title>{{ item.error ?? 'Upload failed' }}</title>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                }
              }
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class FeaturesFileUploadComponent {
  private readonly uploadService = inject(FileUploadService);

  readonly uploadType = input<UploadType>('doc');
  readonly allowMultiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly maxFileSizeMb = input<number>(50);
  readonly accept = input<string>('*');
  /** Optional group ID to assign to the created record on upload confirm. */
  readonly group = input<string>('');

  readonly uploadComplete = output<UploadResultEvent>();
  readonly uploadError = output<UploadErrorEvent>();

  readonly dragOver = signal(false);
  readonly queue = signal<UploadQueueItem[]>([]);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files) this.addFiles(files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
      input.value = '';
    }
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  isPdf(file: File): boolean {
    return file.type === 'application/pdf';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private addFiles(fileList: FileList): void {
    const first = fileList[0];
    const files: File[] = this.allowMultiple() ? Array.from(fileList) : first ? [first] : [];
    const maxBytes = this.maxFileSizeMb() * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxBytes) {
        this.uploadError.emit({
          file,
          error: `File exceeds ${this.maxFileSizeMb()}MB limit`,
        });
        continue;
      }

      const item: UploadQueueItem = { file, progress: 0, status: 'pending' };
      this.queue.update((q) => [...q, item]);
      void this.processUpload(item, this.queue().length - 1);
    }
  }

  private async processUpload(item: UploadQueueItem, index: number): Promise<void> {
    this.updateQueueItem(index, { status: 'uploading', progress: 0 });

    try {
      const grp = this.group();
      const result = await this.uploadService.uploadFile(
        item.file,
        this.uploadType(),
        (percent) => this.updateQueueItem(index, { progress: percent }),
        grp ? { group: grp } : undefined,
      );

      this.updateQueueItem(index, {
        status: 'complete',
        progress: 100,
        key: result.key,
        record: result.record,
      });

      this.uploadComplete.emit({
        key: result.key,
        url: result.url,
        file: item.file,
        record: result.record,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      this.updateQueueItem(index, { status: 'error', error: message });
      this.uploadError.emit({ file: item.file, error: message });
    }
  }

  private updateQueueItem(index: number, updates: Partial<UploadQueueItem>): void {
    this.queue.update((q) => q.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  }
}
