// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

const BOLD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>`;
const ITALIC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`;
const UNDERLINE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>`;

const meta: Meta<ToggleComponent> = {
  title: 'Forms/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'outline'] },
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<ToggleComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants</p>
          <div class="flex gap-3">
            <div class="flex flex-col items-center gap-2">
              <ui-toggle variant="default">${BOLD_ICON}</ui-toggle>
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-toggle variant="outline">${BOLD_ICON}</ui-toggle>
              <span class="text-xs text-muted-foreground">outline</span>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-center gap-2">
              <ui-toggle size="sm">${BOLD_ICON}</ui-toggle>
              <span class="text-xs text-muted-foreground">sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-toggle size="default">${BOLD_ICON}</ui-toggle>
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-toggle size="lg">${BOLD_ICON}</ui-toggle>
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
    moduleMetadata: { imports: [ToggleComponent] },
    props: args,
    template: `
      <ui-toggle [variant]="variant" [size]="size">
        ${BOLD_ICON}
      </ui-toggle>
    `,
  }),
  args: { variant: 'default', size: 'default', pressed: false },
};

// ── Text Formatting ───────────────────────────────────────────────────────────

export const TextFormatting: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToggleComponent] },
    template: `
      <div class="flex gap-1 p-1 rounded-md border border-border">
        <ui-toggle variant="default" size="sm">${BOLD_ICON}</ui-toggle>
        <ui-toggle variant="default" size="sm" [pressed]="true">${ITALIC_ICON}</ui-toggle>
        <ui-toggle variant="default" size="sm">${UNDERLINE_ICON}</ui-toggle>
      </div>
    `,
  }),
};
