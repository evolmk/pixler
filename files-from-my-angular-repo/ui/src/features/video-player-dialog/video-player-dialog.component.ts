import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { IconComponent } from '../../components/icon';
import { ButtonComponent } from '../../components/button';
import { DialogRef, DIALOG_DATA } from '../../components/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { type VideoItem } from '../video-player/video-player.component';

export interface VideoPlayerDialogData {
  video: VideoItem;
  videos?: VideoItem[];
  currentIndex?: number;
}

@Component({
  selector: 'ui-video-player-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <div class="flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900 m-0 flex-1 pr-4 truncate">{{ currentVideo.name }}</h2>
        <button class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
                (click)="close()" aria-label="Close video">
          <ui-icon [name]="XIcon" size="sm" class="text-gray-500" />
        </button>
      </div>

      <!-- Video -->
      <div class="px-4 pt-4" [class.pb-4]="!hasNavigation">
        @if (currentVideo.youtubeId && safeVideoUrl) {
          <div class="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe class="absolute inset-0 w-full h-full"
                    [src]="safeVideoUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
          </div>
        }

        @if (!currentVideo.youtubeId && currentVideo.videoUrl) {
          <div class="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <video class="absolute inset-0 w-full h-full" controls
                   [src]="currentVideo.videoUrl"
                   [poster]="currentVideo.thumbnailUrl">
              Your browser does not support the video tag.
            </video>
          </div>
        }
      </div>

      <!-- Navigation Footer -->
      @if (hasNavigation) {
        <div class="grid grid-cols-3 items-center px-4 py-3 mt-1">
          <div class="justify-self-start">
            <button uiButton variant="ghost"
                    [disabled]="currentIndex <= 0"
                    (click)="navigate(-1)">
              <ui-icon [name]="ChevronLeftIcon" [size]="18" class="mr-1" />
              Previous
            </button>
          </div>
          <span class="text-sm font-medium text-gray-500 justify-self-center">{{ currentIndex + 1 }} / {{ videos.length }}</span>
          <div class="justify-self-end">
            <button uiButton variant="ghost"
                    [disabled]="currentIndex >= videos.length - 1"
                    (click)="navigate(1)">
              Next
              <ui-icon [name]="ChevronRightIcon" [size]="18" class="ml-1" />
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class VideoPlayerDialogComponent {
  private dialogRef = inject(DialogRef);
  readonly data = inject(DIALOG_DATA) as VideoPlayerDialogData;
  private sanitizer = inject(DomSanitizer);

  protected readonly XIcon = X;
  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;

  safeVideoUrl: SafeResourceUrl | null = null;
  currentVideo: VideoItem;
  currentIndex: number;
  videos: VideoItem[];
  hasNavigation: boolean;

  constructor() {
    this.currentVideo = this.data.video;
    this.videos = this.data.videos || [];
    this.currentIndex = this.data.currentIndex ?? 0;
    this.hasNavigation = this.videos.length > 1;
    this.updateVideoUrl();
  }

  close(): void {
    this.dialogRef.close();
  }

  navigate(direction: number): void {
    const newIndex = this.currentIndex + direction;
    if (newIndex < 0 || newIndex >= this.videos.length) return;
    this.currentIndex = newIndex;
    this.currentVideo = this.videos[this.currentIndex];
    this.updateVideoUrl();
  }

  private updateVideoUrl(): void {
    if (this.currentVideo.youtubeId) {
      const url = `https://www.youtube.com/embed/${this.currentVideo.youtubeId}?autoplay=1&rel=0`;
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.safeVideoUrl = null;
    }
  }
}
