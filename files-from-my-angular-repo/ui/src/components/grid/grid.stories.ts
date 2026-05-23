// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { GridComponent, ColumnComponent } from './grid.component';

const meta: Meta<GridComponent> = {
  title: 'Layout/Grid',
  component: GridComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<GridComponent>;

const ALL_IMPORTS = [GridComponent, ColumnComponent];

const CELL_CLASS = 'rounded bg-primary/10 p-3 text-sm font-medium text-center';

// ── Default (12-col) ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-grid [cols]="12" gap="md">
        <ui-col [span]="4"><div class="${CELL_CLASS}">span 4</div></ui-col>
        <ui-col [span]="4"><div class="${CELL_CLASS}">span 4</div></ui-col>
        <ui-col [span]="4"><div class="${CELL_CLASS}">span 4</div></ui-col>
        <ui-col [span]="8"><div class="${CELL_CLASS}">span 8</div></ui-col>
        <ui-col [span]="4"><div class="${CELL_CLASS}">span 4</div></ui-col>
        <ui-col [span]="6"><div class="${CELL_CLASS}">span 6</div></ui-col>
        <ui-col [span]="6"><div class="${CELL_CLASS}">span 6</div></ui-col>
      </ui-grid>
    `,
  }),
};

// ── Simple 3-Column ───────────────────────────────────────────────────────────

export const ThreeColumn: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-grid [cols]="3" gap="md">
        <ui-col><div class="${CELL_CLASS}">Column 1</div></ui-col>
        <ui-col><div class="${CELL_CLASS}">Column 2</div></ui-col>
        <ui-col><div class="${CELL_CLASS}">Column 3</div></ui-col>
        <ui-col><div class="${CELL_CLASS}">Column 4</div></ui-col>
        <ui-col><div class="${CELL_CLASS}">Column 5</div></ui-col>
        <ui-col><div class="${CELL_CLASS}">Column 6</div></ui-col>
      </ui-grid>
    `,
  }),
};

// ── Gap Sizes ─────────────────────────────────────────────────────────────────

export const GapSizes: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="space-y-6">
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-2">gap: xs</p>
          <ui-grid [cols]="4" gap="xs">
            <ui-col><div class="${CELL_CLASS}">A</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">B</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">C</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">D</div></ui-col>
          </ui-grid>
        </div>
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-2">gap: md</p>
          <ui-grid [cols]="4" gap="md">
            <ui-col><div class="${CELL_CLASS}">A</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">B</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">C</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">D</div></ui-col>
          </ui-grid>
        </div>
        <div>
          <p class="text-xs font-medium text-muted-foreground mb-2">gap: xl</p>
          <ui-grid [cols]="4" gap="xl">
            <ui-col><div class="${CELL_CLASS}">A</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">B</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">C</div></ui-col>
            <ui-col><div class="${CELL_CLASS}">D</div></ui-col>
          </ui-grid>
        </div>
      </div>
    `,
  }),
};

// ── Responsive Spans ──────────────────────────────────────────────────────────

export const ResponsiveSpans: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Stacks to 1 col on sm, 2 on md, 3 on lg</p>
        <ui-grid [cols]="12" gap="md">
          <ui-col [span]="12" [mdSpan]="6" [lgSpan]="4">
            <div class="${CELL_CLASS}">Card 1</div>
          </ui-col>
          <ui-col [span]="12" [mdSpan]="6" [lgSpan]="4">
            <div class="${CELL_CLASS}">Card 2</div>
          </ui-col>
          <ui-col [span]="12" [mdSpan]="12" [lgSpan]="4">
            <div class="${CELL_CLASS}">Card 3</div>
          </ui-col>
        </ui-grid>
      </div>
    `,
  }),
};

// ── Dashboard Layout ──────────────────────────────────────────────────────────

export const DashboardLayout: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-grid [cols]="12" gap="md">
        <!-- Stats row -->
        <ui-col [span]="3"><div class="${CELL_CLASS} h-20">Orders</div></ui-col>
        <ui-col [span]="3"><div class="${CELL_CLASS} h-20">Revenue</div></ui-col>
        <ui-col [span]="3"><div class="${CELL_CLASS} h-20">Machines</div></ui-col>
        <ui-col [span]="3"><div class="${CELL_CLASS} h-20">Alerts</div></ui-col>
        <!-- Main + sidebar -->
        <ui-col [span]="8"><div class="${CELL_CLASS} h-40">Main Chart</div></ui-col>
        <ui-col [span]="4"><div class="${CELL_CLASS} h-40">Recent Orders</div></ui-col>
      </ui-grid>
    `,
  }),
};
