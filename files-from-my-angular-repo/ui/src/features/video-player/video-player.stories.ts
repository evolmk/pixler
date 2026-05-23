// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { VideoPlayerComponent } from './video-player.component';

/**
 * VideoPlayer component — YouTube/video dialog player with playlist navigation.
 *
 * Provide `video` (required `VideoItem`) with `youtubeId` or `videoUrl`.
 * Pass `videos` array for playlist navigation (Previous/Next footer buttons appear
 * when `videos.length > 1`). Two-way bind `[(open)]`. Emits `closed` on dismiss.
 * Uses `DomSanitizer` internally to create safe YouTube embed URLs.
 */
const meta: Meta<VideoPlayerComponent> = {
  title: 'Features/VideoPlayer',
  component: VideoPlayerComponent,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the video player dialog is open',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: { open: true },
};

export default meta;
type Story = StoryObj<VideoPlayerComponent>;

const videoPlayerImports = [VideoPlayerComponent];

const singleVideo = {
  id: 'v1',
  name: 'Servo Capper 500 Overview',
  desc: 'Full product overview and key features.',
  youtubeId: 'dQw4w9WgXcQ',
};

const playlistVideos = [
  { id: 'v1', name: 'Servo Capper 500 Overview', youtubeId: 'dQw4w9WgXcQ' },
  { id: 'v2', name: 'Installation Guide', youtubeId: 'dQw4w9WgXcQ' },
  { id: 'v3', name: 'Torque Adjustment Tutorial', youtubeId: 'dQw4w9WgXcQ' },
];

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: videoPlayerImports },
    props: { ...args, video: singleVideo },
    template: `
      <p class="text-sm text-muted-foreground mb-3">Video player opens as a dialog (toggle "open" in controls).</p>
      <ui-video-player [open]="open" [video]="video" />`,
  }),
};

export const WithPlaylist: Story = {
  render: (args) => ({
    moduleMetadata: { imports: videoPlayerImports },
    props: { ...args, video: playlistVideos[0], videos: playlistVideos },
    template: `
      <ui-video-player [open]="open" [video]="video" [videos]="videos" />`,
  }),
};
