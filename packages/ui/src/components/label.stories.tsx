import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'Components/Forms/Label',
  component: Label,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: 'Label text' } };
export const ForInput: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="email">Email</Label>
      <input id="email" type="email" placeholder="you@example.com" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" />
    </div>
  ),
};
