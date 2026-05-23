// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { StepperComponent } from './stepper.component';

const meta: Meta<StepperComponent> = {
  title: 'Navigation/Stepper',
  component: StepperComponent,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    currentStep: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<StepperComponent>;

const BASIC_STEPS = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Billing', description: 'Add payment method' },
  { title: 'Review', description: 'Confirm and launch' },
];

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: { steps: BASIC_STEPS },
    template: `
      <div class="flex flex-col gap-8 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Horizontal</p>
          <ui-stepper [steps]="steps" [currentStep]="1" orientation="horizontal"></ui-stepper>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertical</p>
          <ui-stepper [steps]="steps" [currentStep]="2" orientation="vertical"></ui-stepper>
        </div>
      </div>
    `,
  }),
};

// ── Horizontal ────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: args,
    template: `<ui-stepper [steps]="steps" [currentStep]="currentStep"></ui-stepper>`,
  }),
  args: {
    steps: BASIC_STEPS,
    currentStep: 1,
    orientation: 'horizontal',
  },
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: {
      steps: BASIC_STEPS,
      currentStep: 2,
    },
    template: `<ui-stepper [steps]="steps" [currentStep]="currentStep" orientation="vertical"></ui-stepper>`,
  }),
};

// ── Completed ─────────────────────────────────────────────────────────────────

export const Completed: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: {
      steps: [
        { title: 'Account', description: 'Account created', status: 'completed' },
        { title: 'Profile', description: 'Profile complete', status: 'completed' },
        { title: 'Billing', description: 'Payment added', status: 'completed' },
        { title: 'Review', description: 'All done!', status: 'completed' },
      ],
      currentStep: 4,
    },
    template: `<ui-stepper [steps]="steps" [currentStep]="currentStep"></ui-stepper>`,
  }),
};

// ── With Error ────────────────────────────────────────────────────────────────

export const WithError: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: {
      steps: [
        { title: 'Account', description: 'Account created', status: 'completed' },
        { title: 'Verify Email', description: 'Verification failed', status: 'error' },
        { title: 'Profile', description: 'Set up your profile', status: 'pending' },
        { title: 'Review', description: 'Confirm and launch', status: 'pending' },
      ],
      currentStep: 1,
    },
    template: `<ui-stepper [steps]="steps" [currentStep]="currentStep"></ui-stepper>`,
  }),
};

// ── Order Flow ────────────────────────────────────────────────────────────────

export const OrderFlow: Story = {
  render: () => ({
    moduleMetadata: { imports: [StepperComponent] },
    props: {
      steps: [
        { title: 'Order Placed', description: 'Jan 15, 2026', status: 'completed' },
        { title: 'Processing', description: 'Jan 16, 2026', status: 'completed' },
        { title: 'Shipped', description: 'In transit', status: 'current' },
        { title: 'Delivered', description: 'Est. Jan 20', status: 'pending' },
      ],
      currentStep: 2,
    },
    template: `
      <ui-stepper [steps]="steps" [currentStep]="currentStep" orientation="horizontal"></ui-stepper>
    `,
  }),
};
