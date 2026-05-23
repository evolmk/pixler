// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SwitchComponent } from './switch.component';
import { LabelComponent } from '../label/label.directive';

const meta: Meta<SwitchComponent> = {
  title: 'Forms/Switch',
  component: SwitchComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    type: { control: 'radio', options: ['default', 'destructive'] },
    checked: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<SwitchComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <ui-switch size="sm" [checked]="true" />
              <span class="text-xs text-muted-foreground">sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-switch size="default" [checked]="true" />
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-switch size="lg" [checked]="true" />
              <span class="text-xs text-muted-foreground">lg</span>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Types</p>
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <ui-switch type="default" [checked]="true" />
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-switch type="destructive" [checked]="true" />
              <span class="text-xs text-muted-foreground">destructive</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [SwitchComponent] },
    props: args,
    template: `<ui-switch [checked]="checked" [size]="size" [type]="type" />`,
  }),
  args: { checked: false, size: 'default', type: 'default' },
};

// ── With Label ────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <ui-switch id="sw1" />
          <label uiLabel for="sw1">Airplane mode</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-switch id="sw2" [checked]="true" />
          <label uiLabel for="sw2">Notifications enabled</label>
        </div>
        <div class="flex items-center gap-2 opacity-50">
          <ui-switch id="sw3" [checked]="true" />
          <label uiLabel for="sw3">Locked setting (disabled)</label>
        </div>
      </div>
    `,
  }),
};

// ── Destructive ───────────────────────────────────────────────────────────────

export const Destructive: Story = {
  render: () => ({
    moduleMetadata: { imports: [SwitchComponent, LabelComponent] },
    template: `
      <div class="flex items-center gap-2">
        <ui-switch id="sw-danger" [checked]="true" type="destructive" />
        <label uiLabel for="sw-danger">Delete all data on logout</label>
      </div>
    `,
  }),
};
