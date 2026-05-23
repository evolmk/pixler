// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SwitchFilterComponent } from './switch-filter.component';

const meta: Meta<SwitchFilterComponent> = {
  title: 'Forms/SwitchFilter',
  component: SwitchFilterComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    value: { control: 'select', options: [null, true, false] },
  },
};
export default meta;
type Story = StoryObj<SwitchFilterComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchFilterComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <ui-switch-filter label="Small" size="sm" [value]="true" />
            <ui-switch-filter label="Default" size="default" [value]="true" />
            <ui-switch-filter label="Large" size="lg" [value]="true" />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-6">
              <ui-switch-filter label="Locked" [value]="null" />
              <span class="text-xs text-muted-foreground">null — shows all</span>
            </div>
            <div class="flex items-center gap-6">
              <ui-switch-filter label="Locked" [value]="false" />
              <span class="text-xs text-muted-foreground">false — OFF</span>
            </div>
            <div class="flex items-center gap-6">
              <ui-switch-filter label="Locked" [value]="true" />
              <span class="text-xs text-muted-foreground">true — ON</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── All States ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchFilterComponent] },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-6">
          <ui-switch-filter label="Locked" [value]="null" />
          <span class="text-xs text-muted-foreground">Inactive (null) — shows all</span>
        </div>
        <div class="flex items-center gap-6">
          <ui-switch-filter label="Locked" [value]="false" />
          <span class="text-xs text-muted-foreground">Active OFF (false) — shows unlocked</span>
        </div>
        <div class="flex items-center gap-6">
          <ui-switch-filter label="Locked" [value]="true" />
          <span class="text-xs text-muted-foreground">Active ON (true) — shows locked</span>
        </div>
      </div>
    `,
  }),
};

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchFilterComponent] },
    template: `
      <div class="flex flex-col gap-4">
        <ui-switch-filter label="Small" size="sm" [value]="true" />
        <ui-switch-filter label="Default" size="default" [value]="true" />
        <ui-switch-filter label="Large" size="lg" [value]="true" />
      </div>
    `,
  }),
};

// ── Interactive ──────────────────────────────────────────────────────────────

export const Interactive: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchFilterComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <ui-switch-filter label="Locked" [(value)]="filterValue" />
        <p class="text-xs text-muted-foreground">
          Value: {{ filterValue === null ? 'null' : filterValue }}
        </p>
      </div>
    `,
    props: { filterValue: null },
  }),
};
