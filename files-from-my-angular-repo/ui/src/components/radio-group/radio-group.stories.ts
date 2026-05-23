// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { RadioGroupComponent, RadioGroupItemComponent } from './radio-group.component';
import { LabelComponent } from '../label/label.directive';

const ALL = [RadioGroupComponent, RadioGroupItemComponent];

const meta: Meta<RadioGroupComponent> = {
  title: 'Forms/RadioGroup',
  component: RadioGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
  },
};
export default meta;
type Story = StoryObj<RadioGroupComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, LabelComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertical (default)</p>
          <ui-radio-group value="opt-1">
            <div class="flex items-center gap-2"><ui-radio-group-item id="av1" value="opt-1" /><label uiLabel for="av1">Option One</label></div>
            <div class="flex items-center gap-2"><ui-radio-group-item id="av2" value="opt-2" /><label uiLabel for="av2">Option Two</label></div>
            <div class="flex items-center gap-2"><ui-radio-group-item id="av3" value="opt-3" /><label uiLabel for="av3">Option Three</label></div>
          </ui-radio-group>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Horizontal</p>
          <ui-radio-group value="a" orientation="horizontal">
            <div class="flex items-center gap-2"><ui-radio-group-item id="avh1" value="a" /><label uiLabel for="avh1">A</label></div>
            <div class="flex items-center gap-2"><ui-radio-group-item id="avh2" value="b" /><label uiLabel for="avh2">B</label></div>
            <div class="flex items-center gap-2"><ui-radio-group-item id="avh3" value="c" /><label uiLabel for="avh3">C</label></div>
          </ui-radio-group>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, LabelComponent] },
    template: `
      <ui-radio-group value="option-1">
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="r1" value="option-1" />
          <label uiLabel for="r1">Option One</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="r2" value="option-2" />
          <label uiLabel for="r2">Option Two</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="r3" value="option-3" />
          <label uiLabel for="r3">Option Three</label>
        </div>
      </ui-radio-group>
    `,
  }),
};

// ── Horizontal ────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, LabelComponent] },
    template: `
      <ui-radio-group value="default" orientation="horizontal">
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="rh1" value="default" />
          <label uiLabel for="rh1">Default</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="rh2" value="comfortable" />
          <label uiLabel for="rh2">Comfortable</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="rh3" value="compact" />
          <label uiLabel for="rh3">Compact</label>
        </div>
      </ui-radio-group>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, LabelComponent] },
    template: `
      <ui-radio-group value="locked" class="opacity-50 pointer-events-none">
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="rd1" value="locked" />
          <label uiLabel for="rd1">Locked option (selected)</label>
        </div>
        <div class="flex items-center gap-2">
          <ui-radio-group-item id="rd2" value="other" />
          <label uiLabel for="rd2">Other option</label>
        </div>
      </ui-radio-group>
    `,
  }),
};
