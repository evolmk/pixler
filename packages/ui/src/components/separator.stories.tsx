import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta = { title: 'Components/Layout/Separator', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <p className="text-sm font-medium">Above</p>
      <Separator />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
