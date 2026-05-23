// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ListGroupComponent, ListGroupItemComponent } from './list-group.component';
import { BadgeComponent } from '../badge/badge.component';

const ALL = [ListGroupComponent, ListGroupItemComponent];

const meta: Meta<ListGroupComponent> = {
  title: 'Display/ListGroup',
  component: ListGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'flush'] },
  },
};
export default meta;
type Story = StoryObj<ListGroupComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
          <div class="w-64">
            <ui-list-group variant="default">
              <ui-list-group-item>Dashboard</ui-list-group-item>
              <ui-list-group-item [active]="true">Orders (active)</ui-list-group-item>
              <ui-list-group-item>Machines</ui-list-group-item>
              <ui-list-group-item [disabled]="true">Admin (disabled)</ui-list-group-item>
            </ui-list-group>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Flush</p>
          <div class="w-64">
            <ui-list-group variant="flush">
              <ui-list-group-item>Dashboard</ui-list-group-item>
              <ui-list-group-item [active]="true">Orders (active)</ui-list-group-item>
              <ui-list-group-item>Machines</ui-list-group-item>
              <ui-list-group-item [disabled]="true">Admin (disabled)</ui-list-group-item>
            </ui-list-group>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: ALL },
    props: args,
    template: `
      <div class="w-64">
        <ui-list-group [variant]="variant">
          <ui-list-group-item>Dashboard</ui-list-group-item>
          <ui-list-group-item [active]="true">Orders</ui-list-group-item>
          <ui-list-group-item>Machines</ui-list-group-item>
          <ui-list-group-item>Reports</ui-list-group-item>
          <ui-list-group-item [disabled]="true">Admin (disabled)</ui-list-group-item>
        </ui-list-group>
      </div>
    `,
  }),
  args: { variant: 'default' },
};

// ── Flush ─────────────────────────────────────────────────────────────────────

export const Flush: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="w-64">
        <ui-list-group variant="flush">
          <ui-list-group-item>Item One</ui-list-group-item>
          <ui-list-group-item [active]="true">Item Two (Active)</ui-list-group-item>
          <ui-list-group-item>Item Three</ui-list-group-item>
          <ui-list-group-item>Item Four</ui-list-group-item>
        </ui-list-group>
      </div>
    `,
  }),
};

// ── With Badges ───────────────────────────────────────────────────────────────

export const WithBadges: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, BadgeComponent] },
    template: `
      <div class="w-72">
        <ui-list-group>
          <a uiListGroupItem href="#" class="flex items-center justify-between">
            Dashboard
          </a>
          <a uiListGroupItem href="#" [active]="true" class="flex items-center justify-between">
            Orders
            <ui-badge variant="default" shape="pill">14</ui-badge>
          </a>
          <a uiListGroupItem href="#" class="flex items-center justify-between">
            Machines
            <ui-badge variant="warning" shape="pill">2</ui-badge>
          </a>
          <a uiListGroupItem href="#" class="flex items-center justify-between">
            Reports
          </a>
          <a uiListGroupItem href="#" class="flex items-center justify-between">
            Notifications
            <ui-badge variant="destructive" shape="pill">3</ui-badge>
          </a>
        </ui-list-group>
      </div>
    `,
  }),
};

// ── As Links ──────────────────────────────────────────────────────────────────

export const AsLinks: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="w-64">
        <ui-list-group>
          <a uiListGroupItem href="#">Home</a>
          <a uiListGroupItem href="#" [active]="true">About Us</a>
          <a uiListGroupItem href="#">Products</a>
          <a uiListGroupItem href="#">Contact</a>
        </ui-list-group>
      </div>
    `,
  }),
};
