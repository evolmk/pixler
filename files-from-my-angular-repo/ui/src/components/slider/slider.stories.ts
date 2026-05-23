// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SliderComponent } from './slider.component';

const meta: Meta<SliderComponent> = {
  title: 'Forms/Slider',
  component: SliderComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<SliderComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Horizontal (default)</p>
          <ui-slider [value]="40" class="w-64" />
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertical</p>
          <div class="flex items-center gap-8 h-32">
            <ui-slider [value]="30" orientation="vertical" class="h-full" />
            <ui-slider [value]="60" orientation="vertical" class="h-full" />
            <ui-slider [value]="90" orientation="vertical" class="h-full" />
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [SliderComponent] },
    props: args,
    template: `<ui-slider [value]="value" [min]="min" [max]="max" [step]="step" class="w-64" />`,
  }),
  args: { value: 40, min: 0, max: 100, step: 1 },
};

// ── With Steps ────────────────────────────────────────────────────────────────

export const WithSteps: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderComponent] },
    template: `
      <div class="flex flex-col gap-4 w-64">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Step: 10</p>
          <ui-slider [value]="50" [min]="0" [max]="100" [step]="10" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Step: 25</p>
          <ui-slider [value]="25" [min]="0" [max]="100" [step]="25" />
        </div>
      </div>
    `,
  }),
};

// ── Custom Range ──────────────────────────────────────────────────────────────

export const CustomRange: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderComponent] },
    template: `
      <div class="flex flex-col gap-2 w-64">
        <p class="text-sm text-muted-foreground">Volume (0–11)</p>
        <ui-slider [value]="7" [min]="0" [max]="11" [step]="1" />
      </div>
    `,
  }),
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [SliderComponent] },
    template: `
      <div class="flex items-center gap-8 h-40">
        <ui-slider [value]="30" orientation="vertical" class="h-full" />
        <ui-slider [value]="60" orientation="vertical" class="h-full" />
        <ui-slider [value]="90" orientation="vertical" class="h-full" />
      </div>
    `,
  }),
};
