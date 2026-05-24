import type { Meta, StoryObj } from '@storybook/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

const meta: Meta = { title: 'Components/Layout/Resizable', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] max-w-md rounded-lg border border-border">
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6 text-sm">Left</div></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6 text-sm">Right</div></ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup orientation="vertical" className="min-h-[200px] max-w-md rounded-lg border border-border">
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6 text-sm">Top</div></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6 text-sm">Bottom</div></ResizablePanel>
    </ResizablePanelGroup>
  ),
};
