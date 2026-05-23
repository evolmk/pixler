// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  MegaMenuComponent,
  MegaMenuItemComponent,
  MegaMenuTriggerDirective,
  MegaMenuContentComponent,
  MegaMenuTemplateDirective,
  MegaMenuSectionComponent,
  MegaMenuSectionTitleComponent,
  MegaMenuLinkComponent,
} from './mega-menu.component';
import { IconComponent } from '../icon/icon.component';
import { MapPin, MessageSquare, Handshake, Package, Play } from 'lucide-angular';

const ALL = [
  MegaMenuComponent,
  MegaMenuItemComponent,
  MegaMenuTriggerDirective,
  MegaMenuContentComponent,
  MegaMenuTemplateDirective,
  MegaMenuSectionComponent,
  MegaMenuSectionTitleComponent,
  MegaMenuLinkComponent,
  IconComponent,
];

const meta: Meta<MegaMenuComponent> = {
  title: 'Navigation/MegaMenu',
  component: MegaMenuComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '500px' } },
  },
};
export default meta;
type Story = StoryObj<MegaMenuComponent>;

// ── Default Mode ─────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex py-8 pl-8">
        <ui-mega-menu>
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Catalog</button>
            <ui-mega-menu-content [columns]="3" class="!min-w-[650px] !gap-0 !p-0"
              style="grid-template-columns: 1fr 1fr 200px">
              <div class="p-5 pr-3">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title class="!text-foreground !font-bold">Machines</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Inline Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Chuck Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Snap-On Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Servo Cappers</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 px-3 border-x border-border">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title class="!text-foreground !font-bold">Parts</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Cap Elevators</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Drive Components</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Electrical</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Pneumatic</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 pl-3 flex flex-col gap-3">
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.Package" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Full Catalog</p>
                    <p class="text-xs text-muted-foreground">All products & parts</p>
                  </div>
                </a>
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.Play" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Videos</p>
                    <p class="text-xs text-muted-foreground">Demos & tutorials</p>
                  </div>
                </a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>

          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Company</button>
            <ui-mega-menu-content [columns]="2" class="!min-w-[480px] !gap-0 !p-0">
              <div class="p-5 pr-3">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>About</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">About Us</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Our Clients</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Become a Dealer</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Terms & Conditions</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 pl-3 border-l border-border flex flex-col gap-3">
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.MapPin" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Find a Dealer</p>
                    <p class="text-xs text-muted-foreground">Locate an authorized dealer</p>
                  </div>
                </a>
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.MessageSquare" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Need Help?</p>
                    <p class="text-xs text-muted-foreground">Contact our support team</p>
                  </div>
                </a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>

          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Support</button>
            <ui-mega-menu-content [columns]="2" class="!min-w-[400px] !gap-0 !p-0">
              <div class="p-5 pr-3">
                <ui-mega-menu-section>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Maintenance Guides</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Manuals</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Order Parts</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 pl-3 border-l border-border flex flex-col">
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.MessageSquare" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Contact Us</p>
                    <p class="text-xs text-muted-foreground">Get in touch with our team</p>
                  </div>
                </a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>
        </ui-mega-menu>
      </div>
    `,
    props: {
      icons: { MapPin, MessageSquare, Handshake, Package, Play },
    },
  }),
};

// ── Tabs Mode ────────────────────────────────────────────────────────────────

export const Tabs: Story = {
  name: 'Tabs',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex py-8 pl-8">
        <ui-mega-menu mode="tabs">
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Catalog</button>
            <ui-mega-menu-content [columns]="3" class="!min-w-[650px] !gap-0 !p-0"
              style="grid-template-columns: 1fr 1fr 200px">
              <div class="p-5 pr-3">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title class="!text-foreground !font-bold">Machines</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Inline Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Chuck Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Snap-On Cappers</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Servo Cappers</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 px-3 border-x border-border">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title class="!text-foreground !font-bold">Parts</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Cap Elevators</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Drive Components</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Electrical</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Pneumatic</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 pl-3 flex flex-col gap-3">
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.Package" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Full Catalog</p>
                    <p class="text-xs text-muted-foreground">All products & parts</p>
                  </div>
                </a>
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.Play" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Videos</p>
                    <p class="text-xs text-muted-foreground">Demos & tutorials</p>
                  </div>
                </a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>

          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Company</button>
            <ui-mega-menu-content [columns]="2" class="!min-w-[480px] !gap-0 !p-0">
              <div class="p-5 pr-3">
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>About</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">About Us</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Our Clients</a>
                  <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Become a Dealer</a>
                </ui-mega-menu-section>
              </div>
              <div class="p-5 pl-3 border-l border-border flex flex-col gap-3">
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.Handshake" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Become a Dealer</p>
                    <p class="text-xs text-muted-foreground">Partner with us</p>
                  </div>
                </a>
                <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                    <ui-icon [name]="icons.MessageSquare" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">Need Help?</p>
                    <p class="text-xs text-muted-foreground">Contact our support team</p>
                  </div>
                </a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>

          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Support</button>
            <ui-mega-menu-content [columns]="1" class="!min-w-[280px] !p-0">
              <div class="p-5 flex flex-col gap-1">
                <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Maintenance Guides</a>
                <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Manuals</a>
                <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Order Parts</a>
                <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Contact Us</a>
              </div>
            </ui-mega-menu-content>
          </ui-mega-menu-item>
        </ui-mega-menu>
      </div>
    `,
    props: {
      icons: { MapPin, MessageSquare, Handshake, Package, Play },
    },
  }),
};

// ── Single Column ────────────────────────────────────────────────────────────

export const SingleColumn: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex py-8 pl-8">
        <ui-mega-menu>
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Support</button>
            <ui-mega-menu-content [columns]="1">
              <ui-mega-menu-section>
                <ui-mega-menu-section-title>Help Center</ui-mega-menu-section-title>
                <a uiMegaMenuLink href="#">Documentation</a>
                <a uiMegaMenuLink href="#">FAQs</a>
                <a uiMegaMenuLink href="#">Release Notes</a>
                <a uiMegaMenuLink href="#">System Status</a>
              </ui-mega-menu-section>
            </ui-mega-menu-content>
          </ui-mega-menu-item>
        </ui-mega-menu>
      </div>
    `,
  }),
};

// ── Shared Overlay Morph ────────────────────────────────────────────────────

export const SharedOverlayMorph: Story = {
  name: 'Shared Overlay Morph',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex py-8 pl-8">
        <ui-mega-menu mode="shared">

          <!-- Wide menu (3-col Catalog) -->
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Catalog</button>
            <ng-template uiMegaMenuTemplate>
              <div class="flex min-w-[700px]">
                <div class="flex-1 p-5 pr-3">
                  <ui-mega-menu-section>
                    <ui-mega-menu-section-title class="!text-foreground !font-bold">Machines</ui-mega-menu-section-title>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Inline Cappers</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Chuck Cappers</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Snap-On Cappers</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Servo Cappers</a>
                  </ui-mega-menu-section>
                </div>
                <div class="flex-1 p-5 px-3 border-x border-border">
                  <ui-mega-menu-section>
                    <ui-mega-menu-section-title class="!text-foreground !font-bold">Parts</ui-mega-menu-section-title>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Cap Elevators</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Drive Components</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Electrical</a>
                  </ui-mega-menu-section>
                </div>
                <div class="w-[200px] p-5 pl-3 flex flex-col gap-3">
                  <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                    <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                      <ui-icon [name]="icons.Package" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-foreground">Full Catalog</p>
                    </div>
                  </a>
                  <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                    <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                      <ui-icon [name]="icons.Play" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-foreground">Videos</p>
                    </div>
                  </a>
                </div>
              </div>
            </ng-template>
          </ui-mega-menu-item>

          <!-- Medium menu (2-col Company) -->
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Company</button>
            <ng-template uiMegaMenuTemplate>
              <div class="flex min-w-[480px]">
                <div class="flex-1 p-5 pr-3">
                  <ui-mega-menu-section>
                    <ui-mega-menu-section-title>About</ui-mega-menu-section-title>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">About Us</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Our Clients</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Terms & Conditions</a>
                  </ui-mega-menu-section>
                </div>
                <div class="flex-1 p-5 pl-3 border-l border-border flex flex-col gap-3">
                  <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                    <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                      <ui-icon [name]="icons.MapPin" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-foreground">Find a Dealer</p>
                      <p class="text-xs text-muted-foreground">Locate authorized dealers</p>
                    </div>
                  </a>
                  <a href="#" class="group flex items-center gap-3 rounded-lg border border-border p-3 hover:border-brand/30 hover:bg-brand/5 transition-colors">
                    <div class="flex-shrink-0 h-10 w-10 rounded-md bg-brand/10 flex items-center justify-center">
                      <ui-icon [name]="icons.Handshake" [size]="20" [strokeWidth]="1.5" class="text-brand" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-foreground">Become a Dealer</p>
                      <p class="text-xs text-muted-foreground">Partner with us</p>
                    </div>
                  </a>
                </div>
              </div>
            </ng-template>
          </ui-mega-menu-item>

          <!-- Narrow menu (Support) -->
          <ui-mega-menu-item>
            <button uiMegaMenuTrigger>Support</button>
            <ng-template uiMegaMenuTemplate>
              <div class="flex min-w-[320px]">
                <div class="flex-1 p-5">
                  <ui-mega-menu-section>
                    <ui-mega-menu-section-title>Help</ui-mega-menu-section-title>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Maintenance Guides</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Manuals</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Order Parts</a>
                    <a uiMegaMenuLink href="#" class="!py-1.5 [&>div>span]:font-normal">Contact Us</a>
                  </ui-mega-menu-section>
                </div>
              </div>
            </ng-template>
          </ui-mega-menu-item>

        </ui-mega-menu>
      </div>

      <p class="px-8 pt-4 text-sm text-muted-foreground">
        Hover across the triggers above to see the shared overlay morph between menus of different widths.
      </p>
    `,
    props: {
      icons: { MapPin, MessageSquare, Handshake, Package, Play },
    },
  }),
};
