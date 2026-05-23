// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TimePickerComponent } from './time-picker.component';

const meta: Meta<TimePickerComponent> = {
  title: 'Forms/TimePicker',
  component: TimePickerComponent,
  tags: ['autodocs'],
  argTypes: {
    format: { control: 'radio', options: ['24h', '12h'] },
    showSeconds: { control: 'boolean' },
    value: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '360px' } },
  },
};
export default meta;
type Story = StoryObj<TimePickerComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [TimePickerComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Formats</p>
          <div class="flex gap-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">24h</p>
              <ui-time-picker value="14:30" format="24h" class="w-48" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">12h (AM/PM)</p>
              <ui-time-picker value="02:30" format="12h" class="w-52" />
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">With Seconds</p>
          <ui-time-picker value="09:15:45" [showSeconds]="true" class="w-56" />
        </div>
      </div>
    `,
  }),
};

// ── 24h ──────────────────────────────────────────────────────────────────────

export const TwentyFourHour: Story = {
  name: '24-hour',
  render: (args) => ({
    moduleMetadata: { imports: [TimePickerComponent] },
    props: args,
    template: `<ui-time-picker [value]="value" [format]="format" [showSeconds]="showSeconds" class="w-48" />`,
  }),
  args: { value: '14:30', format: '24h', showSeconds: false },
};

// ── 12h ──────────────────────────────────────────────────────────────────────

export const TwelveHour: Story = {
  name: '12-hour (AM/PM)',
  render: () => ({
    moduleMetadata: { imports: [TimePickerComponent] },
    template: `<ui-time-picker value="02:30" format="12h" class="w-52" />`,
  }),
};

// ── With Seconds ──────────────────────────────────────────────────────────────

export const WithSeconds: Story = {
  render: () => ({
    moduleMetadata: { imports: [TimePickerComponent] },
    template: `<ui-time-picker value="09:15:45" [showSeconds]="true" class="w-56" />`,
  }),
};
