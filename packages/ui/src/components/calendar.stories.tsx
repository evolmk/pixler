import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';
import { useState } from 'react';

const meta: Meta = { title: 'Components/Forms/Calendar', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border" />;
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
    return <Calendar mode="range" selected={{ from: range.from, to: range.to }} onSelect={(r) => setRange(r ?? {})} className="rounded-md border border-border" />;
  },
};
