// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ColorPickerComponent } from './color-picker.component';

const meta: Meta<ColorPickerComponent> = {
  title: 'Forms/ColorPicker',
  component: ColorPickerComponent,
  tags: ['autodocs'],
  argTypes: {
    format: { control: 'select', options: ['hex', 'rgb', 'hsl'] },
    value: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<ColorPickerComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ColorPickerComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Formats</p>
          <div class="flex gap-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">hex</p>
              <ui-color-picker value="#3b82f6" format="hex" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">rgb</p>
              <ui-color-picker value="#22c55e" format="rgb" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">hsl</p>
              <ui-color-picker value="#ef4444" format="hsl" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default (Hex) ─────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ColorPickerComponent] },
    props: args,
    template: `<ui-color-picker [value]="value" [format]="format" />`,
  }),
  args: { value: '#3b82f6', format: 'hex' },
};

// ── With Presets ──────────────────────────────────────────────────────────────

export const WithPresets: Story = {
  render: () => ({
    moduleMetadata: { imports: [ColorPickerComponent] },
    props: {
      presets: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
    },
    template: `<ui-color-picker value="#22c55e" [presets]="presets" />`,
  }),
};

// ── RGB Format ────────────────────────────────────────────────────────────────

export const RGBFormat: Story = {
  render: () => ({
    moduleMetadata: { imports: [ColorPickerComponent] },
    template: `<ui-color-picker value="#6366f1" format="rgb" />`,
  }),
};
