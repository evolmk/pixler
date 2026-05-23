// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { TableDataComponent } from './components/table-data.component';
import { TableDataFilterDrawerComponent } from './components/table-data-filter-drawer.component';
import { TableDataFooterComponent } from './components/table-data-footer.component';
import { TableDataHeaderComponent } from './components/table-data-header.component';
import { TableDataTableComponent } from './components/table-data-table.component';
import { CellCompanyComponent } from './cells/cell-company.component';
import { CellContactComponent } from './cells/cell-contact.component';
import { CellFlagLocationComponent } from './cells/cell-flag-location.component';
import { CellStatusPillComponent } from './cells/cell-status-pill.component';
import type { TableDataColumn } from './types/column.types';
import type { TableDataTab } from './types/tab.types';
import type { TableDataFilterSection } from './types/filter.types';

// ── Mock Data ─────────────────────────────────────────────────────────────────

interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  domains: string;
  flag: string;
  location: string;
  contactName: string;
  contactAvatar: string | null;
  status: string;
  employees: number;
  founded: string;
  active: boolean;
}

const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Apple',
    description: 'Global leader in consumer electronics',
    logoUrl: null,
    domains: 'apple.com',
    flag: '🇺🇸',
    location: 'Cupertino, CA',
    contactName: 'Giannis Prophen',
    contactAvatar: null,
    status: 'Active',
    employees: 164000,
    founded: '1976-04-01',
    active: true,
  },
  {
    id: '2',
    name: 'Microsoft',
    description: 'Technology giant providing cloud solutions',
    logoUrl: null,
    domains: 'microsoft.com',
    flag: '🇺🇸',
    location: 'Redmond, WA',
    contactName: 'Rachel Summers',
    contactAvatar: null,
    status: 'Active',
    employees: 221000,
    founded: '1975-04-04',
    active: true,
  },
  {
    id: '3',
    name: 'Amazon',
    description: 'E-commerce, cloud computing and AI',
    logoUrl: null,
    domains: 'amazon.com',
    flag: '🇺🇸',
    location: 'Seattle, WA',
    contactName: 'Michael Tan',
    contactAvatar: null,
    status: 'In Negotiation',
    employees: 1540000,
    founded: '1994-07-05',
    active: true,
  },
  {
    id: '4',
    name: 'Google',
    description: 'Leading provider of search and ads',
    logoUrl: null,
    domains: 'google.com',
    flag: '🇺🇸',
    location: 'Mountain View, CA',
    contactName: 'Sofia Carter',
    contactAvatar: null,
    status: 'Active',
    employees: 182000,
    founded: '1998-09-04',
    active: true,
  },
  {
    id: '5',
    name: 'Tesla',
    description: 'Electric vehicle and energy company',
    logoUrl: null,
    domains: 'tesla.com',
    flag: '🇺🇸',
    location: 'Palo Alto, CA',
    contactName: 'Liam Bennett',
    contactAvatar: null,
    status: 'Archived',
    employees: 127855,
    founded: '2003-07-01',
    active: false,
  },
  {
    id: '6',
    name: 'NVIDIA',
    description: 'GPU and AI chip pioneer',
    logoUrl: null,
    domains: 'nvidia.com',
    flag: '🇺🇸',
    location: 'Santa Clara, CA',
    contactName: 'John Harrison',
    contactAvatar: null,
    status: 'Active',
    employees: 29600,
    founded: '1993-01-01',
    active: true,
  },
  {
    id: '7',
    name: 'Meta',
    description: 'Social media and technology conglomerate',
    logoUrl: null,
    domains: 'meta.com',
    flag: '🇺🇸',
    location: 'Menlo Park, CA',
    contactName: 'Emma Jones',
    contactAvatar: null,
    status: 'Active',
    employees: 67317,
    founded: '2004-02-04',
    active: true,
  },
  {
    id: '8',
    name: 'Samsung',
    description: 'South Korean electronics corporation',
    logoUrl: null,
    domains: 'samsung.com',
    flag: '🇰🇷',
    location: 'Suwon, South Korea',
    contactName: 'Min-Ji Park',
    contactAvatar: null,
    status: 'In Negotiation',
    employees: 267937,
    founded: '1969-01-13',
    active: true,
  },
  {
    id: '9',
    name: 'Oracle',
    description: 'Cloud and enterprise software',
    logoUrl: null,
    domains: 'oracle.com',
    flag: '🇺🇸',
    location: 'Austin, TX',
    contactName: 'Ethan Brown',
    contactAvatar: null,
    status: 'Active',
    employees: 143000,
    founded: '1977-06-16',
    active: true,
  },
  {
    id: '10',
    name: 'Tencent',
    description: 'Gaming, social, and cloud conglomerate',
    logoUrl: null,
    domains: 'tencent.com',
    flag: '🇨🇳',
    location: 'Shenzhen, China',
    contactName: 'Wei Chen',
    contactAvatar: null,
    status: 'Active',
    employees: 108436,
    founded: '1998-11-11',
    active: true,
  },
  {
    id: '11',
    name: 'ByteDance',
    description: 'Parent company of TikTok',
    logoUrl: null,
    domains: 'bytedance.com',
    flag: '🇨🇳',
    location: 'Beijing, China',
    contactName: 'Jing Liu',
    contactAvatar: null,
    status: 'Archived',
    employees: 110000,
    founded: '2012-03-01',
    active: false,
  },
  {
    id: '12',
    name: 'SpaceX',
    description: 'Aerospace and space transport services',
    logoUrl: null,
    domains: 'spacex.com',
    flag: '🇺🇸',
    location: 'Hawthorne, CA',
    contactName: 'Noah White',
    contactAvatar: null,
    status: 'Active',
    employees: 13000,
    founded: '2002-05-06',
    active: true,
  },
  {
    id: '13',
    name: 'Intel',
    description: 'Semiconductor and technology company',
    logoUrl: null,
    domains: 'intel.com',
    flag: '🇺🇸',
    location: 'Santa Clara, CA',
    contactName: 'Sarah Nguyen',
    contactAvatar: null,
    status: 'Active',
    employees: 124800,
    founded: '1968-07-18',
    active: true,
  },
  {
    id: '14',
    name: 'Coca-Cola',
    description: 'Beverage giant with global portfolio',
    logoUrl: null,
    domains: 'coca-cola.com',
    flag: '🇺🇸',
    location: 'Atlanta, GA',
    contactName: 'Brian Lee',
    contactAvatar: null,
    status: 'In Negotiation',
    employees: 79000,
    founded: '1892-01-29',
    active: true,
  },
];

const ACTIVE_COMPANIES = COMPANIES.filter((c) => c.status === 'Active');
const ARCHIVED_COMPANIES = COMPANIES.filter((c) => c.status === 'Archived');

/** Tabs with explicit counts (server-side pattern). */
const TABS: TableDataTab[] = [
  { value: 'active', label: 'Active', count: ACTIVE_COMPANIES.length },
  { value: 'archived', label: 'Archived', count: ARCHIVED_COMPANIES.length },
  { value: 'all', label: 'All', count: COMPANIES.length },
];

/** Tabs with filterKey — counts auto-computed from data (client-side pattern). */
const CLIENT_TABS: TableDataTab[] = [
  { value: 'active', label: 'Active', filterKey: 'active', filterValue: true },
  { value: 'archived', label: 'Archived', filterKey: 'active', filterValue: false },
  { value: 'all', label: 'All' },
];

const COLUMNS: TableDataColumn<Company>[] = [
  {
    key: 'name',
    label: 'Company',
    visible: true,
    sortable: true,
    cellType: 'company',
    width: '240px',
    cellData: { descriptionKey: 'description', avatarKey: 'logoUrl' },
  },
  {
    key: 'domains',
    label: 'Domains',
    visible: true,
    sortable: false,
    cellType: 'text',
    width: '160px',
  },
  {
    key: 'location',
    label: 'Location',
    visible: true,
    sortable: true,
    cellType: 'flag-location',
    width: '180px',
    cellData: { flagKey: 'flag' },
  },
  {
    key: 'contactName',
    label: 'Person to Contact',
    visible: true,
    sortable: false,
    cellType: 'contact',
    width: '200px',
    cellData: { avatarKey: 'contactAvatar' },
  },
  {
    key: 'status',
    label: 'Status',
    visible: true,
    sortable: true,
    cellType: 'status-pill',
    width: '140px',
    cellData: {
      colorMap: {
        Active: 'green',
        Archived: 'gray',
        'In Negotiation': 'orange',
      },
    },
  },
];

const FILTER_SECTIONS: TableDataFilterSection[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'checkbox',
    options: ['Active', 'Archived', 'In Negotiation'],
  },
  {
    key: 'location',
    label: 'Country',
    type: 'checkbox',
    options: ['United States', 'South Korea', 'China'],
  },
];

// ── Auto-Filter Columns (with filterable flag) ───────────────────────────────

const AUTO_FILTER_COLUMNS: TableDataColumn<Company>[] = [
  {
    key: 'name',
    label: 'Company',
    sortable: true,
    filterable: true,
    cellType: 'company',
    width: '240px',
    cellData: { descriptionKey: 'description', avatarKey: 'logoUrl' },
  },
  {
    key: 'domains',
    label: 'Domains',
    cellType: 'text',
    width: '160px',
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    filterable: true,
    cellType: 'flag-location',
    width: '180px',
    cellData: { flagKey: 'flag' },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    cellType: 'status-pill',
    width: '140px',
    cellData: {
      colorMap: {
        Active: 'green',
        Archived: 'gray',
        'In Negotiation': 'orange',
      },
    },
  },
  {
    key: 'employees',
    label: 'Employees',
    sortable: true,
    filterable: true,
    cellType: 'text',
    width: '140px',
  },
  {
    key: 'founded',
    label: 'Founded',
    sortable: true,
    filterable: true,
    cellType: 'text',
    width: '140px',
  },
  {
    key: 'active',
    label: 'Active',
    filterable: true,
    cellType: 'text',
    width: '100px',
  },
];

const ALL_IMPORTS = [
  TableDataComponent,
  TableDataHeaderComponent,
  TableDataTableComponent,
  TableDataFooterComponent,
  TableDataFilterDrawerComponent,
  CellCompanyComponent,
  CellContactComponent,
  CellFlagLocationComponent,
  CellStatusPillComponent,
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<TableDataComponent<Company>> = {
  title: 'Features/Table Data',
  component: TableDataComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<TableDataComponent<Company>>;

// ── Self-Contained (Canonical) ────────────────────────────────────────────────

export const SelfContained: Story = {
  name: 'Self-Contained',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: AUTO_FILTER_COLUMNS,
      tabs: CLIENT_TABS,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <h2 class="text-lg font-semibold mb-2 text-foreground">Self-Contained Mode</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Zero event handlers. Tabs with auto-computed counts, search, sort, filter,
          and pagination all handled internally.
        </p>
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [tabs]="tabs"
          defaultTab="active"
          [pageSize]="5"
        />
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: COLUMNS,
      tabs: TABS,
      defaultTab: 'active',
      filterSections: FILTER_SECTIONS,
      total: COMPANIES.length,
      pageSize: 25,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [tabs]="tabs"
          defaultTab="active"
          [filterSections]="filterSections"
          [total]="total"
          [pageSize]="pageSize"
          applyMode="manual"
        />
      </div>
    `,
  }),
};

// ── With Active Filters ───────────────────────────────────────────────────────

export const WithFiltersActive: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: ACTIVE_COMPANIES,
      columns: COLUMNS,
      tabs: TABS,
      filterSections: FILTER_SECTIONS,
      total: ACTIVE_COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [tabs]="tabs"
          defaultTab="active"
          [filterSections]="filterSections"
          [total]="total"
          [pageSize]="25"
          applyMode="manual"
        />
      </div>
    `,
  }),
};

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: [],
      columns: COLUMNS,
      tabs: TABS,
      filterSections: FILTER_SECTIONS,
      total: 0,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [tabs]="tabs"
          defaultTab="active"
          [filterSections]="filterSections"
          [total]="total"
          [loading]="true"
          [pageSize]="25"
        />
      </div>
    `,
  }),
};

// ── Empty ─────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: [],
      columns: COLUMNS,
      tabs: TABS,
      filterSections: FILTER_SECTIONS,
      total: 0,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [tabs]="tabs"
          defaultTab="active"
          [filterSections]="filterSections"
          [total]="total"
          [pageSize]="25"
        />
      </div>
    `,
  }),
};

// ── No Tabs ───────────────────────────────────────────────────────────────────

export const NoTabs: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: COLUMNS,
      total: COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [total]="total"
          [pageSize]="25"
        />
      </div>
    `,
  }),
};

// ── Auto Filters — All Types ─────────────────────────────────────────────────

export const AutoFiltersAllTypes: Story = {
  name: 'Auto Filters — All Types',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: AUTO_FILTER_COLUMNS,
      total: COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <h2 class="text-lg font-semibold mb-4 text-foreground">
          Auto-detected filter types: checkbox (status, location), text-search (company),
          number-range (employees), date-range (founded), boolean (active)
        </h2>
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [total]="total"
          [pageSize]="25"
        />
      </div>
    `,
  }),
};

// ── Auto Filters — With Overrides ────────────────────────────────────────────

const OVERRIDE_COLUMNS: TableDataColumn<Company>[] = AUTO_FILTER_COLUMNS.map((col) => {
  if (col.key === 'status') {
    return {
      ...col,
      filterOverride: {
        label: 'Account Status',
        options: ['Active', 'In Negotiation'],
      },
    };
  }
  if (col.key === 'active') {
    return {
      ...col,
      filterOverride: { exclude: true },
    };
  }
  return col;
});

export const AutoFiltersWithOverrides: Story = {
  name: 'Auto Filters — With Overrides',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: OVERRIDE_COLUMNS,
      total: COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <h2 class="text-lg font-semibold mb-4 text-foreground">
          Status renamed to "Account Status" with custom options. Active column excluded.
        </h2>
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [total]="total"
          [pageSize]="25"
        />
      </div>
    `,
  }),
};

// ── Manual Mode ──────────────────────────────────────────────────────────────

export const ManualMode: Story = {
  name: 'Manual Mode (Save/Cancel)',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: AUTO_FILTER_COLUMNS,
      total: COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <h2 class="text-lg font-semibold mb-4 text-foreground">
          applyMode="manual" — filters only apply when Save is clicked.
        </h2>
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [total]="total"
          [pageSize]="25"
          applyMode="manual"
        />
      </div>
    `,
  }),
};

// ── Server-Side Filtering ────────────────────────────────────────────────────

export const ServerSideFiltering: Story = {
  name: 'Server-Side Filtering',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      data: COMPANIES,
      columns: AUTO_FILTER_COLUMNS,
      total: COMPANIES.length,
    },
    template: `
      <div class="p-6 bg-background min-h-screen">
        <h2 class="text-lg font-semibold mb-4 text-foreground">
          clientFilter=false — component emits filterChange events but does not filter internally.
          Parent handles server-side filtering.
        </h2>
        <ui-table-data
          [data]="data"
          [columns]="columns"
          [total]="total"
          [pageSize]="25"
          [clientFilter]="false"
        />
      </div>
    `,
  }),
};
