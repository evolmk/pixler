// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  CollapsibleComponent,
  CollapsibleTriggerDirective,
  CollapsibleContentComponent,
} from './collapsible.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [CollapsibleComponent, CollapsibleTriggerDirective, CollapsibleContentComponent];

const meta: Meta<CollapsibleComponent> = {
  title: 'Components/Collapsible',
  component: CollapsibleComponent,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<CollapsibleComponent>;

// ── Default (closed) ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-collapsible class="w-80 space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold">Starred repositories</h4>
          <ui-button variant="ghost" size="icon-sm" uiCollapsibleTrigger>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </ui-button>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm font-mono">@radix-ui/primitives</div>
        <ui-collapsible-content class="space-y-2">
          <div class="rounded-md border px-4 py-2 text-sm font-mono">@radix-ui/colors</div>
          <div class="rounded-md border px-4 py-2 text-sm font-mono">@stitches/react</div>
        </ui-collapsible-content>
      </ui-collapsible>
    `,
  }),
};

// ── Start Open ────────────────────────────────────────────────────────────────

export const StartOpen: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-collapsible [open]="true" class="w-80 space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold">Details (pre-opened)</h4>
          <ui-button variant="ghost" size="icon-sm" uiCollapsibleTrigger>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </ui-button>
        </div>
        <ui-collapsible-content class="space-y-2">
          <p class="text-sm text-muted-foreground">This section is open by default.</p>
          <p class="text-sm text-muted-foreground">Click the chevron to collapse it.</p>
        </ui-collapsible-content>
      </ui-collapsible>
    `,
  }),
};
