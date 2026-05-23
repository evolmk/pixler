// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ContainerComponent } from './container.component';

const meta: Meta<ContainerComponent> = {
  title: 'Layout/Container',
  component: ContainerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg', 'xl', 'full'] },
  },
};
export default meta;
type Story = StoryObj<ContainerComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ContainerComponent] },
    template: `
      <div class="flex flex-col gap-2 p-6">
        <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
        <div class="bg-muted/30 w-full"><ui-container size="sm"><div class="bg-primary/10 rounded p-3 text-xs text-center font-medium">sm</div></ui-container></div>
        <div class="bg-muted/30 w-full"><ui-container size="default"><div class="bg-primary/10 rounded p-3 text-xs text-center font-medium">default</div></ui-container></div>
        <div class="bg-muted/30 w-full"><ui-container size="lg"><div class="bg-primary/10 rounded p-3 text-xs text-center font-medium">lg</div></ui-container></div>
        <div class="bg-muted/30 w-full"><ui-container size="xl"><div class="bg-primary/10 rounded p-3 text-xs text-center font-medium">xl</div></ui-container></div>
        <div class="bg-muted/30 w-full"><ui-container size="full"><div class="bg-primary/10 rounded p-3 text-xs text-center font-medium">full</div></ui-container></div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ContainerComponent] },
    props: args,
    template: `
      <div class="bg-muted/30 w-full">
        <ui-container [size]="size" [centered]="centered" [padded]="padded">
          <div class="bg-accent/50 rounded-lg p-4 text-sm text-center">
            Container content — size: {{ size }}
          </div>
        </ui-container>
      </div>
    `,
  }),
  args: { size: 'default', centered: true, padded: true },
};

// ── Without Padding ───────────────────────────────────────────────────────────

export const WithoutPadding: Story = {
  render: () => ({
    moduleMetadata: { imports: [ContainerComponent] },
    template: `
      <div class="bg-muted/30 w-full">
        <ui-container size="default" [padded]="false">
          <div class="bg-accent/50 rounded-lg p-4 text-sm text-center">
            No horizontal padding (padded=false)
          </div>
        </ui-container>
      </div>
    `,
  }),
};

// ── Not Centered ──────────────────────────────────────────────────────────────

export const NotCentered: Story = {
  render: () => ({
    moduleMetadata: { imports: [ContainerComponent] },
    template: `
      <div class="bg-muted/30 w-full">
        <ui-container size="sm" [centered]="false">
          <div class="bg-accent/50 rounded-lg p-4 text-sm">
            Left-aligned (centered=false)
          </div>
        </ui-container>
      </div>
    `,
  }),
};
