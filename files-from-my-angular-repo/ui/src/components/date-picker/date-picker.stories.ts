// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { DatePickerComponent } from './date-picker.component';

const meta: Meta<DatePickerComponent> = {
  title: 'Forms/DatePicker',
  component: DatePickerComponent,
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '450px' } },
  },
};
export default meta;
type Story = StoryObj<DatePickerComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => ({
    moduleMetadata: { imports: [DatePickerComponent] },
    props: {
      preSelected: new Date(2026, 2, 15),
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2026, 11, 31),
    },
    template: `
      <div class="p-[50px] space-y-10 max-w-md">
        <div>
          <h3 class="text-sm font-semibold mb-2">Default (empty)</h3>
          <p class="text-xs text-muted-foreground mb-3">Opens upward with month/year header, chevron nav on right. Footer has Clear and Today buttons.</p>
          <ui-date-picker placeholder="Pick a date" class="w-60" />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-2">Pre-selected date</h3>
          <ui-date-picker [value]="preSelected" class="w-60" />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-2">With min/max constraints (2024–2026)</h3>
          <ui-date-picker [minDate]="minDate" [maxDate]="maxDate" placeholder="Constrained range" class="w-60" />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-2">Custom format</h3>
          <ui-date-picker [value]="preSelected" dateFormat="DD/MM/YYYY" class="w-60" />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-2">Custom placeholder</h3>
          <ui-date-picker placeholder="Select due date" class="w-60" />
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [DatePickerComponent] },
    props: args,
    template: `<div class="p-[50px]"><ui-date-picker [placeholder]="placeholder" [dateFormat]="dateFormat" class="w-60" /></div>`,
  }),
  args: { placeholder: 'Pick a date', dateFormat: 'MM/DD/YYYY' },
};

// ── With Min / Max ───────────────────────────────────────────────────────────

export const WithMinMax: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerComponent] },
    props: {
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2026, 11, 31),
    },
    template: `
      <div class="p-[50px] flex flex-col gap-1.5">
        <span class="text-xs text-muted-foreground">Only 2024–2026 dates are selectable</span>
        <ui-date-picker [minDate]="minDate" [maxDate]="maxDate" class="w-60" />
      </div>
    `,
  }),
};

// ── Pre-selected ─────────────────────────────────────────────────────────────

export const PreSelected: Story = {
  render: () => ({
    moduleMetadata: { imports: [DatePickerComponent] },
    props: { selectedDate: new Date(2026, 1, 28) },
    template: `<div class="p-[50px]"><ui-date-picker [value]="selectedDate" class="w-60" /></div>`,
  }),
};
