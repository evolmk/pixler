// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SegmentedComponent } from './segmented.component';

const meta: Meta<SegmentedComponent> = {
  title: 'Forms/Segmented',
  component: SegmentedComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<SegmentedComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SegmentedComponent] },
    props: {
      options: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'map', label: 'Map' },
      ],
    },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-segmented [options]="options" size="sm" value="list"></ui-segmented></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-segmented [options]="options" size="default" value="list"></ui-segmented></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-segmented [options]="options" size="lg" value="list"></ui-segmented></div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [SegmentedComponent] },
    props: {
      options: [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ],
      value: 'week',
    },
    template: `<ui-segmented [options]="options" [(value)]="value"></ui-segmented>`,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [SegmentedComponent] },
    props: {
      options: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'map', label: 'Map' },
      ],
    },
    template: `
      <div class="flex flex-col gap-4">
        <ui-segmented [options]="options" size="sm" value="list"></ui-segmented>
        <ui-segmented [options]="options" size="default" value="list"></ui-segmented>
        <ui-segmented [options]="options" size="lg" value="list"></ui-segmented>
      </div>
    `,
  }),
};

// ── With Disabled Option ──────────────────────────────────────────────────────

export const WithDisabledOption: Story = {
  render: () => ({
    moduleMetadata: { imports: [SegmentedComponent] },
    props: {
      options: [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'enterprise', label: 'Enterprise', disabled: true },
      ],
      value: 'pro',
    },
    template: `<ui-segmented [options]="options" [(value)]="value"></ui-segmented>`,
  }),
};

// ── Status Toggle ─────────────────────────────────────────────────────────────

export const StatusToggle: Story = {
  render: () => ({
    moduleMetadata: { imports: [SegmentedComponent] },
    props: {
      options: [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
      ],
      value: 'all',
    },
    template: `<ui-segmented [options]="options" [(value)]="value"></ui-segmented>`,
  }),
};
