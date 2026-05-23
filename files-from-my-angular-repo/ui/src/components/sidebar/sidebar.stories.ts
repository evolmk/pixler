// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  SidebarComponent,
  SidebarTriggerDirective,
  SidebarHeaderComponent,
  SidebarContentComponent,
  SidebarFooterComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
} from './sidebar.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [
  SidebarComponent,
  SidebarTriggerDirective,
  SidebarHeaderComponent,
  SidebarContentComponent,
  SidebarFooterComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
];

const meta: Meta<SidebarComponent> = {
  title: 'Navigation/Sidebar',
  component: SidebarComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<SidebarComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex h-96 border border-border rounded-lg overflow-hidden">
        <ui-sidebar>
          <ui-sidebar-header>
            <span class="font-bold text-sm">Lazar Technologies</span>
          </ui-sidebar-header>
          <ui-sidebar-content>
            <ui-sidebar-menu>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton [isActive]="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                  Dashboard
                </button>
              </ui-sidebar-menu-item>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Orders
                </button>
              </ui-sidebar-menu-item>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Machines
                </button>
              </ui-sidebar-menu-item>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                  Reports
                </button>
              </ui-sidebar-menu-item>
            </ui-sidebar-menu>
          </ui-sidebar-content>
          <ui-sidebar-footer>
            <button uiSidebarMenuButton>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </button>
          </ui-sidebar-footer>
        </ui-sidebar>
        <div class="flex-1 p-4 text-sm text-muted-foreground">
          Main content area
        </div>
      </div>
    `,
  }),
};

// ── With Groups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex h-96 border border-border rounded-lg overflow-hidden">
        <ui-sidebar>
          <ui-sidebar-header>
            <span class="font-bold text-sm">Lazar Admin</span>
          </ui-sidebar-header>
          <ui-sidebar-content>
            <ui-sidebar-group>
              <ui-sidebar-group-label>Main</ui-sidebar-group-label>
              <ui-sidebar-menu>
                <ui-sidebar-menu-item>
                  <button uiSidebarMenuButton [isActive]="true">Dashboard</button>
                </ui-sidebar-menu-item>
                <ui-sidebar-menu-item>
                  <button uiSidebarMenuButton>Orders</button>
                </ui-sidebar-menu-item>
                <ui-sidebar-menu-item>
                  <button uiSidebarMenuButton>Machines</button>
                </ui-sidebar-menu-item>
              </ui-sidebar-menu>
            </ui-sidebar-group>
            <ui-sidebar-group>
              <ui-sidebar-group-label>Analytics</ui-sidebar-group-label>
              <ui-sidebar-menu>
                <ui-sidebar-menu-item>
                  <button uiSidebarMenuButton>Reports</button>
                </ui-sidebar-menu-item>
                <ui-sidebar-menu-item>
                  <button uiSidebarMenuButton>Performance</button>
                </ui-sidebar-menu-item>
              </ui-sidebar-menu>
            </ui-sidebar-group>
          </ui-sidebar-content>
        </ui-sidebar>
        <div class="flex-1 p-4 text-sm text-muted-foreground">Main content area</div>
      </div>
    `,
  }),
};

// ── Collapsed ─────────────────────────────────────────────────────────────────

export const Collapsed: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    props: { collapsed: true },
    template: `
      <div class="flex h-64 border border-border rounded-lg overflow-hidden">
        <ui-sidebar [(collapsed)]="collapsed">
          <ui-sidebar-header>
            <span class="font-bold text-sm truncate">Lazar</span>
          </ui-sidebar-header>
          <ui-sidebar-content>
            <ui-sidebar-menu>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton [isActive]="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                  Dashboard
                </button>
              </ui-sidebar-menu-item>
              <ui-sidebar-menu-item>
                <button uiSidebarMenuButton>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/></svg>
                  Orders
                </button>
              </ui-sidebar-menu-item>
            </ui-sidebar-menu>
          </ui-sidebar-content>
        </ui-sidebar>
        <div class="flex-1 p-4 text-sm text-muted-foreground">Sidebar starts collapsed</div>
      </div>
    `,
  }),
};
