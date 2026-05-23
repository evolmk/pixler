// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SearchboxComponent } from './searchbox.component';

const meta: Meta<SearchboxComponent> = {
  title: 'Forms/Searchbox',
  component: SearchboxComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    debounce: { control: 'number' },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<SearchboxComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SearchboxComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3 w-72">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-searchbox size="sm" placeholder="Small search" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-searchbox size="default" placeholder="Default search" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-searchbox size="lg" placeholder="Large search" class="flex-1" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex flex-col gap-3 w-72">
            <ui-searchbox query="angular" [loading]="true" placeholder="Loading..." />
            <ui-searchbox placeholder="Disabled" [disabled]="true" />
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [SearchboxComponent] },
    props: args,
    template: `<ui-searchbox [placeholder]="placeholder" [size]="size" [disabled]="disabled" [loading]="loading" [debounce]="debounce" class="w-72" />`,
  }),
  args: {
    placeholder: 'Search…',
    size: 'default',
    disabled: false,
    loading: false,
    debounce: 300,
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [SearchboxComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <ui-searchbox size="sm" placeholder="Small search" class="w-64" />
        <ui-searchbox size="default" placeholder="Default search" class="w-64" />
        <ui-searchbox size="lg" placeholder="Large search" class="w-64" />
      </div>
    `,
  }),
};

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: [SearchboxComponent] },
    template: `<ui-searchbox query="angular" [loading]="true" class="w-72" />`,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [SearchboxComponent] },
    template: `<ui-searchbox placeholder="Search unavailable" [disabled]="true" class="w-72" />`,
  }),
};
