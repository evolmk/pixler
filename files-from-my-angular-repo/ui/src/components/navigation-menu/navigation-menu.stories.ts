// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkDirective,
} from './navigation-menu.component';

const ALL = [
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkDirective,
];

const meta: Meta<NavigationMenuComponent> = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenuComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '420px' } },
  },
};
export default meta;
type Story = StoryObj<NavigationMenuComponent>;

// ── Default (Links only) ──────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-nav-menu>
        <ui-nav-menu-list>
          <ui-nav-menu-item>
            <a uiNavMenuLink href="#">Home</a>
          </ui-nav-menu-item>
          <ui-nav-menu-item>
            <a uiNavMenuLink href="#">About</a>
          </ui-nav-menu-item>
          <ui-nav-menu-item>
            <a uiNavMenuLink href="#" [active]="true">Products</a>
          </ui-nav-menu-item>
          <ui-nav-menu-item>
            <a uiNavMenuLink href="#">Contact</a>
          </ui-nav-menu-item>
        </ui-nav-menu-list>
      </ui-nav-menu>
    `,
  }),
};

// ── With Dropdown Content ─────────────────────────────────────────────────────

export const WithContent: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-nav-menu>
        <ui-nav-menu-list>
          <ui-nav-menu-item>
            <a uiNavMenuLink href="#">Home</a>
          </ui-nav-menu-item>

          <ui-nav-menu-item>
            <ui-nav-menu-trigger>Products</ui-nav-menu-trigger>
            <ui-nav-menu-content>
              <div class="grid grid-cols-2 gap-2 w-[400px]">
                <div class="space-y-2">
                  <h4 class="text-sm font-semibold">Capping Machines</h4>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Rotary Cappers
                  </a>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Inline Cappers
                  </a>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Snap Cappers
                  </a>
                </div>
                <div class="space-y-2">
                  <h4 class="text-sm font-semibold">Accessories</h4>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Conveyor Systems
                  </a>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Cap Sorting Bowls
                  </a>
                  <a uiNavMenuLink href="#" class="block text-sm text-muted-foreground hover:text-foreground">
                    Torque Testers
                  </a>
                </div>
              </div>
            </ui-nav-menu-content>
          </ui-nav-menu-item>

          <ui-nav-menu-item>
            <ui-nav-menu-trigger>Solutions</ui-nav-menu-trigger>
            <ui-nav-menu-content>
              <div class="w-64 space-y-1">
                <a uiNavMenuLink href="#" class="flex flex-col gap-1 p-2 rounded-md hover:bg-accent">
                  <span class="text-sm font-medium">Beverage Industry</span>
                  <span class="text-xs text-muted-foreground">High-speed bottling lines</span>
                </a>
                <a uiNavMenuLink href="#" class="flex flex-col gap-1 p-2 rounded-md hover:bg-accent">
                  <span class="text-sm font-medium">Pharmaceuticals</span>
                  <span class="text-xs text-muted-foreground">Precision torque control</span>
                </a>
                <a uiNavMenuLink href="#" class="flex flex-col gap-1 p-2 rounded-md hover:bg-accent">
                  <span class="text-sm font-medium">Personal Care</span>
                  <span class="text-xs text-muted-foreground">Gentle handling for cosmetics</span>
                </a>
              </div>
            </ui-nav-menu-content>
          </ui-nav-menu-item>

          <ui-nav-menu-item>
            <a uiNavMenuLink href="#">Contact</a>
          </ui-nav-menu-item>
        </ui-nav-menu-list>
      </ui-nav-menu>
    `,
  }),
};

// ── With Active States ────────────────────────────────────────────────────────

export const WithActiveStates: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4">
        <p class="text-xs text-muted-foreground">Navigation with active link highlighted:</p>
        <ui-nav-menu>
          <ui-nav-menu-list>
            <ui-nav-menu-item>
              <a uiNavMenuLink href="#">Dashboard</a>
            </ui-nav-menu-item>
            <ui-nav-menu-item>
              <a uiNavMenuLink href="#" [active]="true">Orders</a>
            </ui-nav-menu-item>
            <ui-nav-menu-item>
              <a uiNavMenuLink href="#">Machines</a>
            </ui-nav-menu-item>
            <ui-nav-menu-item>
              <a uiNavMenuLink href="#">Reports</a>
            </ui-nav-menu-item>
            <ui-nav-menu-item>
              <a uiNavMenuLink href="#">Settings</a>
            </ui-nav-menu-item>
          </ui-nav-menu-list>
        </ui-nav-menu>
      </div>
    `,
  }),
};
