// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { FileUploadComponent, FileUploadProgressComponent } from './file-upload.component';

const ALL = [FileUploadComponent, FileUploadProgressComponent];

const meta: Meta<FileUploadComponent> = {
  title: 'Forms/FileUpload',
  component: FileUploadComponent,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    accept: { control: 'text' },
    hint: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<FileUploadComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Single file</p>
          <ui-file-upload [multiple]="false" hint="Select a single file" class="w-96" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multiple files</p>
          <ui-file-upload [multiple]="true" hint="Select multiple files" class="w-96" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Accept: images only</p>
          <ui-file-upload [multiple]="true" accept="image/*" hint="PNG, JPG, GIF only" class="w-96" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Accept: PDF only</p>
          <ui-file-upload [multiple]="false" accept=".pdf" hint="PDF files only" class="w-96" />
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: ALL },
    props: args,
    template: `<ui-file-upload [multiple]="multiple" [hint]="hint" [accept]="accept" class="w-96" />`,
  }),
  args: { multiple: true, hint: 'PNG, JPG, PDF up to 10MB', accept: '' },
};

// ── With Progress ─────────────────────────────────────────────────────────────

export const WithProgress: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: {
      file1: { name: 'report.pdf', size: 2048000, progress: 75, status: 'uploading' },
      file2: { name: 'logo.png', size: 512000, progress: 100, status: 'done' },
    },
    template: `
      <div class="w-96 space-y-2">
        <ui-file-upload hint="PDF, PNG up to 5MB" class="w-full" />
        <ui-file-upload-progress [file]="file1" />
        <ui-file-upload-progress [file]="file2" />
      </div>
    `,
  }),
};
