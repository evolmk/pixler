import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof Toggle> = { title: 'Components/Actions/Toggle', component: Toggle, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = { args: { children: <Bold className="size-4" />, 'aria-label': 'Bold' } };
export const Outline: Story = { args: { variant: 'outline', children: <Italic className="size-4" />, 'aria-label': 'Italic' } };
export const WithText: Story = { args: { children: <><Underline className="size-4" />Underline</>, 'aria-label': 'Underline' } };
export const Disabled: Story = { args: { disabled: true, children: <Bold className="size-4" />, 'aria-label': 'Bold disabled' } };
export const Small: Story = { args: { size: 'sm', children: <Bold className="size-4" />, 'aria-label': 'Bold small' } };
export const Large: Story = { args: { size: 'lg', children: <Bold className="size-4" />, 'aria-label': 'Bold large' } };
