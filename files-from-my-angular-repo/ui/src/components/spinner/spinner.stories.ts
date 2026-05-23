import { Meta, StoryObj } from '@storybook/angular';
import { LoaderPinwheel, RefreshCw, RotateCw } from 'lucide-angular';
import { SpinnerComponent } from './spinner.component';

const meta: Meta<SpinnerComponent> = {
  title: 'Feedback/Spinner',
  component: SpinnerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
    strokeWidth: { control: { type: 'number', min: 0.5, max: 4, step: 0.5 } },
    ariaLabel: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<SpinnerComponent>;

// ── All Variants ──────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpinnerComponent] },
    template: `
      <div class="flex flex-col gap-8 p-6">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-8">
            <div class="flex flex-col items-center gap-2">
              <ui-spinner size="sm"></ui-spinner>
              <span class="text-xs text-muted-foreground">sm (16px)</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-spinner size="default"></ui-spinner>
              <span class="text-xs text-muted-foreground">default (20px)</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <ui-spinner size="lg"></ui-spinner>
              <span class="text-xs text-muted-foreground">lg (32px)</span>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Colors (via text utility)</p>
          <div class="flex items-center gap-6">
            <ui-spinner size="default"></ui-spinner>
            <ui-spinner size="default" class="text-primary"></ui-spinner>
            <ui-spinner size="default" class="text-destructive"></ui-spinner>
            <ui-spinner size="default" class="text-muted-foreground"></ui-spinner>
          </div>
        </div>

      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [SpinnerComponent] },
    props: args,
    template: `<ui-spinner [size]="size" [strokeWidth]="strokeWidth"></ui-spinner>`,
  }),
  args: {
    size: 'default',
    strokeWidth: 2,
  },
};

// ── Custom Icons ──────────────────────────────────────────────────────────────

export const CustomIcons: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpinnerComponent] },
    props: { LoaderPinwheel, RefreshCw, RotateCw },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <p class="text-sm text-muted-foreground">
          Default uses the gradient arc SVG. Pass any Lucide icon via <code>[icon]</code> to override.
        </p>
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-center gap-2">
            <ui-spinner size="lg"></ui-spinner>
            <span class="text-xs text-muted-foreground">default (gradient arc)</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-spinner size="lg" [icon]="LoaderPinwheel"></ui-spinner>
            <span class="text-xs text-muted-foreground">LoaderPinwheel</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-spinner size="lg" [icon]="RefreshCw"></ui-spinner>
            <span class="text-xs text-muted-foreground">RefreshCw</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-spinner size="lg" [icon]="RotateCw"></ui-spinner>
            <span class="text-xs text-muted-foreground">RotateCw</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── In Context ────────────────────────────────────────────────────────────────

export const InContext: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpinnerComponent] },
    template: `
      <div class="flex flex-col items-center justify-center h-40 rounded-lg border border-border gap-3">
        <ui-spinner size="lg"></ui-spinner>
        <p class="text-sm text-muted-foreground">Loading data...</p>
      </div>
    `,
  }),
};

// ── In Button (preview) ───────────────────────────────────────────────────────

export const InButton: Story = {
  render: () => ({
    moduleMetadata: { imports: [SpinnerComponent] },
    template: `
      <div class="flex flex-col gap-4 p-4">
        <p class="text-xs text-muted-foreground uppercase font-medium tracking-wide mb-1">Button loading patterns (Sprint 2)</p>

        <button
          class="self-start inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-75 cursor-not-allowed"
          disabled
        >
          <ui-spinner size="sm" class="text-primary-foreground"></ui-spinner>
          Saving...
        </button>

        <button
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-75 cursor-not-allowed size-10"
          disabled
        >
          <ui-spinner size="sm" class="text-primary-foreground"></ui-spinner>
        </button>
      </div>
    `,
  }),
};
