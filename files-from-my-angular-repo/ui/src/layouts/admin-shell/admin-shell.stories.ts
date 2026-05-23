// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { LayoutDashboard, Package, Settings, ShoppingCart } from 'lucide-angular';
import { AdminShellComponent, AdminUserMenuDirective } from './admin-shell.component';

const meta: Meta<AdminShellComponent> = {
  title: 'Layout/AdminShell',
  component: AdminShellComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AdminShellComponent>;

const NAV_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Orders',
    route: '/orders',
    icon: ShoppingCart,
    children: [
      { label: 'All Orders', route: '/orders/all' },
      { label: 'Pending', route: '/orders/pending' },
      { label: 'Shipped', route: '/orders/shipped' },
    ],
  },
  { label: 'Machines', route: '/machines', icon: Package },
  { label: 'Reports', route: '/reports', icon: Package },
  { label: 'Settings', route: '/settings', icon: Settings },
];

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [AdminShellComponent, AdminUserMenuDirective] },
    props: {
      navItems: NAV_ITEMS,
      userName: 'Mike Koch',
      userEmail: 'mike@lazarcapper.com',
      userInitials: 'MK',
      notificationCount: 3,
      onLogout: () => console.log('logout'),
      onSettings: () => console.log('settings'),
    },
    template: `
      <div class="h-[600px] overflow-hidden rounded-lg border border-border">
        <ui-admin-shell
          [navItems]="navItems"
          [userName]="userName"
          [userEmail]="userEmail"
          [userInitials]="userInitials"
          [notificationCount]="notificationCount"
          (logoutClicked)="onLogout()"
          (settingsClicked)="onSettings()"
        >
          <ng-template uiAdminUserMenu>
            <a
              href="https://lazarcapper.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-x-2.5 w-full px-3 py-2 text-sm hover:bg-accent transition-colors text-foreground">
              <svg class="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              LazarCapper.com
            </a>
          </ng-template>

          <div class="p-6">
            <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
            <p class="text-muted-foreground">Welcome back, Mike. Here's what's happening.</p>
          </div>
        </ui-admin-shell>
      </div>
    `,
  }),
};

// ── Custom App Name ─────────────────────────────────────────────────────────

export const CustomAppName: Story = {
  render: () => ({
    moduleMetadata: { imports: [AdminShellComponent] },
    props: {
      navItems: NAV_ITEMS,
      userName: 'Christian Meyer',
      userEmail: 'christian@lazarcapper.com',
      userInitials: 'CM',
      notificationCount: 0,
      appName: 'PORTAL',
      showSearch: false,
    },
    template: `
      <div class="h-[600px] overflow-hidden rounded-lg border border-border">
        <ui-admin-shell
          [navItems]="navItems"
          [userName]="userName"
          [userEmail]="userEmail"
          [userInitials]="userInitials"
          [notificationCount]="notificationCount"
          [appName]="appName"
          [showSearch]="showSearch"
        >
          <div class="p-6">
            <h1 class="text-2xl font-bold mb-2">Portal Dashboard</h1>
            <p class="text-muted-foreground">Custom app name, no search bar.</p>
          </div>
        </ui-admin-shell>
      </div>
    `,
  }),
};
