// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { CalendarComponent } from './calendar.component';

const meta: Meta<CalendarComponent> = {
  title: 'Forms/Calendar',
  component: CalendarComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'radio', options: ['single', 'multiple', 'range'] },
  },
};
export default meta;
type Story = StoryObj<CalendarComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [CalendarComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: single</p>
          <ui-calendar mode="single"></ui-calendar>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: multiple</p>
          <ui-calendar mode="multiple"></ui-calendar>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: range</p>
          <ui-calendar mode="range"></ui-calendar>
        </div>
      </div>
    `,
  }),
};

// ── With Min/Max ──────────────────────────────────────────────────────────────

export const WithMinMax: Story = {
  render: () => ({
    moduleMetadata: { imports: [CalendarComponent] },
    props: {
      minDate: new Date(),
      maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Only the next 30 days are selectable</p>
        <ui-calendar mode="single" [minDate]="minDate" [maxDate]="maxDate"></ui-calendar>
      </div>
    `,
  }),
};
