import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta = {
  title: 'Components/Navigation/Tabs',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account"><p className="text-sm text-muted-foreground p-2">Account settings panel.</p></TabsContent>
      <TabsContent value="password"><p className="text-sm text-muted-foreground p-2">Password change panel.</p></TabsContent>
    </Tabs>
  ),
};
