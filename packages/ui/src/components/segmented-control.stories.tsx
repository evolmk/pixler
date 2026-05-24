import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './segmented-control';
import { useState } from 'react';

const meta: Meta = { title: 'Components/Pixler/SegmentedControl', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('day');
    return (
      <SegmentedControl
        value={v}
        onChange={setV}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
    );
  },
};

export const WithDisabled: Story = {
  render: () => {
    const [v, setV] = useState('list');
    return (
      <SegmentedControl
        value={v}
        onChange={setV}
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'board', label: 'Board', disabled: true },
        ]}
      />
    );
  },
};
