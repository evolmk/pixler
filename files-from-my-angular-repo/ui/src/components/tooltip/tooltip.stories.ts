// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent, TooltipContentComponent, TooltipTriggerDirective } from './tooltip.component';
import { ButtonComponent } from '../button/button.component';

const ALL = [TooltipComponent, TooltipContentComponent, TooltipTriggerDirective];

const meta: Meta<TooltipComponent> = {
  title: 'Overlay/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '200px' } },
  },
};
export default meta;
type Story = StoryObj<TooltipComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Placement: top</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover (top)</ui-button>
            <ui-tooltip-content placement="top">Tooltip on top</ui-tooltip-content>
          </ui-tooltip>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Placement: right</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover (right)</ui-button>
            <ui-tooltip-content placement="right">Tooltip on right</ui-tooltip-content>
          </ui-tooltip>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Placement: bottom</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover (bottom)</ui-button>
            <ui-tooltip-content placement="bottom">Tooltip on bottom</ui-tooltip-content>
          </ui-tooltip>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Placement: left</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover (left)</ui-button>
            <ui-tooltip-content placement="left">Tooltip on left</ui-tooltip-content>
          </ui-tooltip>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <ui-tooltip>
        <ui-button uiTooltipTrigger variant="outline">Hover me</ui-button>
        <ui-tooltip-content>This is a tooltip</ui-tooltip-content>
      </ui-tooltip>
    `,
  }),
};

// ── No Arrow ─────────────────────────────────────────────────────────────────

export const NoArrow: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-wrap justify-center items-center gap-8 p-12">
        <ui-tooltip>
          <ui-button uiTooltipTrigger variant="outline" size="sm">Top</ui-button>
          <ui-tooltip-content placement="top" [arrow]="false">No arrow</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip>
          <ui-button uiTooltipTrigger variant="outline" size="sm">Bottom</ui-button>
          <ui-tooltip-content placement="bottom" [arrow]="false">No arrow</ui-tooltip-content>
        </ui-tooltip>
      </div>
    `,
  }),
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-wrap gap-8 p-8">
        <div class="flex flex-col items-start gap-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Primary</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover</ui-button>
            <ui-tooltip-content variant="primary">Primary tooltip</ui-tooltip-content>
          </ui-tooltip>
        </div>
        <div class="flex flex-col items-start gap-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Secondary</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover</ui-button>
            <ui-tooltip-content variant="secondary">Secondary tooltip</ui-tooltip-content>
          </ui-tooltip>
        </div>
        <div class="flex flex-col items-start gap-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Accent</p>
          <ui-tooltip>
            <ui-button uiTooltipTrigger variant="outline" size="sm">Hover</ui-button>
            <ui-tooltip-content variant="accent">Accent tooltip</ui-tooltip-content>
          </ui-tooltip>
        </div>
      </div>
    `,
  }),
};

// ── Delay Presets ─────────────────────────────────────────────────────────────

export const DelayPresets: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex flex-wrap items-center gap-4 p-8">
        <ui-tooltip delay="instant">
          <ui-button uiTooltipTrigger variant="outline" size="sm">instant</ui-button>
          <ui-tooltip-content>0ms — instant</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip delay="fast">
          <ui-button uiTooltipTrigger variant="outline" size="sm">fast (default)</ui-button>
          <ui-tooltip-content>100ms — fast</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip delay="normal">
          <ui-button uiTooltipTrigger variant="outline" size="sm">normal</ui-button>
          <ui-tooltip-content>300ms — normal</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip delay="slow">
          <ui-button uiTooltipTrigger variant="outline" size="sm">slow</ui-button>
          <ui-tooltip-content>700ms — slow</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip [delay]="250">
          <ui-button uiTooltipTrigger variant="outline" size="sm">250ms</ui-button>
          <ui-tooltip-content>Custom 250ms</ui-tooltip-content>
        </ui-tooltip>
      </div>
    `,
  }),
};

// ── On Icon Button ────────────────────────────────────────────────────────────

export const OnIconButton: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, ButtonComponent] },
    template: `
      <div class="flex gap-3">
        <ui-tooltip>
          <ui-button uiTooltipTrigger variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </ui-button>
          <ui-tooltip-content>Search</ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip>
          <ui-button uiTooltipTrigger variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </ui-button>
          <ui-tooltip-content>Settings</ui-tooltip-content>
        </ui-tooltip>
      </div>
    `,
  }),
};
