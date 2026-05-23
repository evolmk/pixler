// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { StrongPasswordComponent } from './strong-password.component';

const meta: Meta<StrongPasswordComponent> = {
  title: 'Forms/StrongPassword',
  component: StrongPasswordComponent,
  tags: ['autodocs'],
  argTypes: {
    showLabel: { control: 'boolean' },
    showRules: { control: 'boolean' },
    value: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<StrongPasswordComponent>;

// ── Weak ──────────────────────────────────────────────────────────────────────

export const Weak: Story = {
  render: () => ({
    moduleMetadata: { imports: [StrongPasswordComponent] },
    template: `<ui-strong-password value="abc" class="w-72" />`,
  }),
};

// ── Medium ────────────────────────────────────────────────────────────────────

export const Medium: Story = {
  render: () => ({
    moduleMetadata: { imports: [StrongPasswordComponent] },
    template: `<ui-strong-password value="Abc1234" class="w-72" />`,
  }),
};

// ── Strong ────────────────────────────────────────────────────────────────────

export const Strong: Story = {
  render: () => ({
    moduleMetadata: { imports: [StrongPasswordComponent] },
    template: `<ui-strong-password value="Abc1234!@#" class="w-72" />`,
  }),
};

// ── Without Rules List ────────────────────────────────────────────────────────

export const WithoutRules: Story = {
  render: () => ({
    moduleMetadata: { imports: [StrongPasswordComponent] },
    template: `<ui-strong-password value="Abc1234!" [showRules]="false" class="w-72" />`,
  }),
};
