// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectItemComponent,
  SelectSeparatorComponent,
} from './select.component';

const ALL = [
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectItemComponent,
  SelectSeparatorComponent,
];

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
  { value: 'grape', label: 'Grape' },
];

const GROUPED = [
  { value: 'est', label: 'Eastern Standard Time (EST)', group: 'North America' },
  { value: 'cst', label: 'Central Standard Time (CST)', group: 'North America' },
  { value: 'mst', label: 'Mountain Standard Time (MST)', group: 'North America' },
  { value: 'pst', label: 'Pacific Standard Time (PST)', group: 'North America' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)', group: 'Europe' },
  { value: 'cet', label: 'Central European Time (CET)', group: 'Europe' },
  { value: 'eet', label: 'Eastern European Time (EET)', group: 'Europe' },
  { value: 'jst', label: 'Japan Standard Time (JST)', group: 'Asia/Pacific' },
  { value: 'aest', label: 'Australian Eastern Time (AEST)', group: 'Asia/Pacific' },
];

const WITH_DISABLED = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise (Contact Us)', disabled: true },
];

const meta: Meta<SelectComponent> = {
  title: 'Forms/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '360px' } },
  },
};
export default meta;
type Story = StoryObj<SelectComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { fruits: FRUITS, withDisabled: WITH_DISABLED, grouped: GROUPED },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <p class="text-sm font-semibold text-foreground">Composition API (ng-content)</p>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-end gap-4">
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">sm</p>
              <ui-select size="sm">
                <ui-select-trigger><ui-select-value placeholder="Small..."></ui-select-value></ui-select-trigger>
                <ui-select-content>
                  <ui-select-item value="a">Option A</ui-select-item>
                  <ui-select-item value="b">Option B</ui-select-item>
                </ui-select-content>
              </ui-select>
            </div>
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">default</p>
              <ui-select size="default">
                <ui-select-trigger><ui-select-value placeholder="Default..."></ui-select-value></ui-select-trigger>
                <ui-select-content>
                  <ui-select-item value="a">Option A</ui-select-item>
                  <ui-select-item value="b">Option B</ui-select-item>
                </ui-select-content>
              </ui-select>
            </div>
            <div class="w-48">
              <p class="text-xs text-muted-foreground mb-1">lg</p>
              <ui-select size="lg">
                <ui-select-trigger><ui-select-value placeholder="Large..."></ui-select-value></ui-select-trigger>
                <ui-select-content>
                  <ui-select-item value="a">Option A</ui-select-item>
                  <ui-select-item value="b">Option B</ui-select-item>
                </ui-select-content>
              </ui-select>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multi-Select</p>
          <div class="w-64">
            <ui-select [multiple]="true" [maxLabelCount]="2">
              <ui-select-trigger><ui-select-value placeholder="Select items..."></ui-select-value></ui-select-trigger>
              <ui-select-content>
                <ui-select-item value="a">Angular</ui-select-item>
                <ui-select-item value="b">React</ui-select-item>
                <ui-select-item value="c">Vue</ui-select-item>
              </ui-select-content>
            </ui-select>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">With Disabled Item</p>
          <div class="w-64">
            <ui-select>
              <ui-select-trigger><ui-select-value placeholder="Select plan..."></ui-select-value></ui-select-trigger>
              <ui-select-content>
                <ui-select-item value="free">Free</ui-select-item>
                <ui-select-item value="pro">Pro</ui-select-item>
                <ui-select-item value="ent" [disabled]="true">Enterprise (Contact Us)</ui-select-item>
              </ui-select-content>
            </ui-select>
          </div>
        </div>

        <hr class="border-border" />
        <p class="text-sm font-semibold text-foreground">Options Array API</p>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
          <div class="w-64">
            <ui-select [options]="fruits" placeholder="Select a fruit..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Searchable</p>
          <div class="w-64">
            <ui-select [options]="fruits" [searchable]="true" placeholder="Search fruits..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multiple + Searchable</p>
          <div class="w-64">
            <ui-select [options]="fruits" [multiple]="true" [searchable]="true" placeholder="Search & select..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multiple + Searchable (Max 2 Labels)</p>
          <div class="w-64">
            <ui-select [options]="fruits" [multiple]="true" [searchable]="true" [maxLabelCount]="2" placeholder="Search & select..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">With Disabled Items</p>
          <div class="w-64">
            <ui-select [options]="withDisabled" placeholder="Select a plan..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grouped Options</p>
          <div class="w-72">
            <ui-select [options]="grouped" placeholder="Select a timezone..." />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Grouped + Multiple + Searchable</p>
          <div class="w-72">
            <ui-select [options]="grouped" [multiple]="true" [searchable]="true" placeholder="Search timezones..." />
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Selected State ────────────────────────────────────────────────────────────
// Shows colored checkmark + primary text on pre-selected items without interaction.

export const SelectedState: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { fruits: FRUITS },
    template: `
      <div class="flex gap-6 p-6">
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Single — open to see selected</p>
          <ui-select value="banana" [options]="fruits" placeholder="Select a fruit..." />
        </div>
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Multi — open to see selected</p>
          <ui-select [value]="['apple', 'cherry']" [multiple]="true" [options]="fruits" placeholder="Select fruits..." />
        </div>
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Composition API — pre-selected</p>
          <ui-select value="cherry">
            <ui-select-trigger><ui-select-value placeholder="Select..."></ui-select-value></ui-select-trigger>
            <ui-select-content>
              <ui-select-item value="apple">Apple</ui-select-item>
              <ui-select-item value="banana">Banana</ui-select-item>
              <ui-select-item value="cherry">Cherry</ui-select-item>
              <ui-select-item value="mango">Mango</ui-select-item>
            </ui-select-content>
          </ui-select>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="w-64">
        <ui-select>
          <ui-select-trigger>
            <ui-select-value placeholder="Select a fruit..."></ui-select-value>
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-item value="apple">Apple</ui-select-item>
            <ui-select-item value="banana">Banana</ui-select-item>
            <ui-select-item value="cherry">Cherry</ui-select-item>
            <ui-select-item value="mango">Mango</ui-select-item>
            <ui-select-item value="orange">Orange</ui-select-item>
          </ui-select-content>
        </ui-select>
      </div>
    `,
  }),
};

// ── With Groups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="w-72">
        <ui-select>
          <ui-select-trigger>
            <ui-select-value placeholder="Select a timezone..."></ui-select-value>
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-group>
              <ui-select-label>North America</ui-select-label>
              <ui-select-item value="est">Eastern Standard Time (EST)</ui-select-item>
              <ui-select-item value="cst">Central Standard Time (CST)</ui-select-item>
              <ui-select-item value="mst">Mountain Standard Time (MST)</ui-select-item>
              <ui-select-item value="pst">Pacific Standard Time (PST)</ui-select-item>
            </ui-select-group>
            <ui-select-separator></ui-select-separator>
            <ui-select-group>
              <ui-select-label>Europe</ui-select-label>
              <ui-select-item value="gmt">Greenwich Mean Time (GMT)</ui-select-item>
              <ui-select-item value="cet">Central European Time (CET)</ui-select-item>
              <ui-select-item value="eet">Eastern European Time (EET)</ui-select-item>
            </ui-select-group>
            <ui-select-separator></ui-select-separator>
            <ui-select-group>
              <ui-select-label>Asia/Pacific</ui-select-label>
              <ui-select-item value="jst">Japan Standard Time (JST)</ui-select-item>
              <ui-select-item value="aest">Australian Eastern Time (AEST)</ui-select-item>
            </ui-select-group>
          </ui-select-content>
        </ui-select>
      </div>
    `,
  }),
};

// ── MultiSelect ───────────────────────────────────────────────────────────────

export const MultiSelect: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="w-72">
        <ui-select [multiple]="true" [maxLabelCount]="2">
          <ui-select-trigger>
            <ui-select-value placeholder="Select technologies..."></ui-select-value>
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-item value="angular">Angular</ui-select-item>
            <ui-select-item value="react">React</ui-select-item>
            <ui-select-item value="vue">Vue</ui-select-item>
            <ui-select-item value="svelte">Svelte</ui-select-item>
            <ui-select-item value="nextjs">Next.js</ui-select-item>
            <ui-select-item value="nuxt">Nuxt</ui-select-item>
          </ui-select-content>
        </ui-select>
      </div>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-4 w-64">
        <p class="text-sm text-muted-foreground">Disabled select:</p>
        <ui-select>
          <ui-select-trigger>
            <ui-select-value placeholder="Select an option..."></ui-select-value>
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-item value="a">Option A</ui-select-item>
            <ui-select-item value="b">Option B</ui-select-item>
          </ui-select-content>
        </ui-select>
        <p class="text-sm text-muted-foreground">With disabled items:</p>
        <ui-select>
          <ui-select-trigger>
            <ui-select-value placeholder="Select a plan..."></ui-select-value>
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-item value="free">Free</ui-select-item>
            <ui-select-item value="pro">Pro</ui-select-item>
            <ui-select-item value="enterprise" [disabled]="true">Enterprise (Contact Us)</ui-select-item>
          </ui-select-content>
        </ui-select>
      </div>
    `,
  }),
};

// ── Options Array ─────────────────────────────────────────────────────────────

export const OptionsArray: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: FRUITS },
    template: `
      <div class="w-64 p-6">
        <ui-select [options]="options" placeholder="Select a fruit..." />
      </div>
    `,
  }),
};

// ── Searchable ────────────────────────────────────────────────────────────────

export const Searchable: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: FRUITS },
    template: `
      <div class="w-64 p-6">
        <ui-select [options]="options" [searchable]="true" placeholder="Search fruits..." />
      </div>
    `,
  }),
};

// ── Searchable Empty State ──────────────────────────────────────────────────

export const SearchableEmptyState: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: [{ value: 'only', label: 'Only Option' }] },
    template: `
      <div class="w-64 p-6">
        <p class="text-xs text-muted-foreground mb-2">Type something that doesn't match to see empty message</p>
        <ui-select [options]="options" [searchable]="true" placeholder="Search..." emptyMessage="Nothing matches your search" />
      </div>
    `,
  }),
};

// ── Options Array Multiple ──────────────────────────────────────────────────

export const OptionsArrayMultiple: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: FRUITS },
    template: `
      <div class="w-64 p-6">
        <ui-select [options]="options" [multiple]="true" [searchable]="true" placeholder="Search & select..." />
      </div>
    `,
  }),
};

// ── Multiple Searchable with Max Labels ─────────────────────────────────────

export const MultipleSearchableMaxLabels: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: FRUITS },
    template: `
      <div class="w-64 p-6">
        <ui-select [options]="options" [multiple]="true" [searchable]="true" [maxLabelCount]="2" placeholder="Search & select..." />
      </div>
    `,
  }),
};

// ── Checkmark Position ───────────────────────────────────────────────────────

export const CheckmarkPosition: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { options: FRUITS },
    template: `
      <div class="flex gap-6 p-6">
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Checkmark Left (default)</p>
          <ui-select [options]="options" checkmarkPosition="left" placeholder="Left checkmark..." />
        </div>
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Checkmark Right</p>
          <ui-select [options]="options" checkmarkPosition="right" placeholder="Right checkmark..." />
        </div>
      </div>
      <div class="flex gap-6 p-6">
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Composition API — Left</p>
          <ui-select checkmarkPosition="left">
            <ui-select-trigger><ui-select-value placeholder="Left..."></ui-select-value></ui-select-trigger>
            <ui-select-content>
              <ui-select-item value="apple">Apple</ui-select-item>
              <ui-select-item value="banana">Banana</ui-select-item>
              <ui-select-item value="cherry">Cherry</ui-select-item>
            </ui-select-content>
          </ui-select>
        </div>
        <div class="w-64">
          <p class="text-xs text-muted-foreground mb-2">Composition API — Right</p>
          <ui-select checkmarkPosition="right">
            <ui-select-trigger><ui-select-value placeholder="Right..."></ui-select-value></ui-select-trigger>
            <ui-select-content>
              <ui-select-item value="apple">Apple</ui-select-item>
              <ui-select-item value="banana">Banana</ui-select-item>
              <ui-select-item value="cherry">Cherry</ui-select-item>
            </ui-select-content>
          </ui-select>
        </div>
      </div>
    `,
  }),
};

// ── Grouped Options Array ─────────────────────────────────────────────────────

export const GroupedOptionsArray: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: GROUPED },
    template: `
      <div class="w-72 p-6">
        <ui-select [options]="options" placeholder="Select a timezone..." />
      </div>
    `,
  }),
};

// ── Grouped Options Multiple + Searchable ─────────────────────────────────────

export const GroupedMultipleSearchable: Story = {
  render: () => ({
    moduleMetadata: { imports: [SelectComponent] },
    props: { options: GROUPED },
    template: `
      <div class="w-72 p-6">
        <ui-select [options]="options" [multiple]="true" [searchable]="true" placeholder="Search timezones..." />
      </div>
    `,
  }),
};
