// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarSeparatorComponent,
  MenubarLabelComponent,
  MenubarShortcutComponent,
} from './menubar.component';

const ALL = [
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarSeparatorComponent,
  MenubarLabelComponent,
  MenubarShortcutComponent,
];

const meta: Meta<MenubarComponent> = {
  title: 'Overlay/Menubar',
  component: MenubarComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<MenubarComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-menubar>
        <ui-menubar-menu>
          <ui-menubar-trigger>File</ui-menubar-trigger>
          <ui-menubar-content>
            <ui-menubar-item>
              New Tab
              <ui-menubar-shortcut>⌘T</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-item>
              New Window
              <ui-menubar-shortcut>⌘N</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-separator></ui-menubar-separator>
            <ui-menubar-item>
              Open
              <ui-menubar-shortcut>⌘O</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-item>
              Save
              <ui-menubar-shortcut>⌘S</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-separator></ui-menubar-separator>
            <ui-menubar-item>
              Print
              <ui-menubar-shortcut>⌘P</ui-menubar-shortcut>
            </ui-menubar-item>
          </ui-menubar-content>
        </ui-menubar-menu>

        <ui-menubar-menu>
          <ui-menubar-trigger>Edit</ui-menubar-trigger>
          <ui-menubar-content>
            <ui-menubar-item>
              Undo
              <ui-menubar-shortcut>⌘Z</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-item>
              Redo
              <ui-menubar-shortcut>⇧⌘Z</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-separator></ui-menubar-separator>
            <ui-menubar-item>
              Cut
              <ui-menubar-shortcut>⌘X</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-item>
              Copy
              <ui-menubar-shortcut>⌘C</ui-menubar-shortcut>
            </ui-menubar-item>
            <ui-menubar-item>
              Paste
              <ui-menubar-shortcut>⌘V</ui-menubar-shortcut>
            </ui-menubar-item>
          </ui-menubar-content>
        </ui-menubar-menu>

        <ui-menubar-menu>
          <ui-menubar-trigger>View</ui-menubar-trigger>
          <ui-menubar-content>
            <ui-menubar-item>Zoom In</ui-menubar-item>
            <ui-menubar-item>Zoom Out</ui-menubar-item>
            <ui-menubar-item>Actual Size</ui-menubar-item>
            <ui-menubar-separator></ui-menubar-separator>
            <ui-menubar-item>Full Screen</ui-menubar-item>
          </ui-menubar-content>
        </ui-menubar-menu>

        <ui-menubar-menu>
          <ui-menubar-trigger>Help</ui-menubar-trigger>
          <ui-menubar-content>
            <ui-menubar-label>Support</ui-menubar-label>
            <ui-menubar-item>Documentation</ui-menubar-item>
            <ui-menubar-item>Release Notes</ui-menubar-item>
            <ui-menubar-separator></ui-menubar-separator>
            <ui-menubar-item [disabled]="true">Report a Bug</ui-menubar-item>
          </ui-menubar-content>
        </ui-menubar-menu>
      </ui-menubar>
    `,
  }),
};

// ── Application Menubar ───────────────────────────────────────────────────────

export const ApplicationMenubar: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">Click a menu item to open its dropdown:</p>
        <ui-menubar>
          <ui-menubar-menu>
            <ui-menubar-trigger>Lazar</ui-menubar-trigger>
            <ui-menubar-content>
              <ui-menubar-item>About Lazar</ui-menubar-item>
              <ui-menubar-separator></ui-menubar-separator>
              <ui-menubar-item>Preferences</ui-menubar-item>
              <ui-menubar-separator></ui-menubar-separator>
              <ui-menubar-item>
                Quit
                <ui-menubar-shortcut>⌘Q</ui-menubar-shortcut>
              </ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>

          <ui-menubar-menu>
            <ui-menubar-trigger>Orders</ui-menubar-trigger>
            <ui-menubar-content>
              <ui-menubar-item>
                New Order
                <ui-menubar-shortcut>⌘N</ui-menubar-shortcut>
              </ui-menubar-item>
              <ui-menubar-item>All Orders</ui-menubar-item>
              <ui-menubar-item>Pending</ui-menubar-item>
              <ui-menubar-separator></ui-menubar-separator>
              <ui-menubar-item>Import CSV</ui-menubar-item>
              <ui-menubar-item>Export Report</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>

          <ui-menubar-menu>
            <ui-menubar-trigger>Machines</ui-menubar-trigger>
            <ui-menubar-content>
              <ui-menubar-item>Machine Fleet</ui-menubar-item>
              <ui-menubar-item>Maintenance Schedule</ui-menubar-item>
              <ui-menubar-item>Diagnostics</ui-menubar-item>
              <ui-menubar-separator></ui-menubar-separator>
              <ui-menubar-item [disabled]="true">Add Machine (Admin only)</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>

          <ui-menubar-menu>
            <ui-menubar-trigger>Reports</ui-menubar-trigger>
            <ui-menubar-content>
              <ui-menubar-label>Time Range</ui-menubar-label>
              <ui-menubar-item>Daily</ui-menubar-item>
              <ui-menubar-item>Weekly</ui-menubar-item>
              <ui-menubar-item>Monthly</ui-menubar-item>
              <ui-menubar-separator></ui-menubar-separator>
              <ui-menubar-item>Custom Range</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
      </div>
    `,
  }),
};
