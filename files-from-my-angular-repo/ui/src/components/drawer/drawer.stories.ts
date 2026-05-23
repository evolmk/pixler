// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
} from './drawer.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
];

const meta: Meta<DrawerComponent> = {
  title: 'Overlay/Drawer',
  component: DrawerComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '500px' } },
  },
};
export default meta;
type Story = StoryObj<DrawerComponent>;

const CONTENT = `
  <ui-drawer-header>
    <ui-drawer-title>Drawer</ui-drawer-title>
    <ui-drawer-description>This drawer slides in from the side.</ui-drawer-description>
  </ui-drawer-header>
  <div class="flex-1 p-6 text-sm text-muted-foreground">
    <p>Add your drawer content here. This can be a form, details panel, or navigation.</p>
  </div>
  <ui-drawer-footer>
    <ui-button uiDrawerClose variant="outline">Close</ui-button>
    <ui-button uiDrawerClose>Save</ui-button>
  </ui-drawer-footer>
`;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: top</p>
          <ui-drawer>
            <ui-button uiDrawerTrigger variant="outline" size="sm">Open Top</ui-button>
            <ui-drawer-content side="top">${CONTENT}</ui-drawer-content>
          </ui-drawer>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: right</p>
          <ui-drawer>
            <ui-button uiDrawerTrigger variant="outline" size="sm">Open Right</ui-button>
            <ui-drawer-content side="right">${CONTENT}</ui-drawer-content>
          </ui-drawer>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: bottom</p>
          <ui-drawer>
            <ui-button uiDrawerTrigger variant="outline" size="sm">Open Bottom</ui-button>
            <ui-drawer-content side="bottom">${CONTENT}</ui-drawer-content>
          </ui-drawer>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: left</p>
          <ui-drawer>
            <ui-button uiDrawerTrigger variant="outline" size="sm">Open Left</ui-button>
            <ui-drawer-content side="left">${CONTENT}</ui-drawer-content>
          </ui-drawer>
        </div>
      </div>
    `,
  }),
};

// ── Right (Default) ───────────────────────────────────────────────────────────

export const Right: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-drawer>
        <ui-button uiDrawerTrigger>Open Right Drawer</ui-button>
        <ui-drawer-content side="right">${CONTENT}</ui-drawer-content>
      </ui-drawer>
    `,
  }),
};

// ── Left ──────────────────────────────────────────────────────────────────────

export const Left: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-drawer>
        <ui-button uiDrawerTrigger variant="outline">Open Left Drawer</ui-button>
        <ui-drawer-content side="left">${CONTENT}</ui-drawer-content>
      </ui-drawer>
    `,
  }),
};

// ── Top ───────────────────────────────────────────────────────────────────────

export const Top: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-drawer>
        <ui-button uiDrawerTrigger variant="outline">Open Top Drawer</ui-button>
        <ui-drawer-content side="top">${CONTENT}</ui-drawer-content>
      </ui-drawer>
    `,
  }),
};

// ── Bottom ────────────────────────────────────────────────────────────────────

export const Bottom: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-drawer>
        <ui-button uiDrawerTrigger variant="outline">Open Bottom Drawer</ui-button>
        <ui-drawer-content side="bottom">${CONTENT}</ui-drawer-content>
      </ui-drawer>
    `,
  }),
};
