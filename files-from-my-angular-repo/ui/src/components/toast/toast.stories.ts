// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ToasterComponent } from './toaster.component';
import { toast } from './toast.function';
import { ButtonComponent } from '../button/button.component';

/**
 * Wraps story content in a relative container so the toaster's fixed positioning
 * is overridden to absolute (via storybook-host/styles.css), making toasts
 * visible inside each story preview.
 */
const storyWrap = (inner: string) => `<div class="toast-story-wrapper">${inner}</div>`;

const meta: Meta<ToasterComponent> = {
  title: 'Feedback/Toast',
  component: ToasterComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<ToasterComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showToast: () => toast('Event has been created'),
    },
    template: storyWrap(`
      <ui-toaster></ui-toaster>
      <ui-button variant="outline" (click)="showToast()">Show Toast</ui-button>
    `),
  }),
};

// ── Types (Rich Colors — now default) ────────────────────────────────────────

export const Types: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showDefault: () => toast('This is a default toast'),
      showSuccess: () => toast.success('Changes saved successfully'),
      showError: () => toast.error('Something went wrong'),
      showWarning: () => toast.warning('Please review your input'),
      showInfo: () => toast.info('New version available'),
    },
    template: storyWrap(`
      <ui-toaster></ui-toaster>
      <div class="flex flex-wrap gap-2">
        <ui-button variant="outline" (click)="showDefault()">Default</ui-button>
        <ui-button variant="outline" (click)="showSuccess()">Success</ui-button>
        <ui-button variant="destructive" (click)="showError()">Error</ui-button>
        <ui-button variant="outline" (click)="showWarning()">Warning</ui-button>
        <ui-button variant="outline" (click)="showInfo()">Info</ui-button>
      </div>
    `),
  }),
};

// ── With Description ──────────────────────────────────────────────────────────

export const WithDescription: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showToast: () =>
        toast.success('Order submitted', {
          description: 'Order #4521 has been queued for processing.',
        }),
      showError: () =>
        toast.error('Failed to save', {
          description: 'Could not connect to the server. Please try again.',
        }),
    },
    template: storyWrap(`
      <ui-toaster></ui-toaster>
      <div class="flex gap-2">
        <ui-button (click)="showToast()">Order Submitted</ui-button>
        <ui-button variant="destructive" (click)="showError()">Save Failed</ui-button>
      </div>
    `),
  }),
};

// ── With Action ───────────────────────────────────────────────────────────────

export const WithAction: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showToast: () =>
        toast('Order deleted', {
          description: 'Order #4521 has been removed.',
          action: {
            label: 'Undo',
            onClick: () => toast.success('Order restored'),
          },
        }),
    },
    template: storyWrap(`
      <ui-toaster></ui-toaster>
      <ui-button variant="destructive" (click)="showToast()">Delete Order</ui-button>
    `),
  }),
};

// ── Progress Bar ─────────────────────────────────────────────────────────────

export const ProgressBar: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showSuccess: () => toast.success('File uploaded successfully'),
      showError: () => toast.error('Upload failed'),
      showWarning: () => toast.warning('Storage almost full'),
      showInfo: () => toast.info('Syncing changes…'),
    },
    template: storyWrap(`
      <ui-toaster progress="bar" [closeButton]="true"></ui-toaster>
      <div class="flex flex-wrap gap-2">
        <ui-button variant="outline" (click)="showSuccess()">Success</ui-button>
        <ui-button variant="destructive" (click)="showError()">Error</ui-button>
        <ui-button variant="outline" (click)="showWarning()">Warning</ui-button>
        <ui-button variant="outline" (click)="showInfo()">Info</ui-button>
      </div>
    `),
  }),
};

// ── Progress Circle ──────────────────────────────────────────────────────────

export const ProgressCircle: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showSuccess: () => toast.success('Changes saved'),
      showError: () => toast.error('Connection lost'),
      showWarning: () => toast.warning('Rate limit approaching'),
      showInfo: () => toast.info('New update available'),
    },
    template: storyWrap(`
      <ui-toaster progress="circle" [closeButton]="true"></ui-toaster>
      <div class="flex flex-wrap gap-2">
        <ui-button variant="outline" (click)="showSuccess()">Success</ui-button>
        <ui-button variant="destructive" (click)="showError()">Error</ui-button>
        <ui-button variant="outline" (click)="showWarning()">Warning</ui-button>
        <ui-button variant="outline" (click)="showInfo()">Info</ui-button>
      </div>
    `),
  }),
};

// ── Stacked Toasts (Newest at Bottom) ───────────────────────────────────────

export const StackedToasts: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showMultiple: () => {
        toast.success('Order #1001 confirmed');
        setTimeout(() => toast.info('Inventory updated'), 300);
        setTimeout(() => toast.warning('Low stock on LZR-2000'), 600);
      },
    },
    template: storyWrap(`
      <ui-toaster progress="bar" [closeButton]="true"></ui-toaster>
      <ui-button variant="outline" (click)="showMultiple()">Show 3 Toasts (newest at bottom)</ui-button>
    `),
  }),
};

// ── Positions ─────────────────────────────────────────────────────────────────

export const TopRight: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      showToast: () => toast('Positioned top-right'),
    },
    template: storyWrap(`
      <ui-toaster position="top-right"></ui-toaster>
      <ui-button variant="outline" (click)="showToast()">Toast Top Right</ui-button>
    `),
  }),
};

// ── Rapid Fire (Animation Performance) ──────────────────────────────────────

export const RapidFire: Story = {
  render: () => ({
    moduleMetadata: { imports: [ToasterComponent, ButtonComponent] },
    props: {
      rapidFire: () => {
        const types = ['success', 'error', 'warning', 'info'] as const;
        for (let i = 0; i < 5; i++) {
          setTimeout(() => toast[types[i % types.length]](`Notification #${i + 1}`), i * 150);
        }
      },
    },
    template: storyWrap(`
      <ui-toaster [closeButton]="true"></ui-toaster>
      <ui-button variant="outline" (click)="rapidFire()">Fire 5 Rapid Toasts</ui-button>
    `),
  }),
};
