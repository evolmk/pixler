// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { FileInputComponent } from './file-input.component';

const meta: Meta<FileInputComponent> = {
  title: 'Forms/FileInput',
  component: FileInputComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    multiple: { control: 'boolean' },
    accept: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<FileInputComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [FileInputComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3 w-72">
            <div class="flex items-center gap-3"><span class="text-sm w-20">sm</span><ui-file-input size="sm" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">default</span><ui-file-input size="default" class="flex-1" /></div>
            <div class="flex items-center gap-3"><span class="text-sm w-20">lg</span><ui-file-input size="lg" class="flex-1" /></div>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multiple</p>
          <ui-file-input [multiple]="true" class="w-72" />
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [FileInputComponent] },
    props: args,
    template: `<ui-file-input [size]="size" [multiple]="multiple" [accept]="accept" class="w-72" />`,
  }),
  args: { size: 'default', multiple: false, accept: '' },
};

// ── Multiple Files ────────────────────────────────────────────────────────────

export const Multiple: Story = {
  render: () => ({
    moduleMetadata: { imports: [FileInputComponent] },
    template: `<ui-file-input [multiple]="true" class="w-72" />`,
  }),
};

// ── Accept Image ──────────────────────────────────────────────────────────────

export const AcceptImage: Story = {
  render: () => ({
    moduleMetadata: { imports: [FileInputComponent] },
    template: `
      <div class="flex flex-col gap-1.5 w-72">
        <span class="text-sm text-muted-foreground">Images only (.jpg, .png, .webp)</span>
        <ui-file-input accept="image/*" [multiple]="true" />
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [FileInputComponent] },
    template: `
      <div class="flex flex-col gap-3 w-72">
        <ui-file-input size="sm" />
        <ui-file-input size="default" />
        <ui-file-input size="lg" />
      </div>
    `,
  }),
};
