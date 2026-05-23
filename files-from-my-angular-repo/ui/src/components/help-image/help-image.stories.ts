// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { HelpImageComponent } from './help-image.component';

const meta: Meta<HelpImageComponent> = {
  title: 'Overlay/HelpImage',
  component: HelpImageComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    imageUrl: { control: 'text' },
    label: { control: 'text' },
    maxWidth: { control: 'text' },
    placement: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
    },
  },
};
export default meta;
type Story = StoryObj<HelpImageComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'Cap Elevator Position',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/RoomElevatorLarge.png',
    label: 'Cap Elevator Position',
  },
};

// ── Custom Label ──────────────────────────────────────────────────────────────

export const CustomLabel: Story = {
  args: {
    title: 'Help Image',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/RoomElevatorLarge.png',
    label: 'View Diagram',
    maxWidth: '500px',
  },
};

// ── With Form Field ──────────────────────────────────────────────────────────

export const WithFormField: Story = {
  render: (_args) => ({
    moduleMetadata: { imports: [HelpImageComponent] },
    template: `
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Position</label>
          <ui-help-image
            title="Cap Elevator Position"
            label="Cap Elevator Position"
            imageUrl="https://lazar.s3.amazonaws.com/site/help/RoomElevatorLarge.png"
          />
        </div>
        <select class="border rounded px-3 py-2 text-sm w-64">
          <option>None</option>
          <option>1 (Behind Conveyor Left Side)</option>
          <option>2 (Behind Capper Left Side)</option>
          <option>3 (Behind Capper Right Side)</option>
          <option>4 (Behind Conveyor Right Side)</option>
        </select>
      </div>
    `,
  }),
};
