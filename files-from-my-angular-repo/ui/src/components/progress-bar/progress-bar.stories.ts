// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ProgressBarComponent } from './progress-bar.component';

const meta: Meta<ProgressBarComponent> = {
  title: 'Feedback/ProgressBar',
  component: ProgressBarComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showLabel: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ProgressBarComponent>;

// ── All Percentages ─────────────────────────────────────────────────────────

export const AllPercentages: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarComponent] },
    template: `
      <div class="flex flex-col gap-4">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Percentage Steps</p>
        <div class="flex flex-col gap-3">
          <ui-progress-bar [value]="0" [showLabel]="true" />
          <ui-progress-bar [value]="12.5" [showLabel]="true" />
          <ui-progress-bar [value]="25" [showLabel]="true" />
          <ui-progress-bar [value]="37.5" [showLabel]="true" />
          <ui-progress-bar [value]="50" [showLabel]="true" />
          <ui-progress-bar [value]="62.5" [showLabel]="true" />
          <ui-progress-bar [value]="75" [showLabel]="true" />
          <ui-progress-bar [value]="87.5" [showLabel]="true" />
          <ui-progress-bar [value]="100" [showLabel]="true" />
        </div>
      </div>
    `,
  }),
};

// ── Default (Interactive) ───────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ProgressBarComponent] },
    props: args,
    template: `<ui-progress-bar [value]="value" [showLabel]="showLabel" />`,
  }),
  args: { value: 50, showLabel: true },
};

// ── No Label ────────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarComponent] },
    template: `
      <div class="flex flex-col gap-3">
        <ui-progress-bar [value]="25" />
        <ui-progress-bar [value]="50" />
        <ui-progress-bar [value]="75" />
        <ui-progress-bar [value]="100" />
      </div>
    `,
  }),
};

// ── In Table Context ────────────────────────────────────────────────────────

export const InTableContext: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProgressBarComponent] },
    template: `
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
            <th class="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Progress</th>
            <th class="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border">
            <td class="py-2 px-3">Project Alpha</td>
            <td class="py-2 px-3"><ui-progress-bar [value]="25" [showLabel]="true" /></td>
            <td class="py-2 px-3 text-muted-foreground">In Progress</td>
          </tr>
          <tr class="border-b border-border">
            <td class="py-2 px-3">Project Beta</td>
            <td class="py-2 px-3"><ui-progress-bar [value]="68" [showLabel]="true" /></td>
            <td class="py-2 px-3 text-muted-foreground">In Progress</td>
          </tr>
          <tr class="border-b border-border">
            <td class="py-2 px-3">Project Gamma</td>
            <td class="py-2 px-3"><ui-progress-bar [value]="100" [showLabel]="true" /></td>
            <td class="py-2 px-3 text-muted-foreground">Complete</td>
          </tr>
          <tr class="border-b border-border">
            <td class="py-2 px-3">Project Delta</td>
            <td class="py-2 px-3"><ui-progress-bar [value]="0" [showLabel]="true" /></td>
            <td class="py-2 px-3 text-muted-foreground">Not Started</td>
          </tr>
        </tbody>
      </table>
    `,
  }),
};
