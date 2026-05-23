// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { BlockquoteComponent } from './blockquote.component';

const meta: Meta<BlockquoteComponent> = {
  title: 'Display/Blockquote',
  component: BlockquoteComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'accent', 'destructive', 'muted'] },
  },
};
export default meta;
type Story = StoryObj<BlockquoteComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [BlockquoteComponent] },
    template: `
      <div class="flex flex-col gap-4 max-w-lg p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
          <ui-blockquote variant="default" cite="Alan Kay">
            The best way to predict the future is to invent it.
          </ui-blockquote>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Accent</p>
          <ui-blockquote variant="accent" cite="Steve Jobs">
            Innovation distinguishes between a leader and a follower.
          </ui-blockquote>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Destructive</p>
          <ui-blockquote variant="destructive">
            Warning: This action is irreversible and will permanently delete all associated data.
          </ui-blockquote>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Muted</p>
          <ui-blockquote variant="muted" cite="Lazar Technologies">
            Precision bottle capping machinery since 1987.
          </ui-blockquote>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [BlockquoteComponent] },
    props: args,
    template: `
      <ui-blockquote [variant]="variant">
        The best way to predict the future is to invent it.
      </ui-blockquote>
    `,
  }),
  args: { variant: 'default' },
};

// ── With Cite ─────────────────────────────────────────────────────────────────

export const WithCite: Story = {
  render: () => ({
    moduleMetadata: { imports: [BlockquoteComponent] },
    template: `
      <ui-blockquote cite="Alan Kay">
        The best way to predict the future is to invent it.
      </ui-blockquote>
    `,
  }),
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [BlockquoteComponent] },
    template: `
      <div class="space-y-4 max-w-lg">
        <ui-blockquote variant="default" cite="Alan Kay">
          The best way to predict the future is to invent it.
        </ui-blockquote>
        <ui-blockquote variant="accent" cite="Steve Jobs">
          Innovation distinguishes between a leader and a follower.
        </ui-blockquote>
        <ui-blockquote variant="destructive">
          Warning: This action is irreversible and will permanently delete all associated data.
        </ui-blockquote>
        <ui-blockquote variant="muted" cite="Lazar Technologies">
          Precision bottle capping machinery since 1987.
        </ui-blockquote>
      </div>
    `,
  }),
};
