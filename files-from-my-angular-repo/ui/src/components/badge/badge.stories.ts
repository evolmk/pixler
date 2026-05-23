// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
    },
    dark: { control: 'boolean' },
    shape: {
      control: 'select',
      options: ['default', 'square', 'pill'],
    },
  },
};
export default meta;
type Story = StoryObj<BadgeComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Soft (default)</p>
          <div class="flex flex-wrap gap-2">
            <ui-badge variant="default">Default</ui-badge>
            <ui-badge variant="secondary">Secondary</ui-badge>
            <ui-badge variant="outline">Outline</ui-badge>
            <ui-badge variant="destructive">Destructive</ui-badge>
            <ui-badge variant="success">Success</ui-badge>
            <ui-badge variant="warning">Warning</ui-badge>
            <ui-badge variant="info">Info</ui-badge>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dark</p>
          <div class="flex flex-wrap gap-2">
            <ui-badge variant="default" [dark]="true">Default</ui-badge>
            <ui-badge variant="secondary" [dark]="true">Secondary</ui-badge>
            <ui-badge variant="outline">Outline</ui-badge>
            <ui-badge variant="destructive" [dark]="true">Destructive</ui-badge>
            <ui-badge variant="success" [dark]="true">Success</ui-badge>
            <ui-badge variant="warning" [dark]="true">Warning</ui-badge>
            <ui-badge variant="info" [dark]="true">Info</ui-badge>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex flex-wrap gap-2">
            <ui-badge shape="default">Default</ui-badge>
            <ui-badge shape="square">Square</ui-badge>
            <ui-badge shape="pill">Pill</ui-badge>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [BadgeComponent] },
    props: args,
    template: `<ui-badge [variant]="variant" [dark]="dark" [shape]="shape">Badge</ui-badge>`,
  }),
  args: {
    variant: 'default',
    dark: false,
    shape: 'default',
  },
};

// ── Status Use-case ───────────────────────────────────────────────────────────

export const StatusBadges: Story = {
  render: () => ({
    moduleMetadata: { imports: [BadgeComponent] },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Soft</p>
          <div class="flex flex-wrap gap-2">
            <ui-badge variant="success" shape="pill">Active</ui-badge>
            <ui-badge variant="warning" shape="pill">Pending</ui-badge>
            <ui-badge variant="destructive" shape="pill">Rejected</ui-badge>
            <ui-badge variant="info" shape="pill">Draft</ui-badge>
            <ui-badge variant="secondary" shape="pill">Archived</ui-badge>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dark</p>
          <div class="flex flex-wrap gap-2">
            <ui-badge variant="success" shape="pill" [dark]="true">Active</ui-badge>
            <ui-badge variant="warning" shape="pill" [dark]="true">Pending</ui-badge>
            <ui-badge variant="destructive" shape="pill" [dark]="true">Rejected</ui-badge>
            <ui-badge variant="info" shape="pill" [dark]="true">Draft</ui-badge>
            <ui-badge variant="secondary" shape="pill" [dark]="true">Archived</ui-badge>
          </div>
        </div>
      </div>
    `,
  }),
};
