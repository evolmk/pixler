// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { PopoverComponent, PopoverContentComponent, PopoverTriggerDirective } from './popover.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { LabelComponent } from '../label/label.directive';

const ALL = [PopoverComponent, PopoverContentComponent, PopoverTriggerDirective];

const meta: Meta<PopoverComponent> = {
  title: 'Overlay/Popover',
  component: PopoverComponent,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: 'radio', options: ['click', 'hover'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '360px' } },
  },
};
export default meta;
type Story = StoryObj<PopoverComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Trigger: click (default)</p>
          <ui-popover>
            <ui-button uiPopoverTrigger variant="outline" size="sm">Click to open</ui-button>
            <ui-popover-content class="w-48 p-3">
              <p class="text-sm text-muted-foreground">Opened via click trigger.</p>
            </ui-popover-content>
          </ui-popover>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Trigger: hover</p>
          <ui-popover trigger="hover">
            <ui-button uiPopoverTrigger variant="outline" size="sm">Hover to open</ui-button>
            <ui-popover-content class="w-48 p-3">
              <p class="text-sm text-muted-foreground">Opened via hover trigger.</p>
            </ui-popover-content>
          </ui-popover>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-popover>
        <ui-button uiPopoverTrigger variant="outline">Open Popover</ui-button>
        <ui-popover-content class="w-64 p-4">
          <div class="space-y-2">
            <h4 class="text-sm font-semibold">Account Info</h4>
            <p class="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </ui-popover-content>
      </ui-popover>
    `,
  }),
};

// ── With Form ─────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent, InputComponent, LabelComponent] },
    template: `
      <ui-popover>
        <ui-button uiPopoverTrigger variant="outline">Set Dimensions</ui-button>
        <ui-popover-content class="w-72 p-4">
          <div class="space-y-3">
            <h4 class="text-sm font-semibold">Dimensions</h4>
            <div class="flex flex-col gap-1.5">
              <label uiLabel for="pop-width">Width</label>
              <input uiInput id="pop-width" value="100%" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label uiLabel for="pop-height">Height</label>
              <input uiInput id="pop-height" value="25px" />
            </div>
            <ui-button size="sm" class="w-full">Apply</ui-button>
          </div>
        </ui-popover-content>
      </ui-popover>
    `,
  }),
};

// ── Top Placement ─────────────────────────────────────────────────────────────

export const TopPlacement: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-center pt-20">
        <ui-popover>
          <ui-button uiPopoverTrigger variant="outline">Opens Above</ui-button>
          <ui-popover-content placement="top" class="w-48 p-3">
            <p class="text-sm text-muted-foreground">This popover appears above the trigger.</p>
          </ui-popover-content>
        </ui-popover>
      </div>
    `,
  }),
};
