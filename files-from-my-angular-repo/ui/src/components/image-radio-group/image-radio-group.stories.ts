// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage } from '../../utils/placeholder';
import { ImageRadioGroupComponent } from './image-radio-group.component';

const meta: Meta<ImageRadioGroupComponent> = {
  title: 'Components/Image Radio Group',
  component: ImageRadioGroupComponent,
};
export default meta;

const CAP_ELEVATOR_OPTIONS = [
  { value: '', label: 'No Elevator' },
  {
    value: 'Right Hand - Motor Inside',
    label: 'Right Hand - Motor Inside',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorRI.png',
  },
  {
    value: 'Right Hand - Motor Outside',
    label: 'Right Hand - Motor Outside',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorRO.png',
  },
  {
    value: 'Left Hand - Motor Inside',
    label: 'Left Hand - Motor Inside',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorLI.png',
  },
  {
    value: 'Left Hand - Motor Outside',
    label: 'Left Hand - Motor Outside',
    imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorLO.png',
  },
];

export const AllVariants: StoryObj<ImageRadioGroupComponent> = {
  name: 'All Variants',
  render: () => ({
    moduleMetadata: { imports: [ImageRadioGroupComponent] },
    template: `
      <div class="space-y-8 p-6 max-w-3xl">
        <div>
          <h3 class="text-sm font-semibold mb-3">Default (auto columns based on option count)</h3>
          <ui-image-radio-group
            [options]="options"
            [value]="'Right Hand - Motor Inside'"
          />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-3">Fixed 3 columns</h3>
          <ui-image-radio-group
            [options]="threeOptions"
            [columns]="3"
            [value]="'A'"
          />
        </div>

        <div>
          <h3 class="text-sm font-semibold mb-3">No selection</h3>
          <ui-image-radio-group
            [options]="options"
            [value]="''"
          />
        </div>
      </div>
    `,
    props: {
      options: CAP_ELEVATOR_OPTIONS,
      threeOptions: [
        { value: 'A', label: 'Option A', imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorRI.png' },
        { value: 'B', label: 'Option B', imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorRO.png' },
        { value: 'C', label: 'Option C', imageUrl: 'https://lazar.s3.amazonaws.com/site/help/CapElevatorLI.png' },
      ],
    },
  }),
};

export const Default: StoryObj<ImageRadioGroupComponent> = {
  render: () => ({
    moduleMetadata: { imports: [ImageRadioGroupComponent] },
    template: `
      <div class="p-6 max-w-3xl">
        <ui-image-radio-group
          [options]="options"
          [value]="'Right Hand - Motor Inside'"
        />
      </div>
    `,
    props: { options: CAP_ELEVATOR_OPTIONS },
  }),
};

export const WithPlaceholder: StoryObj<ImageRadioGroupComponent> = {
  render: () => ({
    moduleMetadata: { imports: [ImageRadioGroupComponent] },
    template: `
      <div class="p-6 max-w-3xl">
        <ui-image-radio-group
          [options]="options"
          [value]="''"
          [placeholderImage]="placeholder"
        />
      </div>
    `,
    props: {
      options: CAP_ELEVATOR_OPTIONS,
      placeholder: placeholderImage({ width: 120, ratio: '1:1', bg: 'f3f4f6', fg: 'a3a3a3', text: 'N/A' }),
    },
  }),
};
