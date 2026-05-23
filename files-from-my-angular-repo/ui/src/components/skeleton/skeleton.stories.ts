// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Feedback/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<SkeletonComponent>;

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonComponent] },
    template: `<ui-skeleton class="h-4 w-48" />`,
  }),
};

// ── Card Skeleton ─────────────────────────────────────────────────────────────

export const CardSkeleton: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonComponent] },
    template: `
      <div class="flex flex-col gap-3 p-4 border rounded-xl w-64">
        <ui-skeleton class="h-40 w-full rounded-lg" />
        <ui-skeleton class="h-4 w-3/4" />
        <ui-skeleton class="h-3 w-full" />
        <ui-skeleton class="h-3 w-5/6" />
      </div>
    `,
  }),
};

// ── List Skeleton ─────────────────────────────────────────────────────────────

export const ListSkeleton: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonComponent] },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        @for (i of [1,2,3]; track i) {
          <div class="flex items-center gap-3">
            <ui-skeleton class="h-10 w-10 rounded-full shrink-0" />
            <div class="flex flex-col gap-2 flex-1">
              <ui-skeleton class="h-3 w-3/4" />
              <ui-skeleton class="h-3 w-1/2" />
            </div>
          </div>
        }
      </div>
    `,
  }),
};

// ── Avatar Skeleton ───────────────────────────────────────────────────────────

export const AvatarSkeleton: Story = {
  render: () => ({
    moduleMetadata: { imports: [SkeletonComponent] },
    template: `
      <div class="flex items-center gap-3">
        <ui-skeleton class="h-12 w-12 rounded-full" />
        <div class="flex flex-col gap-2">
          <ui-skeleton class="h-3 w-32" />
          <ui-skeleton class="h-3 w-24" />
        </div>
      </div>
    `,
  }),
};
