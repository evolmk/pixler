// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { LabelComponent } from './label.directive';

const meta: Meta<LabelComponent> = {
  title: 'Forms/Label',
  component: LabelComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<LabelComponent>;

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [LabelComponent] },
    template: `<label uiLabel>Email address</label>`,
  }),
};

// ── Required ─────────────────────────────────────────────────────────────────

export const Required: Story = {
  render: () => ({
    moduleMetadata: { imports: [LabelComponent] },
    template: `
      <div class="flex flex-col gap-2">
        <label uiLabel [required]="true" for="email">Email address</label>
        <input id="email" type="email" class="border rounded px-3 py-1.5 text-sm w-64" placeholder="you@example.com" />
      </div>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [LabelComponent] },
    template: `
      <div class="flex flex-col gap-2">
        <label uiLabel for="disabled-input">Disabled field</label>
        <input id="disabled-input" type="text" disabled class="border rounded px-3 py-1.5 text-sm w-64 opacity-50 cursor-not-allowed" value="Cannot edit" />
      </div>
    `,
  }),
};
