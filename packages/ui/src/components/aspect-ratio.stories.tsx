import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta = { title: 'Components/Layout/AspectRatio', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const SixteenNine: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
        16 / 9
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1} className="bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
        1 / 1
      </AspectRatio>
    </div>
  ),
};
