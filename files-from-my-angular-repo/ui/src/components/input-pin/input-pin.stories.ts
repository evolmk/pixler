// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { InputPinComponent } from './input-pin.component';

const meta: Meta<InputPinComponent> = {
  title: 'Forms/InputPin',
  component: InputPinComponent,
  tags: ['autodocs'],
  argTypes: {
    length: { control: { type: 'range', min: 2, max: 8, step: 1 } },
    type: { control: 'select', options: ['text', 'number', 'password'] },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<InputPinComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputPinComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Types</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-sm w-20">text</span><ui-input-pin [length]="4" type="text" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">number</span><ui-input-pin [length]="4" type="number" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">password</span><ui-input-pin [length]="4" type="password" placeholder="●" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-input-pin [length]="4" size="sm" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-input-pin [length]="4" size="default" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-input-pin [length]="4" size="lg" /></div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default (4-cell) ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [InputPinComponent] },
    props: args,
    template: `<ui-input-pin [length]="length" [type]="type" [size]="size" [placeholder]="placeholder" />`,
  }),
  args: { length: 4, type: 'text', size: 'default', placeholder: '○' },
};

// ── 6-cell OTP ────────────────────────────────────────────────────────────────

export const SixCell: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputPinComponent] },
    template: `
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
        <ui-input-pin [length]="6" type="number" />
      </div>
    `,
  }),
};

// ── Masked ────────────────────────────────────────────────────────────────────

export const Masked: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputPinComponent] },
    template: `
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted-foreground">PIN entry (masked)</p>
        <ui-input-pin [length]="4" type="password" placeholder="●" />
      </div>
    `,
  }),
};
