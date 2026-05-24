import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text…' } };
export const WithValue: Story = { args: { defaultValue: 'Hello world' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } };
export const Password: Story = { args: { type: 'password', placeholder: 'Password' } };
export const File: Story = { args: { type: 'file' } };
