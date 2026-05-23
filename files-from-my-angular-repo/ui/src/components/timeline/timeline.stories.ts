// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  TimelineComponent,
  TimelineItemComponent,
  TimelineIconComponent,
  TimelineContentComponent,
} from './timeline.component';

const meta: Meta<TimelineComponent> = {
  title: 'Components/Timeline',
  component: TimelineComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TimelineComponent>;

const ALL_IMPORTS = [TimelineComponent, TimelineItemComponent, TimelineIconComponent, TimelineContentComponent];

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon color="primary"></ui-timeline-icon>
          <ui-timeline-content title="Order Placed" timestamp="Feb 28, 2026 · 9:00 AM">
            Order #ORD-1042 received from Heineken NL.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="default"></ui-timeline-icon>
          <ui-timeline-content title="In Production" timestamp="Feb 28, 2026 · 11:30 AM">
            LZR-3000 assigned to the production line.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="success"></ui-timeline-icon>
          <ui-timeline-content title="Quality Check Passed" timestamp="Mar 1, 2026 · 2:15 PM">
            All units passed torque and seal verification.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="default"></ui-timeline-icon>
          <ui-timeline-content title="Shipped" timestamp="Mar 2, 2026 · 8:00 AM">
            Dispatched via DHL Freight to Rotterdam.
          </ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};

// ── Status Colors ─────────────────────────────────────────────────────────────

export const StatusColors: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon color="default"></ui-timeline-icon>
          <ui-timeline-content title="Default">Neutral step.</ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="primary"></ui-timeline-icon>
          <ui-timeline-content title="Primary">Active or current step.</ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="success"></ui-timeline-icon>
          <ui-timeline-content title="Success">Completed successfully.</ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="warning"></ui-timeline-icon>
          <ui-timeline-content title="Warning">Needs attention.</ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="error"></ui-timeline-icon>
          <ui-timeline-content title="Error">Failed or blocked.</ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};

// ── Machine Order Flow ────────────────────────────────────────────────────────

export const MachineOrderFlow: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="max-w-sm">
        <h2 class="text-sm font-semibold mb-4">Order #ORD-1042 — LZR-3000 x2</h2>
        <ui-timeline>
          <ui-timeline-item>
            <ui-timeline-icon color="success"></ui-timeline-icon>
            <ui-timeline-content title="Order Confirmed" timestamp="Jan 15, 2026">
              Purchase order signed by Heineken NL procurement.
            </ui-timeline-content>
          </ui-timeline-item>
          <ui-timeline-item>
            <ui-timeline-icon color="success"></ui-timeline-icon>
            <ui-timeline-content title="Engineering Handoff" timestamp="Jan 20, 2026">
              BOM finalised and sent to manufacturing floor.
            </ui-timeline-content>
          </ui-timeline-item>
          <ui-timeline-item>
            <ui-timeline-icon color="primary"></ui-timeline-icon>
            <ui-timeline-content title="In Production" timestamp="Feb 1, 2026">
              Assembly in progress — estimated 6 weeks.
            </ui-timeline-content>
          </ui-timeline-item>
          <ui-timeline-item>
            <ui-timeline-icon color="default"></ui-timeline-icon>
            <ui-timeline-content title="FAT Testing">
              Factory acceptance test — pending.
            </ui-timeline-content>
          </ui-timeline-item>
          <ui-timeline-item>
            <ui-timeline-icon color="default"></ui-timeline-icon>
            <ui-timeline-content title="Delivery">
              Shipment to Zoeterwoude facility — pending.
            </ui-timeline-content>
          </ui-timeline-item>
        </ui-timeline>
      </div>
    `,
  }),
};

// ── With Warning ──────────────────────────────────────────────────────────────

export const WithWarningAndError: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon color="success"></ui-timeline-icon>
          <ui-timeline-content title="Scheduled Maintenance" timestamp="Mar 1, 2026">
            Maintenance window opened successfully.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="warning"></ui-timeline-icon>
          <ui-timeline-content title="Torque Sensor Alert" timestamp="Mar 1, 2026 · 14:22">
            Sensor reading 12% above threshold. Recalibration required.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="error"></ui-timeline-icon>
          <ui-timeline-content title="Line Stopped" timestamp="Mar 1, 2026 · 14:45">
            Production halted automatically. Technician dispatched.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon color="default"></ui-timeline-icon>
          <ui-timeline-content title="Investigation Pending">
            Root cause analysis in progress.
          </ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};

// ── Small Color Dots ─────────────────────────────────────────────────────────

export const SmallDots: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="success"></ui-timeline-icon>
          <ui-timeline-content title="Created &quot;Profile in React&quot; task" timestamp="just now">
            New feature branch created.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="primary"></ui-timeline-icon>
          <ui-timeline-content title="Release v4.2.0 quick bug fix" timestamp="2 hrs ago">
            Hotfix deployed to production.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="warning"></ui-timeline-icon>
          <ui-timeline-content title="Marked &quot;Install Charts&quot; completed" timestamp="5 hrs ago">
            Charts library integration done.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="default"></ui-timeline-icon>
          <ui-timeline-content title="Take a break" timestamp="just chill for now">
            Grab a coffee.
          </ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};

// ── Avatar Dots ──────────────────────────────────────────────────────────────

export const AvatarDots: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon variant="avatar">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Felix" />
          </ui-timeline-icon>
          <ui-timeline-content title="Felix assigned the task" timestamp="10 min ago">
            Assigned to the frontend team.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="avatar">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka" alt="Aneka" />
          </ui-timeline-icon>
          <ui-timeline-content title="Aneka left a comment" timestamp="25 min ago">
            &ldquo;Looks good, merging now.&rdquo;
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="avatar">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Leo" alt="Leo" />
          </ui-timeline-icon>
          <ui-timeline-content title="Leo opened a PR" timestamp="1 hr ago">
            Pull request #142 — add dashboard widgets.
          </ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};

// ── Mixed Sizes ──────────────────────────────────────────────────────────────

export const MixedSizes: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <ui-timeline>
        <ui-timeline-item>
          <ui-timeline-icon variant="ring" size="lg" color="primary"></ui-timeline-icon>
          <ui-timeline-content title="Major Release v5.0" timestamp="Mar 9, 2026">
            Full platform rebuild shipped to production.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="ring" size="default" color="success"></ui-timeline-icon>
          <ui-timeline-content title="Sprint Complete" timestamp="Mar 7, 2026">
            All 12 tasks completed on schedule.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="default"></ui-timeline-icon>
          <ui-timeline-content title="Daily standup" timestamp="Mar 6, 2026">
            No blockers reported.
          </ui-timeline-content>
        </ui-timeline-item>
        <ui-timeline-item>
          <ui-timeline-icon variant="dot" size="sm" color="default"></ui-timeline-icon>
          <ui-timeline-content title="Code review" timestamp="Mar 5, 2026">
            3 PRs merged.
          </ui-timeline-content>
        </ui-timeline-item>
      </ui-timeline>
    `,
  }),
};
