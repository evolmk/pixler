// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';
import { LabelComponent } from '../label/label.directive';

const meta: Meta<CheckboxComponent> = {
  title: 'Forms/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    shape: { control: 'select', options: ['default', 'square', 'circle'] },
    type: { control: 'radio', options: ['default', 'destructive'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<CheckboxComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox size="sm" [checked]="true" /><span uiLabel>sm</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox size="default" [checked]="true" /><span uiLabel>default</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox size="lg" [checked]="true" /><span uiLabel>lg</span></label>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox shape="default" [checked]="true" /><span uiLabel>default</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox shape="square" [checked]="true" /><span uiLabel>square</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox shape="circle" [checked]="true" /><span uiLabel>circle</span></label>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Types</p>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox type="default" [checked]="true" /><span uiLabel>default</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox type="destructive" [checked]="true" /><span uiLabel>destructive</span></label>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox /><span uiLabel>unchecked</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox [checked]="true" /><span uiLabel>checked</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><ui-checkbox [indeterminate]="true" /><span uiLabel>indeterminate</span></label>
            <label class="flex items-center gap-2 cursor-not-allowed"><ui-checkbox [disabled]="true" [checked]="true" /><span uiLabel>disabled</span></label>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [CheckboxComponent, LabelComponent] },
    props: args,
    template: `
      <label class="flex items-center gap-2 cursor-pointer">
        <ui-checkbox [checked]="checked" [size]="size" [shape]="shape" [type]="type" [indeterminate]="indeterminate" />
        <span uiLabel>Checkbox Item</span>
      </label>
    `,
  }),
  args: { checked: false, size: 'default', shape: 'default', type: 'default', indeterminate: false },
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: [CheckboxComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <ui-checkbox />
          <span uiLabel>Unchecked</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <ui-checkbox [checked]="true" />
          <span uiLabel>Checked</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <ui-checkbox [indeterminate]="true" />
          <span uiLabel>Indeterminate</span>
        </label>
        <label class="flex items-center gap-2 cursor-not-allowed">
          <ui-checkbox [checked]="true" [disabled]="true" />
          <span uiLabel>Checked (disabled)</span>
        </label>
        <label class="flex items-center gap-2 cursor-not-allowed">
          <ui-checkbox [disabled]="true" />
          <span uiLabel>Unchecked (disabled)</span>
        </label>
      </div>
    `,
  }),
};
