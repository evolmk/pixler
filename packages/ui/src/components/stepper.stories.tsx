import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './stepper';
import { useState } from 'react';

const meta: Meta = { title: 'Components/Pixler/Stepper', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(1);
    return <Stepper value={v} onChange={setV} min={0} max={10} className="w-36" />;
  },
};

export const Clamped: Story = {
  render: () => {
    const [v, setV] = useState(8);
    return (
      <div className="space-y-1">
        <Stepper value={v} onChange={setV} min={1} max={10} className="w-36" />
        <p className="text-xs text-muted-foreground">Range: 1–10</p>
      </div>
    );
  },
};

export const Disabled: Story = { render: () => <Stepper value={5} onChange={() => {}} disabled className="w-36" /> };
