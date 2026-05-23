import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ui-pdf-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[1200] flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" (click)="close()"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-5xl h-[90vh] mx-4 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 shrink-0"
          >
            <h3 class="text-sm font-semibold text-gray-900 truncate pr-4">
              {{ title() || 'PDF Document' }}
            </h3>
            <div class="flex items-center gap-2 shrink-0">
              <a
                [href]="rawUrl()"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open
              </a>
              <a
                [href]="rawUrl()"
                download
                class="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                (click)="close()"
              >
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- PDF iframe -->
          <div class="flex-1 bg-gray-100">
            <iframe
              [src]="url()"
              class="w-full h-full border-0"
              [title]="title() || 'PDF Document'"
            ></iframe>
          </div>
        </div>
      </div>
    }
  `,
})
export class PdfViewerComponent {
  readonly open = model<boolean>(false);
  readonly url = input<SafeResourceUrl>('');
  readonly rawUrl = input<string>('');
  readonly title = input<string>('');
  readonly closed = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
