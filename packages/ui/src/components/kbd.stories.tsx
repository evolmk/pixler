import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './kbd';

const meta: Meta<typeof Kbd> = { title: 'Components/Pixler/Kbd', component: Kbd, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = { args: { children: '⌘K' } };
export const Combo: Story = {
  render: () => (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to open
    </span>
  ),
};
export const Examples: Story = {
  render: () => (
    <div className="flex gap-2">
      {['⌘', '⇧', '⌥', '⌃', 'Esc', 'Enter', '↑', '↓'].map((k) => <Kbd key={k}>{k}</Kbd>)}
    </div>
  ),
};
