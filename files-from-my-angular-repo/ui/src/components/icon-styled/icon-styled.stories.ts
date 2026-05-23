// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { IconStyledComponent } from './icon-styled.component';

const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;

const meta: Meta<IconStyledComponent> = {
  title: 'Display/IconStyled',
  component: IconStyledComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'primary', 'secondary', 'destructive', 'success', 'warning', 'info', 'muted'],
    },
    shape: { control: 'radio', options: ['square', 'rounded', 'circle'] },
    size: { control: 'radio', options: ['xs', 'sm', 'default', 'lg', 'xl'] },
  },
};
export default meta;
type Story = StoryObj<IconStyledComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconStyledComponent] },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants</p>
          <div class="flex flex-wrap gap-4">
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="default">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="primary">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">primary</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="secondary">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">secondary</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="destructive">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">destructive</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">success</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="warning">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">warning</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="info">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">info</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled variant="muted">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">muted</span>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex gap-6">
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled shape="square" variant="primary">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">square</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled shape="rounded" variant="primary">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">rounded</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled shape="circle" variant="primary">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">circle</span>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-end gap-4">
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled size="xs" variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">xs</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled size="sm" variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">sm</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled size="default" variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">default</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled size="lg" variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">lg</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-icon-styled size="xl" variant="success">${ICON}</ui-icon-styled>
              <span class="text-xs text-muted-foreground">xl</span>
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
    moduleMetadata: { imports: [IconStyledComponent] },
    props: args,
    template: `
      <ui-icon-styled [variant]="variant" [shape]="shape" [size]="size">
        ${ICON}
      </ui-icon-styled>
    `,
  }),
  args: { variant: 'primary', shape: 'rounded', size: 'default' },
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconStyledComponent] },
    template: `
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="default">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="primary">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">primary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="secondary">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="destructive">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">destructive</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">success</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="warning">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">warning</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="info">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">info</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled variant="muted">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">muted</span>
        </div>
      </div>
    `,
  }),
};

// ── Shapes ────────────────────────────────────────────────────────────────────

export const Shapes: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconStyledComponent] },
    template: `
      <div class="flex gap-6">
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled shape="square" variant="primary">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">square</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled shape="rounded" variant="primary">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">rounded</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled shape="circle" variant="primary">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">circle</span>
        </div>
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconStyledComponent] },
    template: `
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled size="xs" variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">xs</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled size="sm" variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled size="default" variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled size="lg" variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">lg</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <ui-icon-styled size="xl" variant="success">${ICON}</ui-icon-styled>
          <span class="text-xs text-muted-foreground">xl</span>
        </div>
      </div>
    `,
  }),
};
