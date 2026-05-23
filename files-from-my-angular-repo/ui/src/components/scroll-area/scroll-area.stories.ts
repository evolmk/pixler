// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ScrollAreaComponent } from './scroll-area.component';

const meta: Meta<ScrollAreaComponent> = {
  title: 'Layout/ScrollArea',
  component: ScrollAreaComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<ScrollAreaComponent>;

const TAGS = ['Angular', 'TypeScript', 'Tailwind CSS', 'NestJS', 'MongoDB', 'Auth0', 'Turborepo', 'Storybook', 'RxJS', 'Signals', 'Prisma', 'Webpack', 'Vite', 'ESLint', 'Prettier'];

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollAreaComponent] },
    template: `
      <ui-scroll-area class="h-48 w-64 rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
          @for (tag of tags; track tag) {
            <div class="text-sm py-1.5 border-b last:border-0">{{ tag }}</div>
          }
        </div>
      </ui-scroll-area>
    `,
    props: { tags: TAGS },
  }),
};

// ── Horizontal ────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollAreaComponent] },
    template: `
      <ui-scroll-area class="w-72 rounded-md border">
        <div class="flex gap-3 p-4" style="width: max-content">
          @for (i of items; track i) {
            <div class="shrink-0 w-36 h-24 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
              Item {{ i }}
            </div>
          }
        </div>
      </ui-scroll-area>
    `,
    props: { items: [1,2,3,4,5,6,7,8] },
  }),
};

// ── Long Content ──────────────────────────────────────────────────────────────

export const LongContent: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollAreaComponent] },
    template: `
      <ui-scroll-area class="h-64 w-96 rounded-md border">
        <div class="p-4 space-y-3">
          @for (i of paragraphs; track i) {
            <p class="text-sm text-muted-foreground leading-relaxed">
              Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          }
        </div>
      </ui-scroll-area>
    `,
    props: { paragraphs: [1,2,3,4,5,6,7,8] },
  }),
};
