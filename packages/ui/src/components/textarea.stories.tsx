import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: 'Write something…' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } };
export const WithRows: Story = { args: { rows: 6, placeholder: '6 rows' } };
