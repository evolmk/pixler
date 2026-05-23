import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnChanges,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogBodyComponent,
  DialogFooterComponent,
} from '../../components/dialog/dialog.component';

export interface VideoItem {
  id: string;
  name: string;
  desc?: string;
  pageUrl?: string;
  group?: string;
  groupName?: string;
  featured?: boolean;
  thumbnailUrl?: string;
  videoUrl?: string;
  youtubeId?: string;
}

export interface VideoPlayerData {
  video: VideoItem;
  videos?: VideoItem[];
  currentIndex?: number;
}

@Component({
  selector: 'ui-video-player',
  standalone: true,
  imports: [
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/80 animate-in fade-in-0 duration-200"
          (click)="close()"
        ></div>

        <!-- Content -->
        <div class="relative z-50 w-full max-w-4xl mx-4 bg-background border rounded-lg shadow-lg">
          <ui-dialog-header>
            <ui-dialog-title>{{ currentVideo().name }}</ui-dialog-title>
            <button
              type="button"
              class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              (click)="close()"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </ui-dialog-header>

          <ui-dialog-body class="!p-0">
            <div class="px-4 pt-4" [class.pb-4]="!hasNavigation()">
              @if (currentVideo().youtubeId && safeVideoUrl()) {
                <div class="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
                  <iframe
                    class="absolute inset-0 w-full h-full"
                    [src]="safeVideoUrl()"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              }

              @if (!currentVideo().youtubeId && currentVideo().videoUrl) {
                <div class="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
                  <video
                    class="absolute inset-0 w-full h-full"
                    controls
                    [src]="currentVideo().videoUrl"
                    [poster]="currentVideo().thumbnailUrl"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              }
            </div>
          </ui-dialog-body>

          @if (hasNavigation()) {
            <ui-dialog-footer class="!justify-between !mt-1">
              <button
                class="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="currentIdx() <= 0"
                (click)="navigate(-1)"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span class="text-sm font-medium text-gray-500">
                {{ currentIdx() + 1 }} / {{ videos().length }}
              </span>
              <button
                class="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="currentIdx() >= videos().length - 1"
                (click)="navigate(1)"
              >
                Next
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </ui-dialog-footer>
          }
        </div>
      </div>
    }
  `,
})
export class VideoPlayerComponent implements OnChanges {
  private readonly sanitizer = inject(DomSanitizer);

  readonly open = model<boolean>(false);
  readonly video = input.required<VideoItem>();
  readonly videos = input<VideoItem[]>([]);
  readonly startIndex = input<number>(0);
  readonly closed = output<void>();

  readonly currentIdx = signal(0);

  readonly currentVideo = computed(() => {
    const vids = this.videos();
    const idx = this.currentIdx();
    return vids.length > 0 ? (vids[idx] ?? this.video()) : this.video();
  });

  readonly hasNavigation = computed(() => this.videos().length > 1);

  readonly safeVideoUrl = computed<SafeResourceUrl | null>(() => {
    const vid = this.currentVideo();
    if (vid.youtubeId) {
      const url = `https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1&rel=0`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  });

  ngOnChanges(): void {
    this.currentIdx.set(this.startIndex());
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  navigate(direction: number): void {
    const newIndex = this.currentIdx() + direction;
    if (newIndex < 0 || newIndex >= this.videos().length) return;
    this.currentIdx.set(newIndex);
  }
}
