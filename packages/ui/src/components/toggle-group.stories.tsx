import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const meta: Meta = { title: 'Components/Actions/ToggleGroup', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Left"><AlignLeft className="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center"><AlignCenter className="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right"><AlignRight className="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Bold"><span className="font-bold text-sm">B</span></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><span className="italic text-sm">I</span></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><span className="underline text-sm">U</span></ToggleGroupItem>
    </ToggleGroup>
  ),
};
