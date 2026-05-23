// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { KbdComponent } from './kbd.component';

const meta: Meta<KbdComponent> = {
  title: 'Display/Kbd',
  component: KbdComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<KbdComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [KbdComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <ui-kbd size="sm">⌘K</ui-kbd>
              <span class="text-xs text-muted-foreground">sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-kbd size="default">⌘K</ui-kbd>
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-kbd size="lg">⌘K</ui-kbd>
              <span class="text-xs text-muted-foreground">lg</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [KbdComponent] },
    props: args,
    template: `<ui-kbd [size]="size">⌘K</ui-kbd>`,
  }),
  args: { size: 'default' },
};

// ── Combinations ──────────────────────────────────────────────────────────────

export const Combinations: Story = {
  render: () => ({
    moduleMetadata: { imports: [KbdComponent] },
    template: `
      <div class="space-y-3">
        <div class="flex items-center gap-1.5 text-sm">
          <ui-kbd>⌘</ui-kbd>
          <span class="text-muted-foreground">+</span>
          <ui-kbd>K</ui-kbd>
          <span class="ml-2 text-muted-foreground">Open command palette</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <ui-kbd>⌘</ui-kbd>
          <span class="text-muted-foreground">+</span>
          <ui-kbd>Shift</ui-kbd>
          <span class="text-muted-foreground">+</span>
          <ui-kbd>P</ui-kbd>
          <span class="ml-2 text-muted-foreground">Run command</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <ui-kbd>Ctrl</ui-kbd>
          <span class="text-muted-foreground">+</span>
          <ui-kbd>Z</ui-kbd>
          <span class="ml-2 text-muted-foreground">Undo</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <ui-kbd>Alt</ui-kbd>
          <span class="text-muted-foreground">+</span>
          <ui-kbd>F4</ui-kbd>
          <span class="ml-2 text-muted-foreground">Close window</span>
        </div>
        <div class="flex items-center gap-1.5 text-sm">
          <ui-kbd>Esc</ui-kbd>
          <span class="ml-2 text-muted-foreground">Dismiss</span>
        </div>
      </div>
    `,
  }),
};

// ── In Prose ──────────────────────────────────────────────────────────────────

export const InProse: Story = {
  render: () => ({
    moduleMetadata: { imports: [KbdComponent] },
    template: `
      <p class="text-sm text-muted-foreground max-w-sm">
        Press <ui-kbd size="sm">⌘</ui-kbd> + <ui-kbd size="sm">K</ui-kbd> to open the command
        palette, or <ui-kbd size="sm">Esc</ui-kbd> to close any dialog.
      </p>
    `,
  }),
};
