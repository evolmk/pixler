// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { StateComponent } from './state.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<StateComponent> = {
  title: 'Feedback/State',
  component: StateComponent,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['empty', 'error', 'warning', 'success'],
    },
  },
};
export default meta;
type Story = StoryObj<StateComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent] },
    template: `
      <div class="grid grid-cols-2 gap-8">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Empty</p>
          <div class="rounded-lg border border-border p-4">
            <ui-state state="empty" description="Nothing to see here yet." class="py-4"></ui-state>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Error</p>
          <div class="rounded-lg border border-border p-4">
            <ui-state state="error" description="Houston, we have a problem." class="py-4"></ui-state>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Warning</p>
          <div class="rounded-lg border border-border p-4">
            <ui-state state="warning" description="This action cannot be undone." class="py-4"></ui-state>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Success</p>
          <div class="rounded-lg border border-border p-4">
            <ui-state state="success" description="All systems are fully operational." class="py-4"></ui-state>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── With Custom Title & Description ──────────────────────────────────────────

export const WithDescription: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent] },
    template: `
      <ui-state
        state="empty"
        title="No orders found"
        description="You haven't placed any orders yet. Start by browsing our product catalog."
      ></ui-state>
    `,
  }),
};

// ── Error With Description ───────────────────────────────────────────────────

export const ErrorWithDescription: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent] },
    template: `
      <ui-state
        state="error"
        title="Failed to load data"
        description="An unexpected error occurred. Please try again or contact support."
      ></ui-state>
    `,
  }),
};

// ── Warning With Description ─────────────────────────────────────────────────

export const WarningWithDescription: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent] },
    template: `
      <ui-state
        state="warning"
        title="Unsaved changes"
        description="You have pending changes that haven't been saved yet."
      ></ui-state>
    `,
  }),
};

// ── Success With Description ─────────────────────────────────────────────────

export const SuccessWithDescription: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent] },
    template: `
      <ui-state
        state="success"
        title="Order submitted"
        description="Your order #12345 has been placed and is being processed."
      ></ui-state>
    `,
  }),
};

// ── With Actions ─────────────────────────────────────────────────────────────

export const WithActions: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent, ButtonComponent] },
    template: `
      <ui-state
        state="empty"
        title="No machines registered"
        description="Add your first capping machine to start tracking performance."
      >
        <ng-container actions>
          <div class="flex gap-2 mt-4">
            <ui-button variant="outline" size="sm">Learn More</ui-button>
            <ui-button size="sm">Add Machine</ui-button>
          </div>
        </ng-container>
      </ui-state>
    `,
  }),
};

// ── Error With Retry Action ──────────────────────────────────────────────────

export const ErrorWithRetry: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent, ButtonComponent] },
    template: `
      <ui-state
        state="error"
        title="Connection lost"
        description="We couldn't reach the server. Check your network and try again."
      >
        <ng-container actions>
          <div class="mt-4">
            <ui-button size="sm">Retry</ui-button>
          </div>
        </ng-container>
      </ui-state>
    `,
  }),
};

// ── With Custom Icon ─────────────────────────────────────────────────────────

export const WithCustomIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent, ButtonComponent] },
    template: `
      <ui-state
        title="No search results"
        description="Try adjusting your search terms or clearing the filters."
      >
        <ng-container icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </ng-container>
        <ng-container actions>
          <div class="mt-4">
            <ui-button variant="outline" size="sm">Clear Filters</ui-button>
          </div>
        </ng-container>
      </ui-state>
    `,
  }),
};

// ── In Table Context ─────────────────────────────────────────────────────────

export const InTableContext: Story = {
  render: () => ({
    moduleMetadata: { imports: [StateComponent, ButtonComponent] },
    template: `
      <div class="rounded-lg border border-border">
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h3 class="text-sm font-medium">Recent Orders</h3>
          <ui-button size="sm" variant="outline">New Order</ui-button>
        </div>
        <div class="py-8">
          <ui-state
            title="No orders yet"
            description="Orders will appear here once customers start placing them."
          >
            <ng-container actions>
              <div class="mt-4">
                <ui-button size="sm">Create First Order</ui-button>
              </div>
            </ng-container>
          </ui-state>
        </div>
      </div>
    `,
  }),
};
