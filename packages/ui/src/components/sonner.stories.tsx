import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';
import { Toaster } from './sonner';
import { Button } from './button';

const meta: Meta = { title: 'Components/Feedback/Sonner', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const WithToaster = ({ children }: { children: React.ReactNode }) => (
  <div>
    {children}
    <Toaster />
  </div>
);

export const Default: Story = {
  render: () => (
    <WithToaster>
      <Button onClick={() => toast('Event has been created')}>Show toast</Button>
    </WithToaster>
  ),
};

export const Success: Story = {
  render: () => (
    <WithToaster>
      <Button onClick={() => toast.success('Changes saved')}>Success toast</Button>
    </WithToaster>
  ),
};

export const Error: Story = {
  render: () => (
    <WithToaster>
      <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>Error toast</Button>
    </WithToaster>
  ),
};
