// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { InputGroupComponent, InputAddonComponent, InputGroupSpinnerComponent } from './input-group.component';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [InputGroupComponent, InputAddonComponent, InputGroupSpinnerComponent, InputComponent, ButtonComponent];

const meta: Meta<InputGroupComponent> = {
  title: 'Forms/InputGroup',
  component: InputGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<InputGroupComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: sm</p>
          <ui-input-group size="sm" class="w-72">
            <ui-input-addon>https://</ui-input-addon>
            <input uiInput placeholder="small input" />
          </ui-input-group>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: default</p>
          <ui-input-group size="default" class="w-72">
            <ui-input-addon>https://</ui-input-addon>
            <input uiInput placeholder="default input" />
          </ui-input-group>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: lg</p>
          <ui-input-group size="lg" class="w-72">
            <ui-input-addon>https://</ui-input-addon>
            <input uiInput placeholder="large input" />
          </ui-input-group>
        </div>
      </div>
    `,
  }),
};

// ── Left Addon ────────────────────────────────────────────────────────────────

export const LeftAddon: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-input-group class="w-72">
        <ui-input-addon>https://</ui-input-addon>
        <input uiInput placeholder="your-domain.com" />
      </ui-input-group>
    `,
  }),
};

// ── Right Addon ───────────────────────────────────────────────────────────────

export const RightAddon: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-input-group class="w-64">
        <input uiInput type="number" placeholder="0.00" />
        <ui-input-addon>USD</ui-input-addon>
      </ui-input-group>
    `,
  }),
};

// ── Both Sides ────────────────────────────────────────────────────────────────

export const BothSides: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-input-group class="w-80">
        <ui-input-addon>$</ui-input-addon>
        <input uiInput type="number" placeholder="0.00" />
        <ui-input-addon>.00</ui-input-addon>
      </ui-input-group>
    `,
  }),
};

// ── With Button ───────────────────────────────────────────────────────────────

export const WithButton: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-input-group class="w-72">
        <input uiInput placeholder="Search…" />
        <ui-button>Go</ui-button>
      </ui-input-group>
    `,
  }),
};

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-input-group [loading]="true" class="w-72">
        <input uiInput placeholder="Searching…" value="angular" />
        <ui-input-group-spinner />
      </ui-input-group>
    `,
  }),
};
