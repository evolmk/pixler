// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { DividerComponent } from './divider.component';

const meta: Meta<DividerComponent> = {
  title: 'Display/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['solid', 'dashed', 'dotted'] },
    spacing: { control: 'radio', options: ['none', 'sm', 'default', 'lg'] },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<DividerComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [DividerComponent] },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants</p>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">solid</span>
              <ui-divider variant="solid" spacing="none"></ui-divider>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">dashed</span>
              <ui-divider variant="dashed" spacing="none"></ui-divider>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-muted-foreground">dotted</span>
              <ui-divider variant="dotted" spacing="none"></ui-divider>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Orientation</p>
          <div class="flex gap-6">
            <div class="flex flex-col gap-1 items-center">
              <span class="text-xs text-muted-foreground">horizontal</span>
              <ui-divider variant="solid" spacing="none" class="w-32"></ui-divider>
            </div>
            <div class="flex flex-col gap-1 items-center">
              <span class="text-xs text-muted-foreground">vertical</span>
              <div class="h-8"><ui-divider orientation="vertical" spacing="none"></ui-divider></div>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">With Label</p>
          <ui-divider label="Or continue with"></ui-divider>
        </div>
      </div>
    `,
  }),
};

// ── Horizontal ────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [DividerComponent] },
    props: args,
    template: `
      <div class="space-y-2">
        <p class="text-sm">Content above</p>
        <ui-divider [variant]="variant" [spacing]="spacing"></ui-divider>
        <p class="text-sm">Content below</p>
      </div>
    `,
  }),
  args: { variant: 'solid', spacing: 'default', orientation: 'horizontal' },
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [DividerComponent] },
    template: `
      <div class="flex h-8 items-center text-sm">
        <span>Home</span>
        <ui-divider orientation="vertical" spacing="default"></ui-divider>
        <span>Products</span>
        <ui-divider orientation="vertical" spacing="default"></ui-divider>
        <span>About</span>
        <ui-divider orientation="vertical" spacing="default"></ui-divider>
        <span>Contact</span>
      </div>
    `,
  }),
};

// ── With Label ────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [DividerComponent] },
    template: `
      <div class="space-y-6 max-w-sm">
        <div>
          <p class="text-sm mb-1 text-muted-foreground">Default label</p>
          <ui-divider label="Or continue with"></ui-divider>
        </div>
        <div>
          <p class="text-sm mb-1 text-muted-foreground">Dashed with label</p>
          <ui-divider variant="dashed" label="Section Break"></ui-divider>
        </div>
        <div>
          <p class="text-sm mb-1 text-muted-foreground">Dotted with label</p>
          <ui-divider variant="dotted" label="More Options"></ui-divider>
        </div>
      </div>
    `,
  }),
};
