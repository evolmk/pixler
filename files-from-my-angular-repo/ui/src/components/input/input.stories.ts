// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { InputComponent, InputWrapperComponent } from './input.component';
import { LabelComponent } from '../label/label.directive';

const meta: Meta<InputComponent> = {
  title: 'Forms/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'warning', 'success'] },
    borderless: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<InputComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputComponent, InputWrapperComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-6 w-64">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
          <div class="flex flex-col gap-3">
            <input uiInput status="default" placeholder="Default" />
            <input uiInput status="success" placeholder="Success" value="john@example.com" />
            <input uiInput status="warning" placeholder="Warning" value="john" />
            <input uiInput status="error" placeholder="Error" value="not-an-email" />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <input uiInput size="sm" placeholder="Small" />
            <input uiInput size="default" placeholder="Default" />
            <input uiInput size="lg" placeholder="Large" />
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">With Hint</p>
          <div class="flex flex-col gap-3">
            <ui-input-wrapper hint="Inches">
              <input uiInput placeholder="0" />
            </ui-input-wrapper>
            <ui-input-wrapper hint="Lbs">
              <input uiInput placeholder="0" value="42" />
            </ui-input-wrapper>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [InputComponent] },
    props: args,
    template: `<input uiInput [size]="size" [status]="status" [borderless]="borderless" placeholder="Enter value…" class="w-64" />`,
  }),
  args: { size: 'default', status: 'default', borderless: false },
};

// ── Loading (inside input border) ─────────────────────────────────────────────

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputComponent, InputWrapperComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-4 w-72">
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Loading — default size</label>
          <ui-input-wrapper [loading]="true">
            <input uiInput placeholder="Searching…" value="angular" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Loading — small</label>
          <ui-input-wrapper [loading]="true">
            <input uiInput size="sm" placeholder="Searching…" value="angular" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Loading — large</label>
          <ui-input-wrapper [loading]="true">
            <input uiInput size="lg" placeholder="Searching…" value="angular" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Not loading</label>
          <ui-input-wrapper [loading]="false">
            <input uiInput placeholder="Normal input" />
          </ui-input-wrapper>
        </div>
      </div>
    `,
  }),
};

// ── Hint (unit label inside field) ───────────────────────────────────────────

export const Hint: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputComponent, InputWrapperComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-4 w-72">
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Height</label>
          <ui-input-wrapper hint="Inches">
            <input uiInput placeholder="0" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Weight</label>
          <ui-input-wrapper hint="Lbs">
            <input uiInput placeholder="0" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Temperature</label>
          <ui-input-wrapper hint="°F">
            <input uiInput placeholder="0" />
          </ui-input-wrapper>
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>No hint</label>
          <ui-input-wrapper>
            <input uiInput placeholder="Normal input" />
          </ui-input-wrapper>
        </div>
      </div>
    `,
  }),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: [InputComponent, LabelComponent] },
    template: `
      <div class="flex flex-col gap-4 w-64">
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Normal</label>
          <input uiInput placeholder="Type something…" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Read-only</label>
          <input uiInput readonly value="Read-only value" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Disabled</label>
          <input uiInput disabled placeholder="Disabled" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label uiLabel>Password</label>
          <input uiInput type="password" placeholder="••••••••" />
        </div>
      </div>
    `,
  }),
};
