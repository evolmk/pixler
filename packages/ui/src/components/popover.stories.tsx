import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

const meta: Meta = { title: 'Components/Overlay/Popover', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="text-sm">Popover content. Click outside to close.</p>
      </PopoverContent>
    </Popover>
  ),
};
