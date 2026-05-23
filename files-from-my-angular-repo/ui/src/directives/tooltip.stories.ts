// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TooltipDirective } from './tooltip.directive';
import { ButtonComponent } from '../components/button/button.component';

const meta: Meta = {
  title: 'Directives/TooltipDirective',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipDirective, ButtonComponent] },
    template: `
      <div class="flex justify-center py-8">
        <ui-button
          variant="outline"
          uiTooltip="This is a tooltip"
        >
          Hover me
        </ui-button>
      </div>
    `,
  }),
};

// ── Placements ────────────────────────────────────────────────────────────────

export const Placements: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipDirective, ButtonComponent] },
    template: `
      <div class="flex flex-wrap justify-center items-center gap-8 py-12">
        <ui-button
          variant="outline"
          size="sm"
          uiTooltip="Appears on top"
          uiTooltipPlacement="top"
        >
          Top
        </ui-button>
        <ui-button
          variant="outline"
          size="sm"
          uiTooltip="Appears on right"
          uiTooltipPlacement="right"
        >
          Right
        </ui-button>
        <ui-button
          variant="outline"
          size="sm"
          uiTooltip="Appears on bottom"
          uiTooltipPlacement="bottom"
        >
          Bottom
        </ui-button>
        <ui-button
          variant="outline"
          size="sm"
          uiTooltip="Appears on left"
          uiTooltipPlacement="left"
        >
          Left
        </ui-button>
      </div>
    `,
  }),
};

// ── Delay Presets ─────────────────────────────────────────────────────────────

export const DelayPresets: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipDirective, ButtonComponent] },
    template: `
      <div class="flex flex-wrap justify-center items-center gap-4 py-8">
        <ui-button variant="outline" size="sm" uiTooltip="instant (0ms)" uiTooltipDelay="instant">
          instant
        </ui-button>
        <ui-button variant="outline" size="sm" uiTooltip="fast (100ms) — default" uiTooltipDelay="fast">
          fast
        </ui-button>
        <ui-button variant="outline" size="sm" uiTooltip="normal (300ms)" uiTooltipDelay="normal">
          normal
        </ui-button>
        <ui-button variant="outline" size="sm" uiTooltip="slow (700ms)" uiTooltipDelay="slow">
          slow
        </ui-button>
        <ui-button variant="outline" size="sm" uiTooltip="Custom 250ms" [uiTooltipDelay]="250">
          250ms
        </ui-button>
      </div>
    `,
  }),
};

// ── No Arrow ─────────────────────────────────────────────────────────────────

export const NoArrow: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipDirective, ButtonComponent] },
    template: `
      <div class="flex justify-center py-8">
        <ui-button
          variant="outline"
          uiTooltip="No arrow tooltip"
          [uiTooltipArrow]="false"
        >
          No Arrow
        </ui-button>
      </div>
    `,
  }),
};

// ── On Text ───────────────────────────────────────────────────────────────────

export const OnText: Story = {
  render: () => ({
    moduleMetadata: { imports: [TooltipDirective] },
    template: `
      <p class="text-sm max-w-sm">
        The LZR-2000 achieves
        <span
          class="underline decoration-dotted cursor-help"
          uiTooltip="Caps Per Minute — the number of bottle caps applied per minute"
          uiTooltipPlacement="top"
        >
          300 CPM
        </span>
        with a torque range of
        <span
          class="underline decoration-dotted cursor-help"
          uiTooltip="Newton-centimetres — a unit of torque measurement"
          uiTooltipPlacement="top"
        >
          5–50 N·cm
        </span>.
      </p>
    `,
  }),
};
