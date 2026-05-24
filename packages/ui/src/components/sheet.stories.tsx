import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { Button } from './button';

const meta: Meta = { title: 'Components/Overlay/Sheet', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const sides = ['top', 'right', 'bottom', 'left'] as const;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open (right)</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild><Button variant="outline" size="sm">{side}</Button></SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader><SheetTitle>{side} sheet</SheetTitle></SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
