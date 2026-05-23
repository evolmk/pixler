// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ComboboxComponent } from './combobox.component';

const meta: Meta<ComboboxComponent> = {
  title: 'Forms/Combobox',
  component: ComboboxComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '380px' } },
  },
};
export default meta;
type Story = StoryObj<ComboboxComponent>;

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
  { value: 'strawberry', label: 'Strawberry' },
];

const TIMEZONES = [
  { value: 'est', label: 'Eastern Standard Time', group: 'North America' },
  { value: 'cst', label: 'Central Standard Time', group: 'North America' },
  { value: 'mst', label: 'Mountain Standard Time', group: 'North America' },
  { value: 'pst', label: 'Pacific Standard Time', group: 'North America' },
  { value: 'gmt', label: 'Greenwich Mean Time', group: 'Europe' },
  { value: 'cet', label: 'Central European Time', group: 'Europe' },
  { value: 'eet', label: 'Eastern European Time', group: 'Europe' },
  { value: 'jst', label: 'Japan Standard Time', group: 'Asia/Pacific' },
  { value: 'aest', label: 'Australian Eastern Time', group: 'Asia/Pacific' },
];

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ComboboxComponent] },
    props: { options: FRUITS },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-end gap-4">
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">sm</p>
              <ui-combobox [options]="options" size="sm" placeholder="Small..."></ui-combobox>
            </div>
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">default</p>
              <ui-combobox [options]="options" size="default" placeholder="Default..."></ui-combobox>
            </div>
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">lg</p>
              <ui-combobox [options]="options" size="lg" placeholder="Large..."></ui-combobox>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Not Searchable</p>
          <div class="w-48">
            <ui-combobox [options]="options" [searchable]="false" placeholder="Select..."></ui-combobox>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ComboboxComponent] },
    props: { options: FRUITS },
    template: `
      <div class="w-64">
        <ui-combobox [options]="options" placeholder="Select a fruit..."></ui-combobox>
      </div>
    `,
  }),
};

// ── With Groups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: [ComboboxComponent] },
    props: { options: TIMEZONES },
    template: `
      <div class="w-80">
        <ui-combobox [options]="options" placeholder="Select timezone..."></ui-combobox>
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [ComboboxComponent] },
    props: { options: FRUITS },
    template: `
      <div class="flex flex-col gap-4 w-64">
        <ui-combobox [options]="options" size="sm" placeholder="Small..."></ui-combobox>
        <ui-combobox [options]="options" size="default" placeholder="Default..."></ui-combobox>
        <ui-combobox [options]="options" size="lg" placeholder="Large..."></ui-combobox>
      </div>
    `,
  }),
};

// ── Not Searchable ────────────────────────────────────────────────────────────

export const NotSearchable: Story = {
  render: () => ({
    moduleMetadata: { imports: [ComboboxComponent] },
    props: {
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'archived', label: 'Archived' },
      ],
    },
    template: `
      <div class="w-48">
        <ui-combobox [options]="options" [searchable]="false" placeholder="Status..."></ui-combobox>
      </div>
    `,
  }),
};
