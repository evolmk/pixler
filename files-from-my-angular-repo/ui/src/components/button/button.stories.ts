// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  ButtonComponent,
  ButtonGroupComponent,
  ButtonGroupDividerComponent,
  ButtonGroupTextDirective,
} from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    shape: {
      control: 'select',
      options: ['default', 'square', 'pill'],
    },
    full: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ButtonComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants</p>
          <div class="flex flex-wrap gap-3">
            <ui-button variant="default">Default</ui-button>
            <ui-button variant="secondary">Secondary</ui-button>
            <ui-button variant="outline">Outline</ui-button>
            <ui-button variant="ghost">Ghost</ui-button>
            <ui-button variant="destructive">Destructive</ui-button>
            <ui-button variant="link">Link</ui-button>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button size="xs">Extra Small</ui-button>
            <ui-button size="sm">Small</ui-button>
            <ui-button size="default">Default</ui-button>
            <ui-button size="lg">Large</ui-button>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button shape="default">Default</ui-button>
            <ui-button shape="square">Square</ui-button>
            <ui-button shape="pill">Pill</ui-button>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">States</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button>Normal</ui-button>
            <ui-button [loading]="true">Save</ui-button>
            <ui-button [loading]="true" loadingText="Saving...">Save</ui-button>
            <ui-button disabled>Disabled</ui-button>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ButtonComponent] },
    props: args,
    template: `<ui-button [variant]="variant" [size]="size" [shape]="shape" [full]="full" [loading]="loading">Button</ui-button>`,
  }),
  args: {
    variant: 'default',
    size: 'default',
    shape: 'default',
    full: false,
    loading: false,
  },
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div class="flex flex-wrap gap-3">
        <ui-button>Normal</ui-button>
        <ui-button [loading]="true">Loading</ui-button>
        <ui-button disabled>Disabled (HTML attr)</ui-button>
        <ui-button [full]="true" class="max-w-xs">Full Width</ui-button>
      </div>
    `,
  }),
};

// ── Loading States ────────────────────────────────────────────────────────────

export const LoadingStates: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6">

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Spinner only (content replaced)</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button [loading]="true">Save</ui-button>
            <ui-button variant="secondary" [loading]="true">Save</ui-button>
            <ui-button variant="outline" [loading]="true">Save</ui-button>
            <ui-button variant="ghost" [loading]="true">Save</ui-button>
            <ui-button variant="destructive" [loading]="true">Delete</ui-button>
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Spinner + loading text</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button [loading]="true" loadingText="Saving...">Save</ui-button>
            <ui-button variant="secondary" [loading]="true" loadingText="Processing...">Submit</ui-button>
            <ui-button variant="outline" [loading]="true" loadingText="Please wait...">Continue</ui-button>
            <ui-button variant="destructive" [loading]="true" loadingText="Deleting...">Delete</ui-button>
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Loading across sizes</p>
          <div class="flex flex-wrap items-center gap-3">
            <ui-button size="xs" [loading]="true" loadingText="Loading...">Save</ui-button>
            <ui-button size="sm" [loading]="true" loadingText="Loading...">Save</ui-button>
            <ui-button size="default" [loading]="true" loadingText="Loading...">Save</ui-button>
            <ui-button size="lg" [loading]="true" loadingText="Loading...">Save</ui-button>
          </div>
        </div>

      </div>
    `,
  }),
};

// ── Button Group ──────────────────────────────────────────────────────────────

export const Group: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ButtonComponent, ButtonGroupComponent, ButtonGroupDividerComponent, ButtonGroupTextDirective],
    },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Horizontal</p>
          <ui-button-group>
            <ui-button variant="outline">Left</ui-button>
            <ui-button-group-divider />
            <ui-button variant="outline">Center</ui-button>
            <ui-button-group-divider />
            <ui-button variant="outline">Right</ui-button>
          </ui-button-group>
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Vertical</p>
          <ui-button-group orientation="vertical">
            <ui-button variant="outline">Top</ui-button>
            <ui-button-group-divider />
            <ui-button variant="outline">Middle</ui-button>
            <ui-button-group-divider />
            <ui-button variant="outline">Bottom</ui-button>
          </ui-button-group>
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">With text label</p>
          <ui-button-group>
            <span uiButtonGroupText>https://</span>
            <ui-button variant="outline">Visit</ui-button>
          </ui-button-group>
        </div>
      </div>
    `,
  }),
};
