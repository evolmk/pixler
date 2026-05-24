import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Loader2, Mail } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'Button' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };
export const Link: Story = { args: { variant: 'link', children: 'Link' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Destructive' } };
export const Small: Story = { args: { size: 'sm', children: 'Small' } };
export const Large: Story = { args: { size: 'lg', children: 'Large' } };
export const Icon: Story = { args: { size: 'icon', children: <Mail className="size-4" /> } };
export const Loading: Story = {
  args: { disabled: true, children: <><Loader2 className="mr-2 size-4 animate-spin" />Loading</> },
};
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };
