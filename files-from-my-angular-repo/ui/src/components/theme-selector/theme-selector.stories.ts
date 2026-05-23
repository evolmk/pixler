// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ThemeSelectorComponent } from './theme-selector.component';

// ── Components for theme preview ─────────────────────────────────────────────
import { ButtonComponent } from '../button/button.component';
import { BadgeComponent } from '../badge/badge.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent,
  CardDescriptionComponent, CardContentComponent, CardFooterComponent,
} from '../card/card.component';
import { LabelComponent } from '../label/label.directive';
import { InputComponent } from '../input/input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { SwitchComponent } from '../switch/switch.component';
import {
  SelectComponent, SelectTriggerComponent, SelectValueComponent,
  SelectContentComponent, SelectItemComponent,
} from '../select/select.component';
import { SeparatorComponent } from '../separator/separator.component';
import { ProgressComponent } from '../progress/progress.component';
import {
  AvatarComponent, AvatarImageComponent, AvatarFallbackComponent,
} from '../avatar/avatar.component';
import {
  TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent,
} from '../tabs/tabs.component';
import {
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../table/table.component';
import {
  AlertComponent, AlertTitleComponent, AlertDescriptionComponent,
} from '../alert/alert.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { IconComponent } from '../icon/icon.component';
import {
  DollarSign, Users, CreditCard, Github, Mail,
  Bell, CircleCheck, TriangleAlert, Copy, Ellipsis,
} from 'lucide-angular';

// ── Shared imports ───────────────────────────────────────────────────────────

const PREVIEW_IMPORTS = [
  ThemeSelectorComponent, ButtonComponent, BadgeComponent,
  CardComponent, CardHeaderComponent, CardTitleComponent,
  CardDescriptionComponent, CardContentComponent, CardFooterComponent,
  LabelComponent, InputComponent, TextareaComponent,
  SwitchComponent,
  SelectComponent, SelectTriggerComponent, SelectValueComponent,
  SelectContentComponent, SelectItemComponent,
  SeparatorComponent, ProgressComponent,
  AvatarComponent, AvatarImageComponent, AvatarFallbackComponent,
  TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
  AlertComponent, AlertTitleComponent, AlertDescriptionComponent,
  CalendarComponent, IconComponent,
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<ThemeSelectorComponent> = {
  title: 'Components/ThemeSelector',
  component: ThemeSelectorComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<ThemeSelectorComponent>;

// ── Theme Preview (primary — shown first on docs page) ───────────────────────

export const ThemePreview: Story = {
  parameters: {
    docs: {
      source: { code: '', language: 'html' },
    },
  },
  render: () => ({
    moduleMetadata: { imports: PREVIEW_IMPORTS },
    props: {
      dollarSign: DollarSign,
      users: Users,
      creditCard: CreditCard,
      github: Github,
      mail: Mail,
      bell: Bell,
      circleCheck: CircleCheck,
      triangleAlert: TriangleAlert,
      copy: Copy,
      ellipsis: Ellipsis,
    },
    template: `
      <div class="flex gap-6 items-start p-4">
        <!-- Left: Theme Selector (sticky) -->
        <div class="shrink-0 sticky top-4 rounded-lg border border-border shadow-lg overflow-hidden">
          <ui-theme-selector></ui-theme-selector>
        </div>

        <!-- Right: Component Preview -->
        <div class="flex-1 min-w-0 space-y-6">

          <!-- ── Row 1: Stat cards ─────────────────────────────── -->
          <div class="grid grid-cols-3 gap-4">
            <!-- Total Revenue -->
            <ui-card>
              <ui-card-header>
                <div class="flex items-center justify-between">
                  <ui-card-title class="text-sm font-medium">Total Revenue</ui-card-title>
                  <ui-icon [name]="dollarSign" size="sm" class="text-muted-foreground" />
                </div>
              </ui-card-header>
              <ui-card-content>
                <div class="text-2xl font-bold">$15,231.89</div>
                <p class="text-xs text-muted-foreground">+20.1% from last month</p>
              </ui-card-content>
            </ui-card>

            <!-- Active Users -->
            <ui-card>
              <ui-card-header>
                <div class="flex items-center justify-between">
                  <ui-card-title class="text-sm font-medium">Active Users</ui-card-title>
                  <ui-icon [name]="users" size="sm" class="text-muted-foreground" />
                </div>
              </ui-card-header>
              <ui-card-content>
                <div class="text-2xl font-bold">+2,350</div>
                <p class="text-xs text-muted-foreground">+180.1% from last month</p>
              </ui-card-content>
            </ui-card>

            <!-- Pending Orders -->
            <ui-card>
              <ui-card-header>
                <div class="flex items-center justify-between">
                  <ui-card-title class="text-sm font-medium">Pending Orders</ui-card-title>
                  <ui-icon [name]="creditCard" size="sm" class="text-muted-foreground" />
                </div>
              </ui-card-header>
              <ui-card-content>
                <div class="text-2xl font-bold">+12</div>
                <ui-progress [value]="68" class="mt-2" />
              </ui-card-content>
            </ui-card>
          </div>

          <!-- ── Row 2: Forms + Calendar ──────────────────────── -->
          <div class="grid grid-cols-3 gap-4">

            <!-- Create Account Card -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Create an account</ui-card-title>
                <ui-card-description>Enter your email below to create your account.</ui-card-description>
              </ui-card-header>
              <ui-card-content class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <ui-button variant="outline" class="w-full">
                    <ui-icon [name]="github" size="sm" />
                    GitHub
                  </ui-button>
                  <ui-button variant="outline" class="w-full">
                    <ui-icon [name]="mail" size="sm" />
                    Google
                  </ui-button>
                </div>
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <ui-separator />
                  </div>
                  <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <label uiLabel>Email</label>
                  <input uiInput placeholder="m&#64;example.com" />
                </div>
                <div class="space-y-2">
                  <label uiLabel>Password</label>
                  <input uiInput type="password" />
                </div>
              </ui-card-content>
              <ui-card-footer>
                <ui-button class="w-full">Create Account</ui-button>
              </ui-card-footer>
            </ui-card>

            <!-- Calendar -->
            <ui-card>
              <ui-card-content class="p-3 flex items-center justify-center">
                <ui-calendar />
              </ui-card-content>
            </ui-card>

            <!-- Notifications Card -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Notifications</ui-card-title>
                <ui-card-description>You have 3 unread messages.</ui-card-description>
              </ui-card-header>
              <ui-card-content class="space-y-4">
                <div class="flex items-start gap-3">
                  <ui-icon [name]="bell" size="sm" class="mt-0.5 text-primary" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">New order received</p>
                    <p class="text-xs text-muted-foreground">ORD-4521 from Acme Corp</p>
                  </div>
                  <span class="text-xs text-muted-foreground">2m ago</span>
                </div>
                <ui-separator />
                <div class="flex items-start gap-3">
                  <ui-icon [name]="circleCheck" size="sm" class="mt-0.5 text-green-500" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">Payment confirmed</p>
                    <p class="text-xs text-muted-foreground">$12,400 from BevCo Industries</p>
                  </div>
                  <span class="text-xs text-muted-foreground">1h ago</span>
                </div>
                <ui-separator />
                <div class="flex items-start gap-3">
                  <ui-icon [name]="triangleAlert" size="sm" class="mt-0.5 text-yellow-500" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">Low inventory alert</p>
                    <p class="text-xs text-muted-foreground">LZR-800 parts below threshold</p>
                  </div>
                  <span class="text-xs text-muted-foreground">3h ago</span>
                </div>
              </ui-card-content>
              <ui-card-footer>
                <ui-button variant="outline" class="w-full">View all</ui-button>
              </ui-card-footer>
            </ui-card>
          </div>

          <!-- ── Row 3: Table + Settings ──────────────────────── -->
          <div class="grid grid-cols-5 gap-4">

            <!-- Payments Table (wider) -->
            <ui-card class="col-span-3">
              <ui-card-header>
                <div class="flex items-center justify-between">
                  <div>
                    <ui-card-title>Recent Payments</ui-card-title>
                    <ui-card-description>Manage your recent transactions.</ui-card-description>
                  </div>
                  <ui-button size="sm">Add Payment</ui-button>
                </div>
              </ui-card-header>
              <ui-card-content>
                <ui-table>
                  <ui-table-header>
                    <ui-table-row>
                      <ui-table-head>Status</ui-table-head>
                      <ui-table-head>Email</ui-table-head>
                      <ui-table-head class="text-right">Amount</ui-table-head>
                      <ui-table-head class="w-10"></ui-table-head>
                    </ui-table-row>
                  </ui-table-header>
                  <ui-table-body>
                    <ui-table-row>
                      <ui-table-cell><ui-badge variant="success" shape="pill">Success</ui-badge></ui-table-cell>
                      <ui-table-cell>ken99&#64;example.com</ui-table-cell>
                      <ui-table-cell class="text-right font-medium">$316.00</ui-table-cell>
                      <ui-table-cell><ui-icon [name]="ellipsis" size="sm" class="text-muted-foreground" /></ui-table-cell>
                    </ui-table-row>
                    <ui-table-row>
                      <ui-table-cell><ui-badge variant="success" shape="pill">Success</ui-badge></ui-table-cell>
                      <ui-table-cell>abe45&#64;example.com</ui-table-cell>
                      <ui-table-cell class="text-right font-medium">$242.00</ui-table-cell>
                      <ui-table-cell><ui-icon [name]="ellipsis" size="sm" class="text-muted-foreground" /></ui-table-cell>
                    </ui-table-row>
                    <ui-table-row>
                      <ui-table-cell><ui-badge variant="warning" shape="pill">Processing</ui-badge></ui-table-cell>
                      <ui-table-cell>monserrat44&#64;example.com</ui-table-cell>
                      <ui-table-cell class="text-right font-medium">$837.00</ui-table-cell>
                      <ui-table-cell><ui-icon [name]="ellipsis" size="sm" class="text-muted-foreground" /></ui-table-cell>
                    </ui-table-row>
                    <ui-table-row>
                      <ui-table-cell><ui-badge variant="destructive" shape="pill">Failed</ui-badge></ui-table-cell>
                      <ui-table-cell>carmella&#64;example.com</ui-table-cell>
                      <ui-table-cell class="text-right font-medium">$721.00</ui-table-cell>
                      <ui-table-cell><ui-icon [name]="ellipsis" size="sm" class="text-muted-foreground" /></ui-table-cell>
                    </ui-table-row>
                    <ui-table-row>
                      <ui-table-cell><ui-badge variant="info" shape="pill">Pending</ui-badge></ui-table-cell>
                      <ui-table-cell>jason78&#64;example.com</ui-table-cell>
                      <ui-table-cell class="text-right font-medium">$450.00</ui-table-cell>
                      <ui-table-cell><ui-icon [name]="ellipsis" size="sm" class="text-muted-foreground" /></ui-table-cell>
                    </ui-table-row>
                  </ui-table-body>
                </ui-table>
              </ui-card-content>
            </ui-card>

            <!-- Right column: stacked cards -->
            <div class="col-span-2 space-y-4">

              <!-- Team Members -->
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Team Members</ui-card-title>
                  <ui-card-description>Invite your team members to collaborate.</ui-card-description>
                </ui-card-header>
                <ui-card-content class="space-y-3">
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>SD</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Sofia Davis</p>
                      <p class="text-xs text-muted-foreground">m&#64;example.com</p>
                    </div>
                    <ui-badge variant="secondary">Owner</ui-badge>
                  </div>
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>JL</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Jackson Lee</p>
                      <p class="text-xs text-muted-foreground">p&#64;example.com</p>
                    </div>
                    <ui-badge variant="outline">Developer</ui-badge>
                  </div>
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>IN</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Isabella Nguyen</p>
                      <p class="text-xs text-muted-foreground">i&#64;example.com</p>
                    </div>
                    <ui-badge variant="outline">Billing</ui-badge>
                  </div>
                </ui-card-content>
              </ui-card>

              <!-- Cookie Settings -->
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Cookie Settings</ui-card-title>
                  <ui-card-description>Manage your cookie preferences.</ui-card-description>
                </ui-card-header>
                <ui-card-content class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium">Strictly Necessary</p>
                      <p class="text-xs text-muted-foreground">Essential for the site to function.</p>
                    </div>
                    <ui-switch [checked]="true" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium">Functional</p>
                      <p class="text-xs text-muted-foreground">Remember your preferences.</p>
                    </div>
                    <ui-switch />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium">Analytics</p>
                      <p class="text-xs text-muted-foreground">Understand how you use the site.</p>
                    </div>
                    <ui-switch />
                  </div>
                </ui-card-content>
                <ui-card-footer>
                  <ui-button variant="outline" class="w-full">Save preferences</ui-button>
                </ui-card-footer>
              </ui-card>
            </div>
          </div>

          <!-- ── Row 4: Report Issue + Share + Alert ──────────── -->
          <div class="grid grid-cols-3 gap-4">

            <!-- Report an Issue -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Report an issue</ui-card-title>
                <ui-card-description>What area are you having problems with?</ui-card-description>
              </ui-card-header>
              <ui-card-content class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <label uiLabel>Area</label>
                    <ui-select>
                      <ui-select-trigger>
                        <ui-select-value placeholder="Select" />
                      </ui-select-trigger>
                      <ui-select-content>
                        <ui-select-item value="billing">Billing</ui-select-item>
                        <ui-select-item value="support">Support</ui-select-item>
                        <ui-select-item value="account">Account</ui-select-item>
                      </ui-select-content>
                    </ui-select>
                  </div>
                  <div class="space-y-2">
                    <label uiLabel>Severity</label>
                    <ui-select>
                      <ui-select-trigger>
                        <ui-select-value placeholder="Select" />
                      </ui-select-trigger>
                      <ui-select-content>
                        <ui-select-item value="1">Severity 1</ui-select-item>
                        <ui-select-item value="2">Severity 2</ui-select-item>
                        <ui-select-item value="3">Severity 3</ui-select-item>
                      </ui-select-content>
                    </ui-select>
                  </div>
                </div>
                <div class="space-y-2">
                  <label uiLabel>Subject</label>
                  <input uiInput placeholder="I need help with..." />
                </div>
                <div class="space-y-2">
                  <label uiLabel>Description</label>
                  <textarea uiTextarea placeholder="Please include all relevant information."></textarea>
                </div>
              </ui-card-content>
              <ui-card-footer class="flex justify-between">
                <ui-button variant="ghost">Cancel</ui-button>
                <ui-button>Submit</ui-button>
              </ui-card-footer>
            </ui-card>

            <!-- Share Document -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Share this document</ui-card-title>
                <ui-card-description>Anyone with the link can view this document.</ui-card-description>
              </ui-card-header>
              <ui-card-content class="space-y-4">
                <div class="flex gap-2">
                  <input uiInput value="http://example.com/link/to/document" readonly class="flex-1" />
                  <ui-button variant="outline" size="icon">
                    <ui-icon [name]="copy" size="sm" />
                  </ui-button>
                </div>
                <ui-separator />
                <p class="text-sm font-medium">People with access</p>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>OM</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Olivia Martin</p>
                      <p class="text-xs text-muted-foreground">m&#64;example.com</p>
                    </div>
                    <ui-badge variant="secondary">Can edit</ui-badge>
                  </div>
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>IN</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Isabella Nguyen</p>
                      <p class="text-xs text-muted-foreground">b&#64;example.com</p>
                    </div>
                    <ui-badge variant="secondary">Can edit</ui-badge>
                  </div>
                  <div class="flex items-center gap-3">
                    <ui-avatar>
                      <ui-avatar-fallback>SD</ui-avatar-fallback>
                    </ui-avatar>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">Sofia Davis</p>
                      <p class="text-xs text-muted-foreground">p&#64;example.com</p>
                    </div>
                    <ui-badge variant="outline">Can view</ui-badge>
                  </div>
                </div>
              </ui-card-content>
            </ui-card>

            <!-- Tabs + Alerts -->
            <div class="space-y-4">
              <!-- Tabs demo -->
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Account</ui-card-title>
                </ui-card-header>
                <ui-card-content>
                  <ui-tabs value="overview">
                    <ui-tabs-list>
                      <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
                      <ui-tabs-trigger value="analytics">Analytics</ui-tabs-trigger>
                      <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
                    </ui-tabs-list>
                    <ui-tabs-content value="overview">
                      <div class="space-y-3 pt-2">
                        <div class="flex justify-between text-sm">
                          <span class="text-muted-foreground">Orders this month</span>
                          <span class="font-medium">142</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-muted-foreground">Revenue</span>
                          <span class="font-medium">$24,500</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-muted-foreground">Avg. order value</span>
                          <span class="font-medium">$172.50</span>
                        </div>
                      </div>
                    </ui-tabs-content>
                    <ui-tabs-content value="analytics">
                      <p class="pt-2 text-sm text-muted-foreground">Analytics data would appear here.</p>
                    </ui-tabs-content>
                    <ui-tabs-content value="reports">
                      <p class="pt-2 text-sm text-muted-foreground">Reports data would appear here.</p>
                    </ui-tabs-content>
                  </ui-tabs>
                </ui-card-content>
              </ui-card>

              <!-- Alert -->
              <ui-alert variant="info">
                <ui-alert-title>Heads up!</ui-alert-title>
                <ui-alert-description>Switch themes to preview how components look in different color schemes.</ui-alert-description>
              </ui-alert>
            </div>
          </div>

        </div>
      </div>
    `,
  }),
};

// ── Default (standalone selector) ────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ThemeSelectorComponent] },
    template: `<ui-theme-selector></ui-theme-selector>`,
  }),
};

// ── In Popover Context ────────────────────────────────────────────────────────

export const InPopoverContext: Story = {
  render: () => ({
    moduleMetadata: { imports: [ThemeSelectorComponent] },
    template: `
      <div class="flex justify-center">
        <div class="rounded-lg border border-border shadow-lg overflow-hidden">
          <ui-theme-selector></ui-theme-selector>
        </div>
      </div>
    `,
  }),
};
