// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbEllipsisComponent,
} from './breadcrumb.component';

const ALL = [
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbEllipsisComponent,
];

const meta: Meta<BreadcrumbComponent> = {
  title: 'Navigation/Breadcrumb',
  component: BreadcrumbComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<BreadcrumbComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-breadcrumb>
        <ui-breadcrumb-list>
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Home</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator />
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Products</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator />
          <ui-breadcrumb-item>
            <ui-breadcrumb-page>Bottle Capper X200</ui-breadcrumb-page>
          </ui-breadcrumb-item>
        </ui-breadcrumb-list>
      </ui-breadcrumb>
    `,
  }),
};

// ── With Ellipsis ─────────────────────────────────────────────────────────────

export const WithEllipsis: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-breadcrumb>
        <ui-breadcrumb-list>
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Home</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator />
          <ui-breadcrumb-item>
            <ui-breadcrumb-ellipsis />
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator />
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Products</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator />
          <ui-breadcrumb-item>
            <ui-breadcrumb-page>Bottle Capper X200</ui-breadcrumb-page>
          </ui-breadcrumb-item>
        </ui-breadcrumb-list>
      </ui-breadcrumb>
    `,
  }),
};

// ── Custom Separator ──────────────────────────────────────────────────────────

export const CustomSeparator: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-breadcrumb>
        <ui-breadcrumb-list>
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Home</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator>
            <span class="text-muted-foreground">/</span>
          </ui-breadcrumb-separator>
          <ui-breadcrumb-item>
            <a uiBreadcrumbLink href="#">Orders</a>
          </ui-breadcrumb-item>
          <ui-breadcrumb-separator>
            <span class="text-muted-foreground">/</span>
          </ui-breadcrumb-separator>
          <ui-breadcrumb-item>
            <ui-breadcrumb-page>Order #4521</ui-breadcrumb-page>
          </ui-breadcrumb-item>
        </ui-breadcrumb-list>
      </ui-breadcrumb>
    `,
  }),
};
