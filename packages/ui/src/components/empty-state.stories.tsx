import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty-state';
import { Button } from './button';
import { Inbox, Search, FolderOpen } from 'lucide-react';

const meta: Meta<typeof EmptyState> = { title: 'Components/Pixler/EmptyState', component: EmptyState, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const WithIcon: Story = {
  args: {
    icon: Inbox,
    title: 'No messages',
    body: 'Get started by creating your first message.',
    action: <Button size="sm">New message</Button>,
  },
};

export const SearchEmpty: Story = {
  args: { icon: Search, title: 'No results found', body: 'Try adjusting your search or filters.' },
};

export const NoAction: Story = {
  args: { icon: FolderOpen, title: 'No projects yet', body: 'Projects you create will appear here.' },
};

export const NoIcon: Story = {
  args: { title: 'Nothing here', body: 'Content will show up once added.' },
};
