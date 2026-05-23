// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { FeaturesFileUploadComponent } from './file-upload.component';

/**
 * FileUpload component — drag-and-drop upload zone with progress tracking.
 *
 * `uploadType`: 'image'|'doc'|'drawing'|'email'|'site' — changes accepted file types
 * and display icon. `allowMultiple` enables multi-file selection. `maxFileSizeMb`
 * caps individual file size. The component uses `FileUploadService` to manage upload state.
 * Emits `uploadComplete` and `uploadError` output events.
 */
const meta: Meta<FeaturesFileUploadComponent> = {
  title: 'Features/FileUpload',
  component: FeaturesFileUploadComponent,
  tags: ['autodocs'],
  argTypes: {
    uploadType: {
      control: 'select',
      options: ['image', 'doc', 'drawing', 'email', 'site'],
      description: 'Upload category — controls accepted types and icon',
      table: { defaultValue: { summary: 'doc' } },
    },
    allowMultiple: {
      control: 'boolean',
      description: 'Allow selecting multiple files',
      table: { defaultValue: { summary: 'false' } },
    },
    maxFileSizeMb: {
      control: { type: 'number', min: 1, max: 500 },
      description: 'Maximum file size in megabytes',
      table: { defaultValue: { summary: '50' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: { uploadType: 'doc', allowMultiple: false, maxFileSizeMb: 50, disabled: false },
};

export default meta;
type Story = StoryObj<FeaturesFileUploadComponent>;

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [FeaturesFileUploadComponent] },
    props: args,
    template: `<ui-file-upload [uploadType]="uploadType" [allowMultiple]="allowMultiple" [maxFileSizeMb]="maxFileSizeMb" [disabled]="disabled" />`,
  }),
};

export const ImageUpload: Story = {
  args: { uploadType: 'image', allowMultiple: true, maxFileSizeMb: 10 },
  render: (args) => ({
    moduleMetadata: { imports: [FeaturesFileUploadComponent] },
    props: args,
    template: `
      <div class="max-w-lg">
        <ui-file-upload uploadType="image" [allowMultiple]="true" [maxFileSizeMb]="10" />
      </div>`,
  }),
};

export const DocumentUpload: Story = {
  args: { uploadType: 'doc' },
  render: (args) => ({
    moduleMetadata: { imports: [FeaturesFileUploadComponent] },
    props: args,
    template: `
      <div class="max-w-lg">
        <ui-file-upload uploadType="doc" [maxFileSizeMb]="25" />
      </div>`,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    moduleMetadata: { imports: [FeaturesFileUploadComponent] },
    props: args,
    template: `<ui-file-upload [disabled]="disabled" />`,
  }),
};
