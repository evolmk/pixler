// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { AspectRatioComponent } from './aspect-ratio.component';

const meta: Meta<AspectRatioComponent> = {
  title: 'Layout/AspectRatio',
  component: AspectRatioComponent,
  tags: ['autodocs'],
  argTypes: {
    ratio: { control: { type: 'number', min: 0.1, max: 5, step: 0.01 } },
  },
};
export default meta;
type Story = StoryObj<AspectRatioComponent>;

// ── 16/9 ─────────────────────────────────────────────────────────────────────

export const Widescreen: Story = {
  name: '16/9 Widescreen',
  render: () => ({
    moduleMetadata: { imports: [AspectRatioComponent] },
    template: `
      <div class="w-80">
        <ui-aspect-ratio [ratio]="16/9">
          <div class="w-full h-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">16 / 9</div>
        </ui-aspect-ratio>
      </div>
    `,
  }),
};

// ── 4/3 ──────────────────────────────────────────────────────────────────────

export const Standard: Story = {
  name: '4/3 Standard',
  render: () => ({
    moduleMetadata: { imports: [AspectRatioComponent] },
    template: `
      <div class="w-80">
        <ui-aspect-ratio [ratio]="4/3">
          <div class="w-full h-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">4 / 3</div>
        </ui-aspect-ratio>
      </div>
    `,
  }),
};

// ── 1/1 ──────────────────────────────────────────────────────────────────────

export const Square: Story = {
  name: '1/1 Square',
  render: () => ({
    moduleMetadata: { imports: [AspectRatioComponent] },
    template: `
      <div class="w-64">
        <ui-aspect-ratio [ratio]="1">
          <div class="w-full h-full bg-muted rounded-full flex items-center justify-center text-sm text-muted-foreground">1 / 1</div>
        </ui-aspect-ratio>
      </div>
    `,
  }),
};
