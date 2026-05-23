// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { LabelComponent } from '../label/label.directive';

const meta: Meta<TextareaComponent> = {
  title: 'Forms/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'warning', 'success'] },
    borderless: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TextareaComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaComponent] },
    template: `
      <div class="flex flex-col gap-6 w-72">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
          <div class="flex flex-col gap-3">
            <textarea uiTextarea status="default" placeholder="Default"></textarea>
            <textarea uiTextarea status="success" placeholder="Success">Valid content</textarea>
            <textarea uiTextarea status="warning" placeholder="Warning">Needs review</textarea>
            <textarea uiTextarea status="error" placeholder="Error">Invalid content</textarea>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <textarea uiTextarea size="sm" placeholder="Small"></textarea>
            <textarea uiTextarea size="default" placeholder="Default"></textarea>
            <textarea uiTextarea size="lg" placeholder="Large"></textarea>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [TextareaComponent] },
    props: args,
    template: `<textarea uiTextarea [size]="size" [status]="status" [borderless]="borderless" placeholder="Write your message…" class="w-72"></textarea>`,
  }),
  args: { size: 'default', status: 'default', borderless: false },
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-4 w-72">
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Normal</label>
          <textarea uiTextarea placeholder="Write here…"></textarea>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>With error</label>
          <textarea uiTextarea status="error" placeholder="Required field"></textarea>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Disabled</label>
          <textarea uiTextarea disabled placeholder="Cannot edit"></textarea>
        </div>
      </div>
    `,
  }),
};
