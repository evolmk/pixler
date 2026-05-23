import { Component, Input, Output, EventEmitter } from '@angular/core';
import { type VideoItem } from '../video-player/video-player.component';

@Component({
  selector: 'ui-video-thumbnail-card',
  standalone: true,
  imports: [],
  template: `
    <div
      class="group h-full flex flex-col cursor-pointer focus:outline-2 focus:outline-ring focus:outline-offset-2 rounded-lg"
      role="button"
      tabindex="0"
      [attr.aria-label]="'Play video: ' + video.name"
      (click)="onClick()"
      (keydown.enter)="onClick()"
      (keydown.space)="$event.preventDefault(); onClick()"
    >
      <!-- Thumbnail -->
      <div class="relative aspect-video rounded-lg overflow-hidden bg-muted">
        @if (video.thumbnailUrl) {
          <img
            [src]="video.thumbnailUrl"
            [alt]="video.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        } @else {
          <div class="w-full h-full bg-muted"></div>
        }

        <!-- Hover scrim + play icon -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40"
        >
          <svg
            class="w-12 h-12 text-white drop-shadow-lg opacity-0 scale-90 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <!-- Duration badge (optional future use) -->
      </div>

      <!-- Title -->
      <p class="mt-2.5 text-sm font-medium text-foreground leading-snug line-clamp-2">
        {{ video.name }}
      </p>
    </div>
  `,
})
export class VideoThumbnailCardComponent {
  @Input() video!: VideoItem;
  @Output() videoClick = new EventEmitter<VideoItem>();

  onClick(): void {
    this.videoClick.emit(this.video);
  }
}
