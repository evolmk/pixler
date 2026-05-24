import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = { title: 'Components/Feedback/Progress', component: Progress, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 60, className: 'w-[300px]' } };
export const Empty: Story = { args: { value: 0, className: 'w-[300px]' } };
export const Full: Story = { args: { value: 100, className: 'w-[300px]' } };
