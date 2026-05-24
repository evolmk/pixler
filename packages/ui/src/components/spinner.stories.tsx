import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = { title: 'Components/Pixler/Spinner', component: Spinner, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
export const Small: Story = { args: { className: 'size-4' } };
export const Large: Story = { args: { className: 'size-8' } };
export const Colored: Story = { args: { className: 'size-6 text-primary' } };
