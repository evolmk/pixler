import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoThumbnailCardComponent } from '../video-thumbnail-card/video-thumbnail-card.component';
import { type VideoItem } from '../video-player/video-player.component';

export interface VideoCategory {
  id: string;
  name: string;
  videos: VideoItem[];
}

@Component({
  selector: 'ui-video-category-section',
  standalone: true,
  imports: [VideoThumbnailCardComponent],
  template: `
    <section>
      <!-- Category Header -->
      <div class="mb-6 pb-3 border-b border-gray-200">
        <h2 class="text-2xl md:text-xl font-bold text-gray-900 flex items-baseline gap-3">
          {{ category.name }}
          <span class="text-lg md:text-base font-normal text-gray-400">{{ category.videos.length }}</span>
        </h2>
      </div>

      <!-- Video Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
        @for (video of category.videos; track video.id) {
          <ui-video-thumbnail-card [video]="video" (videoClick)="onVideoClick($event)" />
        }
      </div>
    </section>
  `,
})
export class VideoCategorySectionComponent {
  @Input() category!: VideoCategory;
  @Output() videoClick = new EventEmitter<VideoItem>();

  onVideoClick(video: VideoItem): void {
    this.videoClick.emit(video);
  }
}
