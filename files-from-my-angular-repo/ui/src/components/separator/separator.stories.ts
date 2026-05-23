// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { SeparatorComponent } from './separator.component';

const meta: Meta<SeparatorComponent> = {
  title: 'Display/Separator',
  component: SeparatorComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
};
export default meta;
type Story = StoryObj<SeparatorComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SeparatorComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Horizontal</p>
          <div class="max-w-sm">
            <p class="text-sm text-muted-foreground">Above</p>
            <ui-separator class="my-3" />
            <p class="text-sm text-muted-foreground">Below</p>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertical</p>
          <div class="flex h-8 items-center gap-4 text-sm text-muted-foreground">
            <span>Blog</span>
            <ui-separator orientation="vertical" />
            <span>Docs</span>
            <ui-separator orientation="vertical" />
            <span>Support</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── With Label ────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [SeparatorComponent] },
    template: `
      <div class="max-w-sm flex items-center gap-4">
        <ui-separator class="flex-1" />
        <span class="text-xs text-muted-foreground whitespace-nowrap">or continue with</span>
        <ui-separator class="flex-1" />
      </div>
    `,
  }),
};
