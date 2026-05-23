// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ToggleCountComponent } from './toggle-count.component';

const meta: Meta<ToggleCountComponent> = {
  title: 'Forms/ToggleCount',
  component: ToggleCountComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<ToggleCountComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleCountComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2"><span class="text-sm">sm</span><ui-toggle-count [value]="3" size="sm" /></div>
            <div class="flex items-center gap-2"><span class="text-sm">default</span><ui-toggle-count [value]="3" size="default" /></div>
            <div class="flex items-center gap-2"><span class="text-sm">lg</span><ui-toggle-count [value]="3" size="lg" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2"><span class="text-sm">at min</span><ui-toggle-count [value]="0" [min]="0" [max]="5" /></div>
            <div class="flex items-center gap-2"><span class="text-sm">at max</span><ui-toggle-count [value]="5" [min]="0" [max]="5" /></div>
            <div class="flex items-center gap-2"><span class="text-sm">disabled</span><ui-toggle-count [value]="2" [disabled]="true" /></div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ToggleCountComponent] },
    props: args,
    template: `<ui-toggle-count [value]="value" [min]="min" [max]="max" [step]="step" [size]="size" [disabled]="disabled" />`,
  }),
  args: { value: 1, min: 0, max: 10, step: 1, size: 'default', disabled: false },
};

// ── With Min / Max ────────────────────────────────────────────────────────────

export const WithMinMax: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleCountComponent] },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <span class="text-sm w-32 text-muted-foreground">Quantity (1–5):</span>
          <ui-toggle-count [value]="1" [min]="1" [max]="5" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm w-32 text-muted-foreground">At minimum:</span>
          <ui-toggle-count [value]="0" [min]="0" [max]="10" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm w-32 text-muted-foreground">At maximum:</span>
          <ui-toggle-count [value]="10" [min]="0" [max]="10" />
        </div>
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleCountComponent] },
    template: `
      <div class="flex items-center gap-4">
        <ui-toggle-count [value]="3" size="sm" />
        <ui-toggle-count [value]="3" size="default" />
        <ui-toggle-count [value]="3" size="lg" />
      </div>
    `,
  }),
};
