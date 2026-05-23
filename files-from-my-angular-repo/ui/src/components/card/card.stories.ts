// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from './card.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
];

const meta: Meta<CardComponent> = {
  title: 'Display/Card',
  component: CardComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<CardComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-col gap-8">

        <!-- Default card -->
        <section>
          <h3 class="mb-3 text-sm font-semibold text-muted-foreground">Default</h3>
          <ui-card class="w-80">
            <ui-card-header>
              <ui-card-title>Card Title</ui-card-title>
              <ui-card-description>A short description of the card.</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <p class="text-sm text-muted-foreground">Card body content goes here.</p>
            </ui-card-content>
            <ui-card-footer class="justify-end gap-2">
              <ui-button variant="outline" size="sm">Cancel</ui-button>
              <ui-button variant="default" size="sm">Save</ui-button>
            </ui-card-footer>
          </ui-card>
        </section>

        <!-- Background variants -->
        <section>
          <h3 class="mb-3 text-sm font-semibold text-muted-foreground">Background Variants</h3>
          <div class="grid grid-cols-3 gap-4">
            <ui-card class="bg-background text-foreground">
              <ui-card-header>
                <ui-card-title>bg-background</ui-card-title>
                <ui-card-description>Page background · --background</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-card text-card-foreground">
              <ui-card-header>
                <ui-card-title>bg-card</ui-card-title>
                <ui-card-description>Card surface (default) · --card</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-popover text-popover-foreground">
              <ui-card-header>
                <ui-card-title>bg-popover</ui-card-title>
                <ui-card-description>Popover / dropdown · --popover</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-primary text-primary-foreground">
              <ui-card-header>
                <ui-card-title>bg-primary</ui-card-title>
                <ui-card-description class="text-primary-foreground/70">Primary actions · --primary</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-secondary text-secondary-foreground">
              <ui-card-header>
                <ui-card-title>bg-secondary</ui-card-title>
                <ui-card-description>Secondary surface · --secondary</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-muted text-muted-foreground">
              <ui-card-header>
                <ui-card-title>bg-muted</ui-card-title>
                <ui-card-description>Muted background · --muted</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-accent text-accent-foreground">
              <ui-card-header>
                <ui-card-title>bg-accent</ui-card-title>
                <ui-card-description>Hover / accent · --accent</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-destructive text-destructive-foreground">
              <ui-card-header>
                <ui-card-title>bg-destructive</ui-card-title>
                <ui-card-description class="text-destructive-foreground/70">Error / danger · --destructive</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-sidebar text-sidebar-foreground">
              <ui-card-header>
                <ui-card-title>bg-sidebar</ui-card-title>
                <ui-card-description>Sidebar surface · --sidebar</ui-card-description>
              </ui-card-header>
            </ui-card>
          </div>
        </section>

        <!-- Interactive -->
        <section>
          <h3 class="mb-3 text-sm font-semibold text-muted-foreground">Interactive (hover)</h3>
          <div class="flex gap-4">
            <ui-card class="w-56 cursor-pointer hover:shadow-md transition-shadow">
              <ui-card-header>
                <ui-card-title>Hoverable</ui-card-title>
                <ui-card-description>Hover for shadow</ui-card-description>
              </ui-card-header>
              <ui-card-content>
                <div class="h-16 bg-muted rounded-md"></div>
              </ui-card-content>
            </ui-card>
            <ui-card class="w-56 cursor-pointer hover:shadow-md transition-shadow border-primary/30">
              <ui-card-header>
                <ui-card-title>Highlighted</ui-card-title>
                <ui-card-description>Primary border accent</ui-card-description>
              </ui-card-header>
              <ui-card-content>
                <div class="h-16 bg-primary/10 rounded-md"></div>
              </ui-card-content>
            </ui-card>
          </div>
        </section>

      </div>
    `,
  }),
};

// ── Default (header + content) ────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-card class="w-72">
        <ui-card-header>
          <ui-card-title>Card Title</ui-card-title>
          <ui-card-description>A short description of the card.</ui-card-description>
        </ui-card-header>
        <ui-card-content>
          <p class="text-sm text-muted-foreground">Card body content goes here.</p>
        </ui-card-content>
      </ui-card>
    `,
  }),
};

// ── With Footer ───────────────────────────────────────────────────────────────

export const WithFooter: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-card class="w-72">
        <ui-card-header>
          <ui-card-title>Confirm Action</ui-card-title>
          <ui-card-description>This action cannot be undone.</ui-card-description>
        </ui-card-header>
        <ui-card-content>
          <p class="text-sm text-muted-foreground">All associated data will be permanently removed.</p>
        </ui-card-content>
        <ui-card-footer class="justify-end gap-2">
          <ui-button variant="outline" size="sm">Cancel</ui-button>
          <ui-button variant="destructive" size="sm">Delete</ui-button>
        </ui-card-footer>
      </ui-card>
    `,
  }),
};

// ── Full Card ─────────────────────────────────────────────────────────────────

export const Full: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-card class="w-80">
        <ui-card-header>
          <ui-card-title>Account Settings</ui-card-title>
          <ui-card-description>Manage your account preferences.</ui-card-description>
        </ui-card-header>
        <ui-card-content class="flex flex-col gap-3">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Username</span>
            <span>john_doe</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Email</span>
            <span>john@example.com</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Plan</span>
            <span>Pro</span>
          </div>
        </ui-card-content>
        <ui-card-footer>
          <ui-button variant="outline" size="sm" class="w-full">Edit profile</ui-button>
        </ui-card-footer>
      </ui-card>
    `,
  }),
};

// ── Background Colors ────────────────────────────────────────────────────────

export const BackgroundColors: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6">
        <p class="text-sm font-medium text-muted-foreground">Cards on every semantic background token the theme supports. Switch color scheme &amp; dark mode to see them shift.</p>

        <div class="grid grid-cols-3 gap-4">

          <ui-card class="w-full bg-background text-foreground">
            <ui-card-header>
              <ui-card-title>bg-background</ui-card-title>
              <ui-card-description>Page background · --background</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-card text-card-foreground">
            <ui-card-header>
              <ui-card-title>bg-card</ui-card-title>
              <ui-card-description>Card surface (default) · --card</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-popover text-popover-foreground">
            <ui-card-header>
              <ui-card-title>bg-popover</ui-card-title>
              <ui-card-description>Popover / dropdown · --popover</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-primary text-primary-foreground">
            <ui-card-header>
              <ui-card-title>bg-primary</ui-card-title>
              <ui-card-description class="text-primary-foreground/70">Primary actions · --primary</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-secondary text-secondary-foreground">
            <ui-card-header>
              <ui-card-title>bg-secondary</ui-card-title>
              <ui-card-description>Secondary surface · --secondary</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-muted text-muted-foreground">
            <ui-card-header>
              <ui-card-title>bg-muted</ui-card-title>
              <ui-card-description>Muted background · --muted</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-accent text-accent-foreground">
            <ui-card-header>
              <ui-card-title>bg-accent</ui-card-title>
              <ui-card-description>Hover / accent · --accent</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-destructive text-destructive-foreground">
            <ui-card-header>
              <ui-card-title>bg-destructive</ui-card-title>
              <ui-card-description class="text-destructive-foreground/70">Error / danger · --destructive</ui-card-description>
            </ui-card-header>
          </ui-card>

          <ui-card class="w-full bg-sidebar text-sidebar-foreground">
            <ui-card-header>
              <ui-card-title>bg-sidebar</ui-card-title>
              <ui-card-description>Sidebar surface · --sidebar</ui-card-description>
            </ui-card-header>
          </ui-card>

        </div>

        <p class="text-sm font-medium text-muted-foreground">Chart palette</p>
        <div class="grid grid-cols-5 gap-4">
          <ui-card class="w-full bg-chart-1 text-white">
            <ui-card-header>
              <ui-card-title>chart-1</ui-card-title>
            </ui-card-header>
          </ui-card>
          <ui-card class="w-full bg-chart-2 text-white">
            <ui-card-header>
              <ui-card-title>chart-2</ui-card-title>
            </ui-card-header>
          </ui-card>
          <ui-card class="w-full bg-chart-3 text-white">
            <ui-card-header>
              <ui-card-title>chart-3</ui-card-title>
            </ui-card-header>
          </ui-card>
          <ui-card class="w-full bg-chart-4 text-white">
            <ui-card-header>
              <ui-card-title>chart-4</ui-card-title>
            </ui-card-header>
          </ui-card>
          <ui-card class="w-full bg-chart-5 text-white">
            <ui-card-header>
              <ui-card-title>chart-5</ui-card-title>
            </ui-card-header>
          </ui-card>
        </div>
      </div>
    `,
  }),
};

// ── Interactive ───────────────────────────────────────────────────────────────

export const Interactive: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex gap-4 flex-wrap">
        @for (n of [1,2,3]; track n) {
          <ui-card class="w-56 cursor-pointer hover:shadow-md transition-shadow">
            <ui-card-header>
              <ui-card-title>Item {{ n }}</ui-card-title>
              <ui-card-description>Click to expand</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <div class="h-20 bg-muted rounded-md"></div>
            </ui-card-content>
          </ui-card>
        }
      </div>
    `,
  }),
};
