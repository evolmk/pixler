// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { InputNumberComponent } from './input-number.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { LabelComponent } from '../label/label.directive';

const meta: Meta<InputNumberComponent> = {
  title: 'Forms/InputNumber',
  component: InputNumberComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    mode: { control: 'select', options: ['default', 'stepper'] },
    bare: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<InputNumberComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberComponent, FormFieldComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-10 p-6">
        <!-- Default Mode — Sizes (pill -/#/+) -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default Mode — Sizes</p>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">sm</span>
              <ui-input-number [value]="5" size="sm" />
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">default</span>
              <ui-input-number [value]="5" size="default" />
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">lg</span>
              <ui-input-number [value]="5" size="lg" />
            </div>
          </div>
        </div>

        <!-- Default Mode — Bare (no frame, for inline/table contexts) -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default Mode — Bare</p>
          <p class="mb-3 text-xs text-muted-foreground">Frame removed for inline or dense-table contexts. Buttons reveal border on hover.</p>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">sm</span>
              <ui-input-number [value]="5" [bare]="true" size="sm" />
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">default</span>
              <ui-input-number [value]="5" [bare]="true" size="default" />
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">lg</span>
              <ui-input-number [value]="5" [bare]="true" size="lg" />
            </div>
          </div>
        </div>

        <!-- Stepper Mode — Sizes (input with +/- on right) -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Stepper Mode — Sizes</p>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">sm</span>
              <div class="w-56"><ui-input-number [value]="5" mode="stepper" size="sm" /></div>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">default</span>
              <div class="w-56"><ui-input-number [value]="5" mode="stepper" size="default" /></div>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-16 text-xs text-muted-foreground text-right">lg</span>
              <div class="w-56"><ui-input-number [value]="5" mode="stepper" size="lg" /></div>
            </div>
          </div>
        </div>

        <!-- Modes Comparison -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode Comparison</p>
          <div class="grid grid-cols-3 gap-x-8 gap-y-5">
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Default — empty</p>
              <ui-input-number [value]="0" [min]="0" [max]="9999" />
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Default bare — empty</p>
              <ui-input-number [value]="0" [min]="0" [max]="9999" [bare]="true" />
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Stepper — empty</p>
              <div class="w-56"><ui-input-number [value]="0" [min]="0" [max]="9999" mode="stepper" /></div>
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Default — with value</p>
              <ui-input-number [value]="1250" [min]="0" [max]="9999" />
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Default bare — with value</p>
              <ui-input-number [value]="1250" [min]="0" [max]="9999" [bare]="true" />
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Stepper — with value</p>
              <div class="w-56"><ui-input-number [value]="1250" [min]="0" [max]="9999" mode="stepper" /></div>
            </div>
          </div>
        </div>

        <!-- Boundaries -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Boundaries &amp; Steps</p>
          <div class="flex flex-col gap-4 max-w-xs">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">At minimum (0) — decrement disabled</span>
              <ui-input-number [value]="0" [min]="0" [max]="10" mode="stepper" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">At maximum (10) — increment disabled</span>
              <ui-input-number [value]="10" [min]="0" [max]="10" mode="stepper" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">Decimal step (0.5) — range 0–5</span>
              <ui-input-number [value]="2.5" [min]="0" [max]="5" [step]="0.5" mode="stepper" />
            </div>
          </div>
        </div>

        <!-- In a form -->
        <div>
          <p class="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Form Fields</p>
          <div class="flex flex-col gap-5 max-w-sm">
            <ui-form-field>
              <label ui-label>Quantity</label>
              <ui-input-number [value]="1" [min]="1" [max]="99" />
            </ui-form-field>
            <ui-form-field>
              <label ui-label>Markup %</label>
              <ui-input-number [value]="15" [min]="0" [max]="100" [step]="5" mode="stepper" />
            </ui-form-field>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default (pill -/#/+) ─────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [InputNumberComponent] },
    props: args,
    template: `<ui-input-number [value]="value" [min]="min" [max]="max" [step]="step" [size]="size" />`,
  }),
  args: { value: 1, min: 0, max: 99, step: 1, size: 'default' },
};

// ── Default Bare (no frame) ──────────────────────────────────────────────────

export const DefaultBare: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [InputNumberComponent] },
    props: args,
    template: `<ui-input-number [value]="value" [min]="min" [max]="max" [step]="step" [size]="size" [bare]="true" />`,
  }),
  args: { value: 170, min: 0, max: 999, step: 1, size: 'default' },
};

// ── Stepper (input with +/- buttons on right) ────────────────────────────────

export const Stepper: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [InputNumberComponent] },
    props: args,
    template: `
      <div class="w-64">
        <ui-input-number [value]="value" [min]="min" [max]="max" [step]="step" [size]="size" mode="stepper" />
      </div>
    `,
  }),
  args: { value: 0, min: 0, max: 100, step: 1, size: 'default' },
};

// ── Real-World Examples ──────────────────────────────────────────────────────

export const RealWorldExamples: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberComponent, FormFieldComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-8 max-w-sm">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Practical Use Cases</p>

        <ui-form-field>
          <label ui-label>Quantity</label>
          <ui-input-number [value]="1" [min]="1" [max]="99" [step]="1" />
        </ui-form-field>

        <ui-form-field>
          <label ui-label>Markup %</label>
          <ui-input-number [value]="15" [min]="0" [max]="100" [step]="5" mode="stepper" />
        </ui-form-field>

        <ui-form-field>
          <label ui-label>Credit Balance</label>
          <ui-input-number [value]="250" [min]="0" [max]="99999" [step]="50" mode="stepper" />
        </ui-form-field>

        <ui-form-field>
          <label ui-label>Discount %</label>
          <ui-input-number [value]="10" [min]="0" [max]="100" [step]="1" size="sm" />
        </ui-form-field>
      </div>
    `,
  }),
};

// ── Auto Width ───────────────────────────────────────────────────────────────

export const AutoWidth: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberComponent] },
    template: `
      <div class="flex flex-col gap-8">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Auto-Width — Grows with Content</p>

        <div>
          <p class="mb-3 text-xs text-muted-foreground">Default mode — compact inline sizing</p>
          <div class="flex items-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <ui-input-number [value]="3" />
              <span class="text-xs text-muted-foreground">1 digit</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-input-number [value]="42" />
              <span class="text-xs text-muted-foreground">2 digits</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-input-number [value]="170" />
              <span class="text-xs text-muted-foreground">3 digits</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-input-number [value]="9999" />
              <span class="text-xs text-muted-foreground">4 digits</span>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-3 text-xs text-muted-foreground">Stepper mode — container grows as digits increase</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <span class="w-24 text-xs text-muted-foreground text-right">1 digit</span>
              <div class="w-64"><ui-input-number [value]="5" [min]="0" [max]="99999" mode="stepper" /></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-24 text-xs text-muted-foreground text-right">3 digits</span>
              <div class="w-64"><ui-input-number [value]="170" [min]="0" [max]="99999" mode="stepper" /></div>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-24 text-xs text-muted-foreground text-right">5 digits</span>
              <div class="w-64"><ui-input-number [value]="12500" [min]="0" [max]="99999" mode="stepper" /></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Inline / Table Context ───────────────────────────────────────────────────

export const InlineContext: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputNumberComponent] },
    template: `
      <div class="flex flex-col gap-8">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Inline &amp; Table Usage (bare)</p>

        <!-- Inline with text -->
        <div class="flex items-center gap-2 text-sm text-foreground">
          <span>Show</span>
          <ui-input-number [value]="25" [min]="5" [max]="100" [step]="5" [bare]="true" size="sm" />
          <span>entries per page</span>
        </div>

        <!-- Table row context -->
        <div class="rounded-lg border border-input overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-input bg-muted/30">
                <th class="px-4 py-2 text-left font-medium text-muted-foreground">Item</th>
                <th class="px-4 py-2 text-left font-medium text-muted-foreground">SKU</th>
                <th class="px-4 py-2 text-center font-medium text-muted-foreground">Qty</th>
                <th class="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-input">
                <td class="px-4 py-2 text-foreground">Cap Assembly — Model A</td>
                <td class="px-4 py-2 text-muted-foreground">CAP-A-001</td>
                <td class="px-4 py-2 flex justify-center">
                  <ui-input-number [value]="2" [min]="1" [max]="99" [bare]="true" size="sm" />
                </td>
                <td class="px-4 py-2 text-right text-foreground">$42.00</td>
              </tr>
              <tr class="border-b border-input">
                <td class="px-4 py-2 text-foreground">Torque Spring Kit</td>
                <td class="px-4 py-2 text-muted-foreground">SPR-T-014</td>
                <td class="px-4 py-2 flex justify-center">
                  <ui-input-number [value]="5" [min]="1" [max]="99" [bare]="true" size="sm" />
                </td>
                <td class="px-4 py-2 text-right text-foreground">$18.50</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-foreground">Roller Bearing Set</td>
                <td class="px-4 py-2 text-muted-foreground">BRG-R-008</td>
                <td class="px-4 py-2 flex justify-center">
                  <ui-input-number [value]="12" [min]="1" [max]="99" [bare]="true" size="sm" />
                </td>
                <td class="px-4 py-2 text-right text-foreground">$7.25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  }),
};
