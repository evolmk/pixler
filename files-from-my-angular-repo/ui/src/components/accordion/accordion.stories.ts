// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from './accordion.component';

const ALL = [AccordionComponent, AccordionItemComponent, AccordionTriggerComponent, AccordionContentComponent];

const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'card', 'filled', 'bordered', 'separated'] },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg', 'xl'] },
  },
};
export default meta;
type Story = StoryObj<AccordionComponent>;

// helper — 3-item FAQ accordion template
const faqItems = (prefix = '') => `
  <ui-accordion-item value="${prefix}1">
    <ui-accordion-trigger>What is your return policy?</ui-accordion-trigger>
    <ui-accordion-content>
      We offer a 30-day return policy on all unused items. Items must be in their original packaging.
    </ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item value="${prefix}2">
    <ui-accordion-trigger>How do I track my order?</ui-accordion-trigger>
    <ui-accordion-content>
      Once your order ships, you'll receive a tracking number via email. Use it on our tracking page.
    </ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item value="${prefix}3">
    <ui-accordion-trigger>Do you offer international shipping?</ui-accordion-trigger>
    <ui-accordion-content>
      Yes, we ship to over 50 countries. Shipping rates and delivery times vary by destination.
    </ui-accordion-content>
  </ui-accordion-item>
`;

// ── Default Variant ─────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" [collapsible]="true" class="w-full max-w-lg">
        ${faqItems()}
      </ui-accordion>
    `,
  }),
};

// ── All Sizes ───────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-8 p-6">
        <div *ngFor="let s of sizes">
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: {{ s }}</p>
          <ui-accordion type="single" [collapsible]="true" [size]="s" class="w-full max-w-lg">
            ${faqItems('sz-')}
          </ui-accordion>
        </div>
      </div>
    `,
    props: { sizes: ['xs', 'sm', 'default', 'lg', 'xl'] },
  }),
};

// ── Card Variant ────────────────────────────────────────────────────────────

export const Card: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="card" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger>Team member limits</ui-accordion-trigger>
          <ui-accordion-content>
            Free plans support up to 5 team members. Upgrade to Pro for unlimited members.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger>Real-time collaboration</ui-accordion-trigger>
          <ui-accordion-content>
            All plans include real-time collaboration. Changes sync instantly across all connected devices.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger>Permission management</ui-accordion-trigger>
          <ui-accordion-content>
            Assign roles like Admin, Editor, or Viewer to control access at the project or workspace level.
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Filled Variant ──────────────────────────────────────────────────────────

export const Filled: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="filled" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger>Getting started</ui-accordion-trigger>
          <ui-accordion-content>
            Create your account, set up your workspace, and invite your team to get started in minutes.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger>Configuration</ui-accordion-trigger>
          <ui-accordion-content>
            Customize your dashboard, set notification preferences, and configure integrations.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger>Advanced features</ui-accordion-trigger>
          <ui-accordion-content>
            Unlock API access, custom workflows, and advanced analytics with the Pro plan.
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Bordered Variant ────────────────────────────────────────────────────────

export const Bordered: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="bordered" [collapsible]="true" class="w-full max-w-lg">
        ${faqItems('brd-')}
      </ui-accordion>
    `,
  }),
};

// ── Separated Variant ───────────────────────────────────────────────────────

export const Separated: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="separated" [collapsible]="true" class="w-full max-w-lg">
        ${faqItems('sep-')}
      </ui-accordion>
    `,
  }),
};

// ── Icon + Subtitle ─────────────────────────────────────────────────────────

export const IconAndSubtitle: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="card" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger>
            <div class="flex items-start gap-3">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              <div class="text-left">
                <div class="font-medium">Documents</div>
                <div class="text-xs text-muted-foreground">Manage your files and documents</div>
              </div>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            Upload, organize, and share documents with your team. Supports PDF, DOCX, and image formats.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger>
            <div class="flex items-start gap-3">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </span>
              <div class="text-left">
                <div class="font-medium">Projects</div>
                <div class="text-xs text-muted-foreground">Organize and track your projects</div>
              </div>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            Create project boards, assign tasks, set deadlines, and track progress with built-in analytics.
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger>
            <div class="flex items-start gap-3">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
              <div class="text-left">
                <div class="font-medium">Settings</div>
                <div class="text-xs text-muted-foreground">Configure your workspace</div>
              </div>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            Manage workspace settings, billing information, team permissions, and integration configurations.
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Multi-Level / Nested ────────────────────────────────────────────────────

export const MultiLevel: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="bordered" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="company">
          <ui-accordion-trigger>Company Overview</ui-accordion-trigger>
          <ui-accordion-content>
            <ui-accordion type="single" [collapsible]="true" class="mt-2">
              <ui-accordion-item value="mission">
                <ui-accordion-trigger icon="plus">Mission Statement</ui-accordion-trigger>
                <ui-accordion-content>
                  To deliver innovative bottle capping solutions that exceed industry standards.
                </ui-accordion-content>
              </ui-accordion-item>
              <ui-accordion-item value="values">
                <ui-accordion-trigger icon="plus">Core Values</ui-accordion-trigger>
                <ui-accordion-content>
                  Quality, Innovation, Customer Focus, and Sustainability guide everything we do.
                </ui-accordion-content>
              </ui-accordion-item>
            </ui-accordion>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="products">
          <ui-accordion-trigger>Products & Services</ui-accordion-trigger>
          <ui-accordion-content>
            <ui-accordion type="single" [collapsible]="true" class="mt-2">
              <ui-accordion-item value="cappers">
                <ui-accordion-trigger icon="plus">Capping Machines</ui-accordion-trigger>
                <ui-accordion-content>
                  High-speed rotary and inline cappers for bottles, jars, and containers of all sizes.
                </ui-accordion-content>
              </ui-accordion-item>
              <ui-accordion-item value="parts">
                <ui-accordion-trigger icon="plus">Replacement Parts</ui-accordion-trigger>
                <ui-accordion-content>
                  OEM replacement parts with same-day shipping for minimal downtime.
                </ui-accordion-content>
              </ui-accordion-item>
            </ui-accordion>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="contact">
          <ui-accordion-trigger>Contact Information</ui-accordion-trigger>
          <ui-accordion-content>
            Reach us at support&#64;lazar.com or call 1-800-LAZAR for immediate assistance.
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Numbered FAQ ────────────────────────────────────────────────────────────

export const NumberedFAQ: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="separated" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger>
            <div class="flex items-center gap-4">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">01</span>
              <span>What payment methods do you accept?</span>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            <div class="ml-12">
              We accept all major credit cards, wire transfers, and purchase orders for enterprise accounts.
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger>
            <div class="flex items-center gap-4">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">02</span>
              <span>How long does installation take?</span>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            <div class="ml-12">
              Standard installations are completed within 2-3 business days. Complex setups may require up to a week.
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger>
            <div class="flex items-center gap-4">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">03</span>
              <span>Do you provide training?</span>
            </div>
          </ui-accordion-trigger>
          <ui-accordion-content>
            <div class="ml-12">
              Yes, every purchase includes complimentary operator training. Advanced training packages are also available.
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Media ───────────────────────────────────────────────────────────────────

export const Media: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="card" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger>Rotary Capping Machine</ui-accordion-trigger>
          <ui-accordion-content>
            <div class="flex gap-4">
              <div class="h-24 w-24 shrink-0 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                Image
              </div>
              <div>
                <p class="font-medium mb-1">RC-5000 Series</p>
                <p class="text-muted-foreground text-sm">
                  High-speed rotary capper handling up to 300 bottles per minute. Features automatic torque control and quick-change chuck system.
                </p>
              </div>
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger>Inline Capping Machine</ui-accordion-trigger>
          <ui-accordion-content>
            <div class="flex gap-4">
              <div class="h-24 w-24 shrink-0 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                Image
              </div>
              <div>
                <p class="font-medium mb-1">IL-2000 Series</p>
                <p class="text-muted-foreground text-sm">
                  Versatile inline capper for screw caps, snap caps, and press-on closures. Compact footprint for tight production lines.
                </p>
              </div>
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger>Cap Sorter & Feeder</ui-accordion-trigger>
          <ui-accordion-content>
            <div class="flex gap-4">
              <div class="h-24 w-24 shrink-0 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                Image
              </div>
              <div>
                <p class="font-medium mb-1">CS-800 Series</p>
                <p class="text-muted-foreground text-sm">
                  Centrifugal cap sorter with orientation detection. Compatible with all Lazar capping machines.
                </p>
              </div>
            </div>
          </ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── Animated Line ───────────────────────────────────────────────────────────

export const AnimatedLine: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1" class="group border-b-0 relative">
          <ui-accordion-trigger class="bg-transparent hover:bg-transparent">Design</ui-accordion-trigger>
          <ui-accordion-content>
            Our design team creates intuitive interfaces that delight users and drive engagement.
          </ui-accordion-content>
          <div class="absolute bottom-0 left-0 h-0.5 w-full bg-border">
            <div class="h-full bg-primary transition-all duration-300 group-data-[state=open]:w-full w-0"></div>
          </div>
        </ui-accordion-item>
        <ui-accordion-item value="2" class="group border-b-0 relative">
          <ui-accordion-trigger class="bg-transparent hover:bg-transparent">Development</ui-accordion-trigger>
          <ui-accordion-content>
            Full-stack development with modern frameworks, microservices, and cloud-native architecture.
          </ui-accordion-content>
          <div class="absolute bottom-0 left-0 h-0.5 w-full bg-border">
            <div class="h-full bg-primary transition-all duration-300 group-data-[state=open]:w-full w-0"></div>
          </div>
        </ui-accordion-item>
        <ui-accordion-item value="3" class="group border-b-0 relative">
          <ui-accordion-trigger class="bg-transparent hover:bg-transparent">Deployment</ui-accordion-trigger>
          <ui-accordion-content>
            Automated CI/CD pipelines, blue-green deployments, and 99.99% uptime SLA.
          </ui-accordion-content>
          <div class="absolute bottom-0 left-0 h-0.5 w-full bg-border">
            <div class="h-full bg-primary transition-all duration-300 group-data-[state=open]:w-full w-0"></div>
          </div>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};

// ── All Variants × Sizes Grid ───────────────────────────────────────────────

export const VariantsAndSizes: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="grid grid-cols-1 gap-10 p-6">
        <div *ngFor="let v of variants">
          <h3 class="mb-4 text-base font-semibold capitalize">{{ v }} variant</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let s of sizes">
              <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ s }}</p>
              <ui-accordion type="single" [variant]="v" [size]="s" [collapsible]="true" class="w-full">
                <ui-accordion-item value="1">
                  <ui-accordion-trigger>First item</ui-accordion-trigger>
                  <ui-accordion-content>Content for first item.</ui-accordion-content>
                </ui-accordion-item>
                <ui-accordion-item value="2">
                  <ui-accordion-trigger>Second item</ui-accordion-trigger>
                  <ui-accordion-content>Content for second item.</ui-accordion-content>
                </ui-accordion-item>
              </ui-accordion>
            </div>
          </div>
        </div>
      </div>
    `,
    props: {
      variants: ['default', 'card', 'filled', 'bordered', 'separated'],
      sizes: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
  }),
};

// ── Plus Icon ───────────────────────────────────────────────────────────────

export const PlusIcon: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-accordion type="single" variant="card" [collapsible]="true" class="w-full max-w-lg">
        <ui-accordion-item value="1">
          <ui-accordion-trigger icon="plus">Expandable section one</ui-accordion-trigger>
          <ui-accordion-content>The plus icon rotates 45° to form an × when the section is open.</ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="2">
          <ui-accordion-trigger icon="plus">Expandable section two</ui-accordion-trigger>
          <ui-accordion-content>Content for the second section.</ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item value="3">
          <ui-accordion-trigger icon="plus">Expandable section three</ui-accordion-trigger>
          <ui-accordion-content>Content for the third section.</ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
    `,
  }),
};
