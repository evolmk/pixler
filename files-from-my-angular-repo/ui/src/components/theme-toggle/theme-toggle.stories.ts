// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ThemeToggleComponent } from './theme-toggle.component';

const meta: Meta<ThemeToggleComponent> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggleComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<ThemeToggleComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ThemeToggleComponent] },
    template: `
      <div class="flex items-center gap-2">
        <ui-theme-toggle></ui-theme-toggle>
        <span class="text-sm text-muted-foreground">Click to toggle light/dark theme</span>
      </div>
    `,
  }),
};

// ── In Navbar ─────────────────────────────────────────────────────────────────

export const InNavbar: Story = {
  render: () => ({
    moduleMetadata: { imports: [ThemeToggleComponent] },
    template: `
      <div class="flex h-12 items-center justify-between rounded-lg border border-border px-4">
        <span class="font-semibold text-sm">Lazar Technologies</span>
        <div class="flex items-center gap-2">
          <ui-theme-toggle></ui-theme-toggle>
        </div>
      </div>
    `,
  }),
};
