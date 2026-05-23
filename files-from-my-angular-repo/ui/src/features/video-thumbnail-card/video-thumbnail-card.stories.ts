// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage } from '../../utils/placeholder';
import { VideoThumbnailCardComponent } from './video-thumbnail-card.component';

/**
 * VideoThumbnailCard component — clickable video thumbnail with play overlay.
 *
 * Provide `video` as a `VideoItem` with `name` and optional `thumbnailUrl`.
 * Renders a 16:9 thumbnail with a play button overlay and a title below.
 * Emits `videoClick` with the `VideoItem` on click or Enter/Space keyboard press.
 * Use inside a grid for the video library / category section layout.
 */
const meta: Meta<VideoThumbnailCardComponent> = {
  title: 'Features/VideoThumbnailCard',
  component: VideoThumbnailCardComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<VideoThumbnailCardComponent>;

const videoThumbnailImports = [VideoThumbnailCardComponent];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: videoThumbnailImports },
    props: {
      video: {
        id: 'v1',
        name: 'Servo Capper 500 — Full Product Overview',
        thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '16A34A', fg: 'ffffff', text: 'SC 500' }),
        youtubeId: 'dQw4w9WgXcQ',
      },
    },
    template: `<ui-video-thumbnail-card [video]="video" class="max-w-xs" />`,
  }),
};

export const NoThumbnail: Story = {
  render: () => ({
    moduleMetadata: { imports: videoThumbnailImports },
    props: {
      video: { id: 'v2', name: 'Installation Guide — No Thumbnail Available' },
    },
    template: `<ui-video-thumbnail-card [video]="video" class="max-w-xs" />`,
  }),
};

export const Grid: Story = {
  render: () => ({
    moduleMetadata: { imports: videoThumbnailImports },
    props: {
      videos: [
        {
          id: 'v1',
          name: 'Servo Capper 500 Overview',
          thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '16A34A', fg: 'ffffff', text: 'SC 500' }),
        },
        {
          id: 'v2',
          name: 'Installation Guide',
          thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '3b82f6', fg: 'ffffff', text: 'Install' }),
        },
        {
          id: 'v3',
          name: 'Torque Adjustment',
          thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '8b5cf6', fg: 'ffffff', text: 'Torque' }),
        },
        {
          id: 'v4',
          name: 'Cap Changeover',
          thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: 'f59e0b', fg: 'ffffff', text: 'Changeover' }),
        },
      ],
    },
    template: `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        @for (video of videos; track video.id) {
          <ui-video-thumbnail-card [video]="video" />
        }
      </div>`,
  }),
};
