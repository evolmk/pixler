// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { LegendIndicatorComponent } from './legend-indicator.component';

const meta: Meta<LegendIndicatorComponent> = {
  title: 'Display/LegendIndicator',
  component: LegendIndicatorComponent,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'radio', options: ['circle', 'square', 'line'] },
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<LegendIndicatorComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [LegendIndicatorComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex flex-col gap-2">
            <ui-legend-indicator color="#3b82f6" shape="circle">Circle</ui-legend-indicator>
            <ui-legend-indicator color="#f59e0b" shape="square">Square</ui-legend-indicator>
            <ui-legend-indicator color="#ef4444" shape="line">Line</ui-legend-indicator>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-2">
            <ui-legend-indicator color="#3b82f6" size="sm">Small</ui-legend-indicator>
            <ui-legend-indicator color="#3b82f6" size="default">Default</ui-legend-indicator>
            <ui-legend-indicator color="#3b82f6" size="lg">Large</ui-legend-indicator>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [LegendIndicatorComponent] },
    props: args,
    template: `<ui-legend-indicator [color]="color" [shape]="shape" [size]="size">Revenue</ui-legend-indicator>`,
  }),
  args: { color: '#22c55e', shape: 'circle', size: 'default' },
};

// ── Chart Legend ──────────────────────────────────────────────────────────────

export const ChartLegend: Story = {
  render: () => ({
    moduleMetadata: { imports: [LegendIndicatorComponent] },
    template: `
      <div class="space-y-4">
        <p class="text-sm font-medium">Monthly Production — Q1 2026</p>
        <div class="flex flex-wrap gap-4">
          <ui-legend-indicator color="#22c55e" shape="circle">Rotary Cappers</ui-legend-indicator>
          <ui-legend-indicator color="#3b82f6" shape="circle">Inline Cappers</ui-legend-indicator>
          <ui-legend-indicator color="#f59e0b" shape="circle">Snap Cappers</ui-legend-indicator>
          <ui-legend-indicator color="#8b5cf6" shape="circle">Custom Orders</ui-legend-indicator>
        </div>
        <div class="flex flex-wrap gap-4">
          <ui-legend-indicator color="#22c55e" shape="line">Target</ui-legend-indicator>
          <ui-legend-indicator color="#94a3b8" shape="line">Actual</ui-legend-indicator>
        </div>
      </div>
    `,
  }),
};
