import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta: Meta = { title: 'Components/Overlay/HoverCard', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="text-sm underline underline-offset-4 cursor-pointer">@pixler</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>PX</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">@pixler</p>
            <p className="text-xs text-muted-foreground mt-1">Local-first agent orchestrator. Takes tickets from "Todo" to "Merged PR".</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
