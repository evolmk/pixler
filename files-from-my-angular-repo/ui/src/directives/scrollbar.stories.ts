// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ScrollbarDirective } from './scrollbar.directive';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`.repeat(3);

const meta: Meta = {
  title: 'Directives/Scrollbar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollbarDirective] },
    template: `
      <div class="h-40 overflow-auto rounded-lg border border-border p-3" [uiScrollbar]="'default'">
        <p class="text-sm text-muted-foreground">${LOREM}</p>
      </div>
    `,
  }),
};

// ── Thin ──────────────────────────────────────────────────────────────────────

export const Thin: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollbarDirective] },
    template: `
      <div class="h-40 overflow-auto rounded-lg border border-border p-3" [uiScrollbar]="'thin'">
        <p class="text-sm text-muted-foreground">${LOREM}</p>
      </div>
    `,
  }),
};

// ── Hidden ────────────────────────────────────────────────────────────────────

export const Hidden: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollbarDirective] },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Scrollbar is hidden but content is still scrollable:</p>
        <div class="h-40 overflow-auto rounded-lg border border-border p-3" [uiScrollbar]="'hidden'">
          <p class="text-sm text-muted-foreground">${LOREM}</p>
        </div>
      </div>
    `,
  }),
};

// ── All Variants ──────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollbarDirective] },
    template: `
      <div class="grid grid-cols-3 gap-4">
        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">default</p>
          <div class="h-32 overflow-auto rounded border border-border p-2" [uiScrollbar]="'default'">
            <p class="text-xs text-muted-foreground">${LOREM}</p>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">thin</p>
          <div class="h-32 overflow-auto rounded border border-border p-2" [uiScrollbar]="'thin'">
            <p class="text-xs text-muted-foreground">${LOREM}</p>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground">hidden</p>
          <div class="h-32 overflow-auto rounded border border-border p-2" [uiScrollbar]="'hidden'">
            <p class="text-xs text-muted-foreground">${LOREM}</p>
          </div>
        </div>
      </div>
    `,
  }),
};
