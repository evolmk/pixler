// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TogglePasswordComponent } from './toggle-password.component';

const meta: Meta<TogglePasswordComponent> = {
  title: 'Forms/TogglePassword',
  component: TogglePasswordComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<TogglePasswordComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [TogglePasswordComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3 w-64">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-toggle-password size="sm" placeholder="Small" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-toggle-password size="default" placeholder="Default" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-toggle-password size="lg" placeholder="Large" class="flex-1" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Disabled</p>
          <ui-toggle-password value="secret123" [disabled]="true" class="w-64" />
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [TogglePasswordComponent] },
    props: args,
    template: `<ui-toggle-password [placeholder]="placeholder" [size]="size" [disabled]="disabled" class="w-72" />`,
  }),
  args: { placeholder: 'Password', size: 'default', disabled: false },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [TogglePasswordComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <ui-toggle-password size="sm" placeholder="Small" class="w-64" />
        <ui-toggle-password size="default" placeholder="Default" class="w-64" />
        <ui-toggle-password size="lg" placeholder="Large" class="w-64" />
      </div>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [TogglePasswordComponent] },
    template: `<ui-toggle-password value="secret123" [disabled]="true" class="w-72" />`,
  }),
};
