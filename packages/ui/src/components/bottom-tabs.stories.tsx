import type { Meta, StoryObj } from '@storybook/react';
import { BottomTabs } from './bottom-tabs';
import { useState } from 'react';
import { MessageSquare, FileText, GitPullRequest, CheckSquare } from 'lucide-react';

const meta: Meta = { title: 'Components/Pixler/BottomTabs', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const items = [
  { value: 'chat', label: 'Chat', icon: <MessageSquare /> },
  { value: 'plan', label: 'Plan', icon: <FileText /> },
  { value: 'pr', label: 'PR', icon: <GitPullRequest /> },
  { value: 'checks', label: 'Checks', icon: <CheckSquare /> },
];

export const Default: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const [tab, setTab] = useState('chat');
    return (
      <div className="relative h-[300px] bg-background">
        <p className="p-4 text-sm text-muted-foreground">
          BottomTabs renders only on &lt;md viewports. Use the Storybook viewport control to simulate mobile.
        </p>
        <BottomTabs items={items} value={tab} onChange={setTab} />
      </div>
    );
  },
};
