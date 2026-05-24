import type { Meta, StoryObj } from '@storybook/react';
import { AdaptiveSheet } from './adaptive-sheet';
import { Button } from './button';
import { useState } from 'react';

const meta: Meta = { title: 'Components/Pixler/AdaptiveSheet', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Open adaptive sheet</Button>
        <AdaptiveSheet open={open} onOpenChange={setOpen} title="Settings">
          <div className="space-y-4 px-4 pb-6">
            <p className="text-sm text-muted-foreground">
              Renders as a side sheet on ≥md, bottom drawer on &lt;md.
              Resize the Storybook preview to see the behavior change.
            </p>
          </div>
        </AdaptiveSheet>
      </>
    );
  },
};
