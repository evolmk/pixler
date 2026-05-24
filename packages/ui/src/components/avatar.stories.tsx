import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta = {
  title: 'Components/Display/Avatar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken.jpg" alt="User" />
      <AvatarFallback>MK</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['size-6', 'size-8', 'size-10', 'size-12', 'size-16'] as const).map((sz) => (
        <Avatar key={sz} className={sz}>
          <AvatarFallback className="text-xs">AB</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
