// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { RatingsComponent } from './ratings.component';

const meta: Meta<RatingsComponent> = {
  title: 'Forms/Ratings',
  component: RatingsComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    count: { control: { type: 'range', min: 3, max: 10, step: 1 } },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    readonly: { control: 'boolean' },
    allowClear: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<RatingsComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingsComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-ratings [value]="4" size="sm" [readonly]="true" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-ratings [value]="4" size="default" [readonly]="true" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-ratings [value]="4" size="lg" [readonly]="true" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-sm w-20">interactive</span><ui-ratings [value]="3" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">readonly</span><ui-ratings [value]="3" [readonly]="true" /></div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [RatingsComponent] },
    props: args,
    template: `<ui-ratings [value]="value" [count]="count" [size]="size" [readonly]="readonly" [allowClear]="allowClear" />`,
  }),
  args: { value: 3, count: 5, size: 'default', readonly: false, allowClear: true },
};

// ── Read Only ─────────────────────────────────────────────────────────────────

export const ReadOnly: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingsComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <ui-ratings [value]="5" [readonly]="true" />
          <span class="text-sm text-muted-foreground">5 stars</span>
        </div>
        <div class="flex items-center gap-2">
          <ui-ratings [value]="3" [readonly]="true" />
          <span class="text-sm text-muted-foreground">3 stars</span>
        </div>
        <div class="flex items-center gap-2">
          <ui-ratings [value]="1" [readonly]="true" />
          <span class="text-sm text-muted-foreground">1 star</span>
        </div>
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [RatingsComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <ui-ratings [value]="4" size="sm" [readonly]="true" />
        <ui-ratings [value]="4" size="default" [readonly]="true" />
        <ui-ratings [value]="4" size="lg" [readonly]="true" />
      </div>
    `,
  }),
};
