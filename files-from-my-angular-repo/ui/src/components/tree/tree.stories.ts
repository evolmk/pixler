// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TreeComponent, TreeNodeComponent } from './tree.component';

const ALL = [TreeComponent, TreeNodeComponent];

const meta: Meta<TreeComponent> = {
  title: 'Display/Tree',
  component: TreeComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TreeComponent>;

const FILE_TREE = [
  {
    id: '1',
    label: 'src',
    children: [
      {
        id: '1-1',
        label: 'components',
        children: [
          { id: '1-1-1', label: 'button.component.ts', children: [] },
          { id: '1-1-2', label: 'input.component.ts', children: [] },
          { id: '1-1-3', label: 'card.component.ts', children: [] },
        ],
      },
      {
        id: '1-2',
        label: 'services',
        children: [
          { id: '1-2-1', label: 'auth.service.ts', children: [] },
          { id: '1-2-2', label: 'order.service.ts', children: [] },
        ],
      },
      { id: '1-3', label: 'app.component.ts', children: [] },
      { id: '1-4', label: 'app.module.ts', children: [] },
    ],
  },
  {
    id: '2',
    label: 'public',
    children: [
      { id: '2-1', label: 'index.html', children: [] },
      { id: '2-2', label: 'favicon.ico', children: [] },
    ],
  },
  { id: '3', label: 'package.json', children: [] },
  { id: '4', label: 'tsconfig.json', children: [] },
];

const MACHINE_TREE = [
  {
    id: 'line1',
    label: 'Production Line 1',
    children: [
      {
        id: 'line1-cap',
        label: 'Capping Station',
        children: [
          { id: 'lzr-2000', label: 'LZR-2000 (Online)', children: [] },
          { id: 'lzr-1500', label: 'LZR-1500 (Online)', children: [] },
        ],
      },
      {
        id: 'line1-conv',
        label: 'Conveyor System',
        children: [
          { id: 'conv-a', label: 'Conveyor A', children: [] },
          { id: 'conv-b', label: 'Conveyor B', children: [] },
        ],
      },
    ],
  },
  {
    id: 'line2',
    label: 'Production Line 2',
    children: [{ id: 'lzr-800', label: 'LZR-800 (Maintenance)', children: [] }],
  },
];

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { fileNodes: FILE_TREE, machineNodes: MACHINE_TREE },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Selectable (default)</p>
          <div class="w-64 p-2 border border-border rounded-lg">
            <ui-tree [nodes]="fileNodes"></ui-tree>
          </div>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Checkable</p>
          <div class="w-72 p-2 border border-border rounded-lg">
            <ui-tree [nodes]="machineNodes" [checkable]="true"></ui-tree>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { nodes: FILE_TREE },
    template: `
      <div class="w-64 p-2 border border-border rounded-lg">
        <ui-tree [nodes]="nodes"></ui-tree>
      </div>
    `,
  }),
};

// ── Not Selectable ────────────────────────────────────────────────────────────

export const NotSelectable: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { nodes: FILE_TREE },
    template: `
      <div class="w-64 p-2 border border-border rounded-lg">
        <ui-tree [nodes]="nodes" [selectable]="false"></ui-tree>
      </div>
    `,
  }),
};

// ── Checkable ─────────────────────────────────────────────────────────────────

export const Checkable: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { nodes: MACHINE_TREE },
    template: `
      <div class="w-72 p-2 border border-border rounded-lg">
        <ui-tree [nodes]="nodes" [checkable]="true"></ui-tree>
      </div>
    `,
  }),
};

// ── Machine Fleet ─────────────────────────────────────────────────────────────

export const MachineFHierarchy: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    props: { nodes: MACHINE_TREE },
    template: `
      <div class="space-y-2">
        <p class="text-sm font-medium">Machine Fleet</p>
        <div class="w-72 p-2 border border-border rounded-lg">
          <ui-tree [nodes]="nodes"></ui-tree>
        </div>
      </div>
    `,
  }),
};
