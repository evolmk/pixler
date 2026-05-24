import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { Button } from './button';

const meta: Meta = { title: 'Components/Forms/Form', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const form = useForm({ defaultValues: { username: '' } });
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="w-[400px] space-y-6">
          <FormField
            control={form.control}
            name="username"
            rules={{ required: 'Username is required', minLength: { value: 2, message: 'Min 2 chars' } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input placeholder="shadcn" {...field} /></FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};
