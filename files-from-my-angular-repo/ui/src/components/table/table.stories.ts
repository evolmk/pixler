// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
  type DataTableColumn,
} from './table.component';

const ALL = [
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
];

const meta: Meta<TableComponent> = {
  title: 'Display/Table',
  component: TableComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'bordered'] },
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<TableComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-8 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variant: Default</p>
          <ui-table variant="default">
            <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
            <ui-table-body><ui-table-row><ui-table-cell>Alpha</ui-table-cell><ui-table-cell>100</ui-table-cell></ui-table-row><ui-table-row><ui-table-cell>Beta</ui-table-cell><ui-table-cell>200</ui-table-cell></ui-table-row></ui-table-body>
          </ui-table>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variant: Bordered</p>
          <ui-table variant="bordered">
            <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
            <ui-table-body><ui-table-row><ui-table-cell>Alpha</ui-table-cell><ui-table-cell>100</ui-table-cell></ui-table-row><ui-table-row><ui-table-cell>Beta</ui-table-cell><ui-table-cell>200</ui-table-cell></ui-table-row></ui-table-body>
          </ui-table>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes: sm / default / lg</p>
          <div class="space-y-4">
            <ui-table size="sm">
              <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
              <ui-table-body><ui-table-row><ui-table-cell>sm row</ui-table-cell><ui-table-cell>100</ui-table-cell></ui-table-row></ui-table-body>
            </ui-table>
            <ui-table size="default">
              <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
              <ui-table-body><ui-table-row><ui-table-cell>default row</ui-table-cell><ui-table-cell>200</ui-table-cell></ui-table-row></ui-table-body>
            </ui-table>
            <ui-table size="lg">
              <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
              <ui-table-body><ui-table-row><ui-table-cell>lg row</ui-table-cell><ui-table-cell>300</ui-table-cell></ui-table-row></ui-table-body>
            </ui-table>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Striped (bordered + sm)</p>
          <ui-table variant="bordered" size="sm" [striped]="true">
            <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head><ui-table-head>Value</ui-table-head></ui-table-row></ui-table-header>
            <ui-table-body>
              <ui-table-row><ui-table-cell>Row 1</ui-table-cell><ui-table-cell>100</ui-table-cell></ui-table-row>
              <ui-table-row><ui-table-cell>Row 2</ui-table-cell><ui-table-cell>200</ui-table-cell></ui-table-row>
              <ui-table-row><ui-table-cell>Row 3</ui-table-cell><ui-table-cell>300</ui-table-cell></ui-table-row>
            </ui-table-body>
          </ui-table>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: ALL },
    props: args,
    template: `
      <ui-table [variant]="variant" [size]="size">
        <ui-table-header>
          <ui-table-row>
            <ui-table-head>Order</ui-table-head>
            <ui-table-head>Customer</ui-table-head>
            <ui-table-head>Status</ui-table-head>
            <ui-table-head>Date</ui-table-head>
            <ui-table-head class="text-right">Amount</ui-table-head>
          </ui-table-row>
        </ui-table-header>
        <ui-table-body>
          <ui-table-row>
            <ui-table-cell class="font-medium">#4521</ui-table-cell>
            <ui-table-cell>Acme Corp</ui-table-cell>
            <ui-table-cell><span class="text-green-600">Shipped</span></ui-table-cell>
            <ui-table-cell>Jan 15, 2026</ui-table-cell>
            <ui-table-cell class="text-right">$12,400.00</ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">#4520</ui-table-cell>
            <ui-table-cell>BevCo Industries</ui-table-cell>
            <ui-table-cell><span class="text-yellow-600">Processing</span></ui-table-cell>
            <ui-table-cell>Jan 14, 2026</ui-table-cell>
            <ui-table-cell class="text-right">$8,200.00</ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">#4519</ui-table-cell>
            <ui-table-cell>PharmaLine Ltd</ui-table-cell>
            <ui-table-cell><span class="text-blue-600">Delivered</span></ui-table-cell>
            <ui-table-cell>Jan 13, 2026</ui-table-cell>
            <ui-table-cell class="text-right">$31,750.00</ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">#4518</ui-table-cell>
            <ui-table-cell>CosmetiCare</ui-table-cell>
            <ui-table-cell><span class="text-red-600">Cancelled</span></ui-table-cell>
            <ui-table-cell>Jan 12, 2026</ui-table-cell>
            <ui-table-cell class="text-right">$5,900.00</ui-table-cell>
          </ui-table-row>
        </ui-table-body>
        <ui-table-footer>
          <ui-table-row>
            <ui-table-cell colspan="4" class="font-medium">Total (3 active)</ui-table-cell>
            <ui-table-cell class="text-right font-bold">$52,350.00</ui-table-cell>
          </ui-table-row>
        </ui-table-footer>
      </ui-table>
    `,
  }),
  args: { variant: 'default', size: 'default' },
};

// ── Bordered ──────────────────────────────────────────────────────────────────

export const Bordered: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-table variant="bordered" size="sm">
        <ui-table-header>
          <ui-table-row>
            <ui-table-head>Machine</ui-table-head>
            <ui-table-head>Type</ui-table-head>
            <ui-table-head>Speed (CPM)</ui-table-head>
            <ui-table-head>Status</ui-table-head>
          </ui-table-row>
        </ui-table-header>
        <ui-table-body>
          <ui-table-row>
            <ui-table-cell class="font-medium">LZR-2000</ui-table-cell>
            <ui-table-cell>Rotary Chuck</ui-table-cell>
            <ui-table-cell>300</ui-table-cell>
            <ui-table-cell><span class="text-green-600">Online</span></ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">LZR-1500</ui-table-cell>
            <ui-table-cell>Inline Spindle</ui-table-cell>
            <ui-table-cell>200</ui-table-cell>
            <ui-table-cell><span class="text-green-600">Online</span></ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">LZR-800</ui-table-cell>
            <ui-table-cell>Snap-On</ui-table-cell>
            <ui-table-cell>150</ui-table-cell>
            <ui-table-cell><span class="text-yellow-600">Maintenance</span></ui-table-cell>
          </ui-table-row>
        </ui-table-body>
      </ui-table>
    `,
  }),
};

// ── With Caption ──────────────────────────────────────────────────────────────

export const WithCaption: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-table>
        <ui-table-caption>A list of recent invoices — Q1 2026</ui-table-caption>
        <ui-table-header>
          <ui-table-row>
            <ui-table-head>Invoice</ui-table-head>
            <ui-table-head>Status</ui-table-head>
            <ui-table-head class="text-right">Amount</ui-table-head>
          </ui-table-row>
        </ui-table-header>
        <ui-table-body>
          <ui-table-row>
            <ui-table-cell class="font-medium">INV-001</ui-table-cell>
            <ui-table-cell>Paid</ui-table-cell>
            <ui-table-cell class="text-right">$250.00</ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">INV-002</ui-table-cell>
            <ui-table-cell>Pending</ui-table-cell>
            <ui-table-cell class="text-right">$150.00</ui-table-cell>
          </ui-table-row>
          <ui-table-row>
            <ui-table-cell class="font-medium">INV-003</ui-table-cell>
            <ui-table-cell>Overdue</ui-table-cell>
            <ui-table-cell class="text-right">$350.00</ui-table-cell>
          </ui-table-row>
        </ui-table-body>
      </ui-table>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-6">
        <div>
          <p class="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">sm</p>
          <ui-table size="sm">
            <ui-table-header>
              <ui-table-row>
                <ui-table-head>Name</ui-table-head>
                <ui-table-head>Value</ui-table-head>
              </ui-table-row>
            </ui-table-header>
            <ui-table-body>
              <ui-table-row>
                <ui-table-cell>Alpha</ui-table-cell>
                <ui-table-cell>100</ui-table-cell>
              </ui-table-row>
            </ui-table-body>
          </ui-table>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">default</p>
          <ui-table size="default">
            <ui-table-header>
              <ui-table-row>
                <ui-table-head>Name</ui-table-head>
                <ui-table-head>Value</ui-table-head>
              </ui-table-row>
            </ui-table-header>
            <ui-table-body>
              <ui-table-row>
                <ui-table-cell>Alpha</ui-table-cell>
                <ui-table-cell>100</ui-table-cell>
              </ui-table-row>
            </ui-table-body>
          </ui-table>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">lg</p>
          <ui-table size="lg">
            <ui-table-header>
              <ui-table-row>
                <ui-table-head>Name</ui-table-head>
                <ui-table-head>Value</ui-table-head>
              </ui-table-row>
            </ui-table-header>
            <ui-table-body>
              <ui-table-row>
                <ui-table-cell>Alpha</ui-table-cell>
                <ui-table-cell>100</ui-table-cell>
              </ui-table-row>
            </ui-table-body>
          </ui-table>
        </div>
      </div>
    `,
  }),
};

// ── Data Driven ───────────────────────────────────────────────────────────────

const ddData = [
  { id: 'ORD-4521', customer: 'Acme Corp', status: 'Shipped', amount: 12400 },
  { id: 'ORD-4520', customer: 'BevCo Industries', status: 'Processing', amount: 8200 },
  { id: 'ORD-4519', customer: 'PharmaLine Ltd', status: 'Delivered', amount: 31750 },
  { id: 'ORD-4518', customer: 'CosmetiCare', status: 'Cancelled', amount: 5900 },
  { id: 'ORD-4517', customer: 'NutriPack GmbH', status: 'Shipped', amount: 14300 },
  { id: 'ORD-4516', customer: 'FreshBev Co', status: 'Processing', amount: 9100 },
];

const ddColumns: DataTableColumn[] = [
  { key: 'id', header: 'Order #', sortable: true, width: '120px' },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, cell: (row) => `$${(row['amount'] as number).toLocaleString()}` },
];

export const DataDriven: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent] },
    props: { data: ddData, columns: ddColumns },
    template: `
      <ui-table [data]="data" [columns]="columns" rowId="id" [filterable]="true" [paginated]="true" [pageSize]="4">
      </ui-table>
    `,
  }),
};

export const DataDrivenBordered: Story = {
  render: () => ({
    moduleMetadata: { imports: [TableComponent] },
    props: { data: ddData, columns: ddColumns },
    template: `
      <ui-table [data]="data" [columns]="columns" rowId="id" variant="bordered" size="sm" [striped]="true">
      </ui-table>
    `,
  }),
};
