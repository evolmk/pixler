// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  DropdownItemComponent,
  DropdownGroupComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownShortcutComponent,
} from './dropdown.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  DropdownItemComponent,
  DropdownGroupComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownShortcutComponent,
];

const PANEL = 'min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md';

const meta: Meta<DropdownComponent> = {
  title: 'Overlay/Dropdown',
  component: DropdownComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '360px' } },
  },
};
export default meta;
type Story = StoryObj<DropdownComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-center py-16">
        <ui-dropdown>
          <button ui-button variant="outline" uiDropdownTrigger>Open Menu</button>
          <div uiDropdownContent class="${PANEL}">
            <ui-dropdown-item>Profile</ui-dropdown-item>
            <ui-dropdown-item>Settings</ui-dropdown-item>
            <ui-dropdown-item>Billing</ui-dropdown-item>
            <ui-dropdown-separator />
            <ui-dropdown-item>Log out</ui-dropdown-item>
          </div>
        </ui-dropdown>
      </div>
    `,
  }),
};

// ── With Shortcuts ─────────────────────────────────────────────────────────────

export const WithShortcuts: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-center py-16">
        <ui-dropdown>
          <button ui-button variant="outline" uiDropdownTrigger>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            Actions
          </button>
          <div uiDropdownContent class="${PANEL}">
            <ui-dropdown-item>New Tab <ui-dropdown-shortcut>⌘T</ui-dropdown-shortcut></ui-dropdown-item>
            <ui-dropdown-item>New Window <ui-dropdown-shortcut>⌘N</ui-dropdown-shortcut></ui-dropdown-item>
            <ui-dropdown-separator />
            <ui-dropdown-item>Cut <ui-dropdown-shortcut>⌘X</ui-dropdown-shortcut></ui-dropdown-item>
            <ui-dropdown-item>Copy <ui-dropdown-shortcut>⌘C</ui-dropdown-shortcut></ui-dropdown-item>
            <ui-dropdown-item>Paste <ui-dropdown-shortcut>⌘V</ui-dropdown-shortcut></ui-dropdown-item>
            <ui-dropdown-separator />
            <ui-dropdown-item [disabled]="true">Delete <ui-dropdown-shortcut>⌘⌫</ui-dropdown-shortcut></ui-dropdown-item>
          </div>
        </ui-dropdown>
      </div>
    `,
  }),
};

// ── With Icons ────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-center py-16">
        <ui-dropdown>
          <button ui-button uiDropdownTrigger>My Account</button>
          <div uiDropdownContent class="${PANEL}">
            <ui-dropdown-label>My Account</ui-dropdown-label>
            <ui-dropdown-separator />
            <ui-dropdown-item>
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </ui-dropdown-item>
            <ui-dropdown-item>
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </ui-dropdown-item>
            <ui-dropdown-item>
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
              Billing
            </ui-dropdown-item>
            <ui-dropdown-separator />
            <ui-dropdown-item>
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Log out
              <ui-dropdown-shortcut>⇧⌘Q</ui-dropdown-shortcut>
            </ui-dropdown-item>
          </div>
        </ui-dropdown>
      </div>
    `,
  }),
};

// ── With Groups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-center py-16">
        <ui-dropdown>
          <button ui-button variant="outline" uiDropdownTrigger>Options</button>
          <div uiDropdownContent class="${PANEL}">
            <ui-dropdown-group>
              <ui-dropdown-label>Account</ui-dropdown-label>
              <ui-dropdown-item>Profile</ui-dropdown-item>
              <ui-dropdown-item>Preferences</ui-dropdown-item>
            </ui-dropdown-group>
            <ui-dropdown-separator />
            <ui-dropdown-group>
              <ui-dropdown-label>Workspace</ui-dropdown-label>
              <ui-dropdown-item>Team Settings</ui-dropdown-item>
              <ui-dropdown-item>Invite Members</ui-dropdown-item>
              <ui-dropdown-item [disabled]="true">Transfer Ownership</ui-dropdown-item>
            </ui-dropdown-group>
            <ui-dropdown-separator />
            <ui-dropdown-item>Log out</ui-dropdown-item>
          </div>
        </ui-dropdown>
      </div>
    `,
  }),
};

// ── Align End ────────────────────────────────────────────────────────────────

export const AlignEnd: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex justify-end px-8 py-16">
        <ui-dropdown align="end">
          <button ui-button variant="outline" uiDropdownTrigger>Align End</button>
          <div uiDropdownContent class="${PANEL}">
            <ui-dropdown-item>Option A</ui-dropdown-item>
            <ui-dropdown-item>Option B</ui-dropdown-item>
            <ui-dropdown-item>Option C</ui-dropdown-item>
          </div>
        </ui-dropdown>
      </div>
    `,
  }),
};

// ── Items Mode (Switcher) ───────────────────────────────────────────────────

export const ItemsMode: Story = {
  render: () => ({
    moduleMetadata: { imports: [DropdownComponent] },
    template: `
      <div class="flex justify-center py-16">
        <ui-dropdown
          [items]="[
            { label: 'Overview', value: 'overview' },
            { label: 'Analytics', value: 'analytics' },
            { label: 'Reports', value: 'reports' }
          ]"
          value="overview"
        />
      </div>
    `,
  }),
};
