// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from './tabs.component';

const ALL = [TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent];

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pills', 'card'],
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};
export default meta;
type Story = StoryObj<TabsComponent>;

const CONTENT_CLASSES = 'p-4 rounded-md border text-sm text-muted-foreground';

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-tabs value="account" class="w-96">
        <ui-tabs-list class="w-full">
          <ui-tabs-trigger value="account">Account</ui-tabs-trigger>
          <ui-tabs-trigger value="password">Password</ui-tabs-trigger>
          <ui-tabs-trigger value="settings">Settings</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="account" class="${CONTENT_CLASSES}">Account details go here.</ui-tabs-content>
        <ui-tabs-content value="password" class="${CONTENT_CLASSES}">Change your password here.</ui-tabs-content>
        <ui-tabs-content value="settings" class="${CONTENT_CLASSES}">Settings panel content.</ui-tabs-content>
      </ui-tabs>
    `,
  }),
};

// ── Underline ─────────────────────────────────────────────────────────────────

export const Underline: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-tabs value="overview" variant="underline" class="w-96">
        <ui-tabs-list class="w-full border-b">
          <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
          <ui-tabs-trigger value="analytics">Analytics</ui-tabs-trigger>
          <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="overview" class="p-4 text-sm text-muted-foreground">Overview content.</ui-tabs-content>
        <ui-tabs-content value="analytics" class="p-4 text-sm text-muted-foreground">Analytics dashboard.</ui-tabs-content>
        <ui-tabs-content value="reports" class="p-4 text-sm text-muted-foreground">Reports list.</ui-tabs-content>
      </ui-tabs>
    `,
  }),
};

// ── Pills ─────────────────────────────────────────────────────────────────────

export const Pills: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-tabs value="daily" variant="pills" class="w-96">
        <ui-tabs-list>
          <ui-tabs-trigger value="daily">Daily</ui-tabs-trigger>
          <ui-tabs-trigger value="weekly">Weekly</ui-tabs-trigger>
          <ui-tabs-trigger value="monthly">Monthly</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="daily" class="p-4 text-sm text-muted-foreground">Daily view content.</ui-tabs-content>
        <ui-tabs-content value="weekly" class="p-4 text-sm text-muted-foreground">Weekly view content.</ui-tabs-content>
        <ui-tabs-content value="monthly" class="p-4 text-sm text-muted-foreground">Monthly view content.</ui-tabs-content>
      </ui-tabs>
    `,
  }),
};

// ── Card ──────────────────────────────────────────────────────────────────────

export const Card: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-tabs value="inbox" variant="card" class="w-96">
        <ui-tabs-list>
          <ui-tabs-trigger value="inbox">Inbox</ui-tabs-trigger>
          <ui-tabs-trigger value="snoozed">Snoozed</ui-tabs-trigger>
          <ui-tabs-trigger value="sent">Sent</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="inbox" class="p-4 text-sm text-muted-foreground">Inbox messages.</ui-tabs-content>
        <ui-tabs-content value="snoozed" class="p-4 text-sm text-muted-foreground">Snoozed messages.</ui-tabs-content>
        <ui-tabs-content value="sent" class="p-4 text-sm text-muted-foreground">Sent messages.</ui-tabs-content>
      </ui-tabs>
    `,
  }),
};

// ── With Disabled Tab ─────────────────────────────────────────────────────────

export const WithDisabled: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-tabs value="active" class="w-96">
        <ui-tabs-list>
          <ui-tabs-trigger value="active">Active</ui-tabs-trigger>
          <ui-tabs-trigger value="disabled" [disabled]="true">Disabled</ui-tabs-trigger>
          <ui-tabs-trigger value="other">Other</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="active" class="p-4 text-sm text-muted-foreground">Active tab content.</ui-tabs-content>
        <ui-tabs-content value="other" class="p-4 text-sm text-muted-foreground">Other tab content.</ui-tabs-content>
      </ui-tabs>
    `,
  }),
};

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-8 w-96">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
          <ui-tabs value="tab1">
            <ui-tabs-list class="w-full">
              <ui-tabs-trigger value="tab1">Inbox</ui-tabs-trigger>
              <ui-tabs-trigger value="tab2">Snoozed</ui-tabs-trigger>
              <ui-tabs-trigger value="tab3">Sent</ui-tabs-trigger>
            </ui-tabs-list>
          </ui-tabs>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Underline</p>
          <ui-tabs value="tab2" variant="underline">
            <ui-tabs-list class="w-full">
              <ui-tabs-trigger value="tab1">Inbox</ui-tabs-trigger>
              <ui-tabs-trigger value="tab2">Snoozed</ui-tabs-trigger>
              <ui-tabs-trigger value="tab3">Sent</ui-tabs-trigger>
            </ui-tabs-list>
          </ui-tabs>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pills</p>
          <ui-tabs value="tab2" variant="pills">
            <ui-tabs-list>
              <ui-tabs-trigger value="tab1">Inbox</ui-tabs-trigger>
              <ui-tabs-trigger value="tab2">Snoozed</ui-tabs-trigger>
              <ui-tabs-trigger value="tab3">Sent</ui-tabs-trigger>
            </ui-tabs-list>
          </ui-tabs>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Card</p>
          <ui-tabs value="tab2" variant="card">
            <ui-tabs-list>
              <ui-tabs-trigger value="tab1">Inbox</ui-tabs-trigger>
              <ui-tabs-trigger value="tab2">Snoozed</ui-tabs-trigger>
              <ui-tabs-trigger value="tab3">Sent</ui-tabs-trigger>
            </ui-tabs-list>
          </ui-tabs>
        </div>
      </div>
    `,
  }),
};
