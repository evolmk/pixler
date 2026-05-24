import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';

const meta: Meta = { title: 'Components/Layout/ScrollArea', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const tags = Array.from({ length: 50 }, (_, i) => `v1.${i + 1}.0`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border border-border p-4">
      <div className="space-y-1">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <p className="text-sm">{tag}</p>
            <Separator className="my-1" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
