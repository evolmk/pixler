// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  PaginationComponent,
  PaginationContentComponent,
  PaginationEllipsisComponent,
  PaginationItemComponent,
  PaginationLinkDirective,
  PaginationNextComponent,
  PaginationPreviousComponent,
} from './pagination.component';

const ALL = [
  PaginationComponent,
  PaginationContentComponent,
  PaginationItemComponent,
  PaginationLinkDirective,
  PaginationPreviousComponent,
  PaginationNextComponent,
  PaginationEllipsisComponent,
];

const meta: Meta<PaginationComponent> = {
  title: 'Navigation/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<PaginationComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default (numbered pages)</p>
          <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="5" variant="default" />
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Minimal (prev/next only)</p>
          <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="3" variant="minimal" />
        </div>
      </div>
    `,
  }),
};

// ── Auto-generated: Default variant ──────────────────────────────────────────

export const Default: Story = {
  name: 'Default (auto-generated)',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4 py-4">
        <p class="text-sm text-muted-foreground">Page 1 of 10 — shows ellipsis near end</p>
        <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="1" variant="default" />

        <p class="text-sm text-muted-foreground">Page 5 of 10 — ellipsis on both sides</p>
        <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="5" variant="default" />

        <p class="text-sm text-muted-foreground">Page 10 of 10 — last page</p>
        <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="10" variant="default" />
      </div>
    `,
  }),
};

// ── Minimal variant ───────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: 'Minimal (Prev / Next only)',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4 py-4">
        <p class="text-sm text-muted-foreground">Minimal — no page numbers</p>
        <ui-pagination [total]="100" [pageSize]="10" [pageIndex]="3" variant="minimal" />
      </div>
    `,
  }),
};

// ── Custom labels ─────────────────────────────────────────────────────────────

export const CustomLabels: Story = {
  name: 'Custom Labels',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4 py-4">
        <p class="text-sm text-muted-foreground">Custom labels: Previous / Next</p>
        <ui-pagination
          [total]="100" [pageSize]="10" [pageIndex]="3"
          variant="default"
          previousLabel="Previous"
          nextLabel="Next"
        />

        <p class="text-sm text-muted-foreground">Custom labels: « Back / Forward »</p>
        <ui-pagination
          [total]="100" [pageSize]="10" [pageIndex]="3"
          variant="default"
          previousLabel="« Back"
          nextLabel="Forward »"
        />
      </div>
    `,
  }),
};

// ── Max visible pages ─────────────────────────────────────────────────────────

export const MaxVisiblePages: Story = {
  name: 'Max Visible Pages',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4 py-4">
        <p class="text-sm text-muted-foreground">maxVisiblePages=5 (compact)</p>
        <ui-pagination [total]="200" [pageSize]="10" [pageIndex]="10" variant="default" [maxVisiblePages]="5" />

        <p class="text-sm text-muted-foreground">maxVisiblePages=7 (default)</p>
        <ui-pagination [total]="200" [pageSize]="10" [pageIndex]="10" variant="default" [maxVisiblePages]="7" />

        <p class="text-sm text-muted-foreground">maxVisiblePages=9 (spacious)</p>
        <ui-pagination [total]="200" [pageSize]="10" [pageIndex]="10" variant="default" [maxVisiblePages]="9" />
      </div>
    `,
  }),
};

// ── Few pages ─────────────────────────────────────────────────────────────────

export const FewPages: Story = {
  name: 'Few Pages (no ellipsis needed)',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-4 py-4">
        <p class="text-sm text-muted-foreground">3 pages — all shown, no ellipsis</p>
        <ui-pagination [total]="30" [pageSize]="10" [pageIndex]="1" variant="default" />

        <p class="text-sm text-muted-foreground">1 page — both buttons disabled</p>
        <ui-pagination [total]="8" [pageSize]="10" [pageIndex]="1" variant="default" />
      </div>
    `,
  }),
};

// ── Legacy: manual composition (backwards-compatible) ────────────────────────

export const ManualComposition: Story = {
  name: 'Manual Composition (legacy / custom)',
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-2 py-4">
        <p class="text-sm text-muted-foreground">Custom projected content — backwards-compatible</p>
        <ui-pagination>
          <ui-pagination-content>
            <ui-pagination-item>
              <button uiPaginationLink disabled>
                <ui-pagination-previous />
              </button>
            </ui-pagination-item>
            <ui-pagination-item>
              <button uiPaginationLink [isActive]="true">1</button>
            </ui-pagination-item>
            <ui-pagination-item>
              <button uiPaginationLink>2</button>
            </ui-pagination-item>
            <ui-pagination-item>
              <ui-pagination-ellipsis />
            </ui-pagination-item>
            <ui-pagination-item>
              <button uiPaginationLink>10</button>
            </ui-pagination-item>
            <ui-pagination-item>
              <button uiPaginationLink>
                <ui-pagination-next />
              </button>
            </ui-pagination-item>
          </ui-pagination-content>
        </ui-pagination>
      </div>
    `,
  }),
};
