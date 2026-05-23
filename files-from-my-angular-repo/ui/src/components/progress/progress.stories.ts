// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ProgressComponent } from './progress.component';

const meta: Meta<ProgressComponent> = {
  title: 'Feedback/Progress',
  component: ProgressComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'accent'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    shape: {
      control: 'select',
      options: ['default', 'square', 'pill'],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    indeterminate: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ProgressComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressComponent] },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">default</span><ui-progress [value]="75" variant="default" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">accent</span><ui-progress [value]="60" variant="accent" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">destructive</span><ui-progress [value]="40" variant="destructive" class="flex-1" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">sm</span><ui-progress [value]="65" size="sm" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">default</span><ui-progress [value]="65" size="default" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">lg</span><ui-progress [value]="65" size="lg" class="flex-1" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">default</span><ui-progress [value]="50" shape="default" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">square</span><ui-progress [value]="50" shape="square" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-xs text-muted-foreground w-20">pill</span><ui-progress [value]="50" shape="pill" class="flex-1" /></div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ProgressComponent] },
    props: args,
    template: `<ui-progress [value]="value" [variant]="variant" [size]="size" [shape]="shape" [indeterminate]="indeterminate" class="max-w-sm" />`,
  }),
  args: { value: 60, variant: 'default', size: 'default', shape: 'default', indeterminate: false },
};

// ── Indeterminate ─────────────────────────────────────────────────────────────

export const Indeterminate: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressComponent] },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <p class="text-sm text-muted-foreground">Loading…</p>
        <ui-progress [indeterminate]="true" />
      </div>
    `,
  }),
};
