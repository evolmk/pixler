// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
} from './context-menu.component';

const ALL = [
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
];

const meta: Meta<ContextMenuComponent> = {
  title: 'Overlay/ContextMenu',
  component: ContextMenuComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '360px' } },
  },
};
export default meta;
type Story = StoryObj<ContextMenuComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-context-menu>
        <div
          uiContextMenuTrigger
          class="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu"
        >
          Right-click here
        </div>
        <ui-context-menu-content>
          <ui-context-menu-item>View</ui-context-menu-item>
          <ui-context-menu-item>Edit</ui-context-menu-item>
          <ui-context-menu-item>Duplicate</ui-context-menu-item>
          <ui-context-menu-separator></ui-context-menu-separator>
          <ui-context-menu-item>Delete</ui-context-menu-item>
        </ui-context-menu-content>
      </ui-context-menu>
    `,
  }),
};

// ── With Shortcuts ─────────────────────────────────────────────────────────────

export const WithShortcuts: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-context-menu>
        <div
          uiContextMenuTrigger
          class="flex h-36 w-72 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu"
        >
          Right-click for file actions
        </div>
        <ui-context-menu-content>
          <ui-context-menu-label>File</ui-context-menu-label>
          <ui-context-menu-item>
            Open
            <ui-context-menu-shortcut>↵</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-item>
            Open in New Tab
            <ui-context-menu-shortcut>⌘↵</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-separator></ui-context-menu-separator>
          <ui-context-menu-label>Edit</ui-context-menu-label>
          <ui-context-menu-item>
            Copy
            <ui-context-menu-shortcut>⌘C</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-item>
            Cut
            <ui-context-menu-shortcut>⌘X</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-item>
            Paste
            <ui-context-menu-shortcut>⌘V</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-separator></ui-context-menu-separator>
          <ui-context-menu-item>
            Rename
            <ui-context-menu-shortcut>F2</ui-context-menu-shortcut>
          </ui-context-menu-item>
          <ui-context-menu-item [disabled]="true">
            Delete
            <ui-context-menu-shortcut>⌫</ui-context-menu-shortcut>
          </ui-context-menu-item>
        </ui-context-menu-content>
      </ui-context-menu>
    `,
  }),
};

// ── With Groups ───────────────────────────────────────────────────────────────

export const WithGroups: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-context-menu>
        <div
          uiContextMenuTrigger
          class="flex h-36 w-72 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground select-none cursor-context-menu bg-muted/30"
        >
          Right-click this canvas area
        </div>
        <ui-context-menu-content>
          <ui-context-menu-group>
            <ui-context-menu-label>View</ui-context-menu-label>
            <ui-context-menu-item>Zoom In</ui-context-menu-item>
            <ui-context-menu-item>Zoom Out</ui-context-menu-item>
            <ui-context-menu-item>Fit to Screen</ui-context-menu-item>
          </ui-context-menu-group>
          <ui-context-menu-separator></ui-context-menu-separator>
          <ui-context-menu-group>
            <ui-context-menu-label>Canvas</ui-context-menu-label>
            <ui-context-menu-item>Add Layer</ui-context-menu-item>
            <ui-context-menu-item>Add Text</ui-context-menu-item>
            <ui-context-menu-item>Add Image</ui-context-menu-item>
          </ui-context-menu-group>
          <ui-context-menu-separator></ui-context-menu-separator>
          <ui-context-menu-item>Export</ui-context-menu-item>
        </ui-context-menu-content>
      </ui-context-menu>
    `,
  }),
};
