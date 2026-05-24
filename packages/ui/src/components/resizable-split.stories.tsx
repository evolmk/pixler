import type { Meta, StoryObj } from '@storybook/react';
import { ResizableSplit } from './resizable-split';

const meta: Meta = { title: 'Components/Pixler/ResizableSplit', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <div className="h-[300px] w-full max-w-[600px] rounded-lg border border-border overflow-hidden">
      <ResizableSplit direction="horizontal">
        <div className="flex h-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">Left panel</div>
        <div className="flex h-full items-center justify-center bg-muted/10 text-sm text-muted-foreground">Right panel</div>
      </ResizableSplit>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-[300px] w-full max-w-[400px] rounded-lg border border-border overflow-hidden">
      <ResizableSplit direction="vertical">
        <div className="flex h-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">Top panel</div>
        <div className="flex h-full items-center justify-center bg-muted/10 text-sm text-muted-foreground">Bottom panel</div>
      </ResizableSplit>
    </div>
  ),
};
