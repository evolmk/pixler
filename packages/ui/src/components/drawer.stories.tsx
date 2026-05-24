import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';
import { Button } from './button';

const meta: Meta = { title: 'Components/Overlay/Drawer', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <p className="text-sm text-muted-foreground">Swipe down to dismiss.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
