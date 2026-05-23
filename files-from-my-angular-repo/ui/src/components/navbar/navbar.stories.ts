// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  NavbarToggleComponent,
} from './navbar.component';
import { ButtonComponent } from '../button/button.component';
import { AvatarComponent, AvatarFallbackComponent } from '../avatar/avatar.component';

const ALL = [
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  NavbarToggleComponent,
];

const meta: Meta<NavbarComponent> = {
  title: 'Navigation/Navbar',
  component: NavbarComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<NavbarComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-navbar>
        <ui-navbar-brand>Lazar</ui-navbar-brand>
        <ui-navbar-nav>
          <a uiNavbarItem [active]="true" href="#">Dashboard</a>
          <a uiNavbarItem href="#">Orders</a>
          <a uiNavbarItem href="#">Machines</a>
          <a uiNavbarItem href="#">Reports</a>
        </ui-navbar-nav>
        <ui-navbar-actions>
          <ui-button variant="ghost" size="sm">Sign In</ui-button>
          <ui-button size="sm">Get Started</ui-button>
        </ui-navbar-actions>
        <ui-navbar-toggle></ui-navbar-toggle>
      </ui-navbar>
    `,
  }),
};

// ── With Avatar ───────────────────────────────────────────────────────────────

export const WithAvatar: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent, AvatarComponent, AvatarFallbackComponent] },
    template: `
      <ui-navbar>
        <ui-navbar-brand>
          <span class="font-bold text-lazar-green">Lazar</span>
          <span class="text-muted-foreground text-sm ml-1">Technologies</span>
        </ui-navbar-brand>
        <ui-navbar-nav>
          <a uiNavbarItem href="#">Dashboard</a>
          <a uiNavbarItem [active]="true" href="#">Orders</a>
          <a uiNavbarItem href="#">Machines</a>
          <a uiNavbarItem href="#">Reports</a>
          <a uiNavbarItem href="#">Settings</a>
        </ui-navbar-nav>
        <ui-navbar-actions>
          <ui-avatar size="sm">
            <ui-avatar-fallback>MK</ui-avatar-fallback>
          </ui-avatar>
        </ui-navbar-actions>
        <ui-navbar-toggle></ui-navbar-toggle>
      </ui-navbar>
    `,
  }),
};

// ── Sticky ────────────────────────────────────────────────────────────────────

export const Sticky: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-navbar [sticky]="true">
        <ui-navbar-brand>Lazar</ui-navbar-brand>
        <ui-navbar-nav>
          <a uiNavbarItem [active]="true" href="#">Dashboard</a>
          <a uiNavbarItem href="#">Orders</a>
          <a uiNavbarItem href="#">Machines</a>
        </ui-navbar-nav>
        <ui-navbar-actions>
          <ui-button variant="outline" size="sm">Sticky Navbar</ui-button>
        </ui-navbar-actions>
      </ui-navbar>
    `,
  }),
};
