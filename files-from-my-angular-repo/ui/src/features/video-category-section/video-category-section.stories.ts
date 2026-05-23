// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage } from '../../utils/placeholder';
import { VideoCategorySectionComponent } from './video-category-section.component';

/**
 * VideoCategorySection component — grid of video thumbnails for a single category.
 *
 * Provide `category` as a `VideoCategory` with `id`, `name`, and `videos: VideoItem[]`.
 * Renders the category heading (with video count) and a responsive 2–6 column grid of
 * `ui-video-thumbnail-card` items. Emits `videoClick` with the clicked `VideoItem`.
 */
const meta: Meta<VideoCategorySectionComponent> = {
  title: 'Features/VideoCategorySection',
  component: VideoCategorySectionComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<VideoCategorySectionComponent>;

const videoCategorySectionImports = [VideoCategorySectionComponent];

const sampleCategory = {
  id: 'cappers',
  name: 'Capping Machines',
  videos: [
    {
      id: 'v1',
      name: 'Servo Capper 500 Overview',
      thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '16A34A', fg: 'ffffff', text: 'SC 500' }),
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'v2',
      name: 'Installation Guide — SC 500',
      thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '3b82f6', fg: 'ffffff', text: 'Install' }),
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'v3',
      name: 'Torque Adjustment Tutorial',
      thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: '8b5cf6', fg: 'ffffff', text: 'Torque' }),
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 'v4',
      name: 'Cap Changeover Procedure',
      thumbnailUrl: placeholderImage({ width: 320, ratio: '16:9', bg: 'f59e0b', fg: 'ffffff', text: 'Changeover' }),
      youtubeId: 'dQw4w9WgXcQ',
    },
  ],
};

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: videoCategorySectionImports },
    props: { category: sampleCategory },
    template: `<ui-video-category-section [category]="category" />`,
  }),
};

export const SingleVideo: Story = {
  render: () => ({
    moduleMetadata: { imports: videoCategorySectionImports },
    props: {
      category: {
        id: 'featured',
        name: 'Featured',
        videos: [sampleCategory.videos[0]],
      },
    },
    template: `<ui-video-category-section [category]="category" />`,
  }),
};
