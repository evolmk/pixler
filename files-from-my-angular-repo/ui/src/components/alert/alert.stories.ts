// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent, AlertTitleComponent, AlertDescriptionComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'Feedback/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info', 'soft'],
    },
  },
};
export default meta;
type Story = StoryObj<AlertComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [AlertComponent, AlertTitleComponent, AlertDescriptionComponent] },
    template: `
      <div class="flex flex-col gap-4 max-w-xl">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
          <ui-alert variant="default">
            <ui-alert-title>Default</ui-alert-title>
            <ui-alert-description>This is a default alert message.</ui-alert-description>
          </ui-alert>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Info</p>
          <ui-alert variant="info">
            <ui-alert-title>Info</ui-alert-title>
            <ui-alert-description>Your subscription renews in 3 days.</ui-alert-description>
          </ui-alert>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Success</p>
          <ui-alert variant="success">
            <ui-alert-title>Success</ui-alert-title>
            <ui-alert-description>Your changes have been saved successfully.</ui-alert-description>
          </ui-alert>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Warning</p>
          <ui-alert variant="warning">
            <ui-alert-title>Warning</ui-alert-title>
            <ui-alert-description>Your account storage is almost full.</ui-alert-description>
          </ui-alert>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Destructive</p>
          <ui-alert variant="destructive">
            <ui-alert-title>Error</ui-alert-title>
            <ui-alert-description>Your session has expired. Please log in again.</ui-alert-description>
          </ui-alert>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Soft</p>
          <ui-alert variant="soft">
            <ui-alert-title>Note</ui-alert-title>
            <ui-alert-description>Some content requires additional permissions.</ui-alert-description>
          </ui-alert>
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [AlertComponent, AlertTitleComponent, AlertDescriptionComponent] },
    props: args,
    template: `
      <ui-alert [variant]="variant">
        <ui-alert-title>Heads up!</ui-alert-title>
        <ui-alert-description>You can add components and dependencies to your app.</ui-alert-description>
      </ui-alert>
    `,
  }),
  args: { variant: 'default' },
};

// ── Title Only ────────────────────────────────────────────────────────────────

export const TitleOnly: Story = {
  render: () => ({
    moduleMetadata: { imports: [AlertComponent, AlertTitleComponent] },
    template: `
      <ui-alert variant="info" class="max-w-xl">
        <ui-alert-title>New feature available — try it now!</ui-alert-title>
      </ui-alert>
    `,
  }),
};
