import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { Button } from './button';
import { ChevronsUpDown } from 'lucide-react';

const meta: Meta = { title: 'Components/Layout/Collapsible', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[300px] space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Starred repos</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon"><ChevronsUpDown className="size-4" /></Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-border px-4 py-3 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-border px-4 py-3 text-sm">@radix-ui/colors</div>
        <div className="rounded-md border border-border px-4 py-3 text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
