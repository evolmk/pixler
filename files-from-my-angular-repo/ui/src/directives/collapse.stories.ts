// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { CollapseDirective } from './collapse.directive';
import { ButtonComponent } from '../components/button/button.component';

const meta: Meta = {
  title: 'Directives/Collapse',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [CollapseDirective, ButtonComponent] },
    props: {
      isOpen: true,
      toggle: function () {
        this['isOpen'] = !this['isOpen'];
      },
    },
    template: `
      <div class="space-y-3 max-w-sm">
        <ui-button variant="outline" size="sm" (click)="toggle()">
          {{ isOpen ? 'Collapse' : 'Expand' }}
        </ui-button>
        <div [uiCollapse]="isOpen" class="rounded-lg border border-border p-4">
          <p class="text-sm text-muted-foreground">
            This content collapses smoothly with a height + opacity transition.
            The directive animates from full height to zero when <code>uiCollapse</code> is false.
          </p>
        </div>
      </div>
    `,
  }),
};

// ── Multiple Sections ─────────────────────────────────────────────────────────

export const MultipleSections: Story = {
  render: () => ({
    moduleMetadata: { imports: [CollapseDirective, ButtonComponent] },
    props: {
      section1: true,
      section2: false,
      section3: false,
    },
    template: `
      <div class="max-w-sm space-y-2">
        <div class="rounded-lg border border-border overflow-hidden">
          <button
            class="flex w-full items-center justify-between p-3 text-sm font-medium"
            (click)="section1 = !section1"
          >
            <span>Technical Specs</span>
            <span>{{ section1 ? '−' : '+' }}</span>
          </button>
          <div [uiCollapse]="section1">
            <div class="border-t border-border px-3 pb-3 pt-2 text-sm text-muted-foreground">
              Capacity: 300 CPM. Torque: 5–50 N·cm. Weight: 850kg.
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-border overflow-hidden">
          <button
            class="flex w-full items-center justify-between p-3 text-sm font-medium"
            (click)="section2 = !section2"
          >
            <span>Shipping Info</span>
            <span>{{ section2 ? '−' : '+' }}</span>
          </button>
          <div [uiCollapse]="section2">
            <div class="border-t border-border px-3 pb-3 pt-2 text-sm text-muted-foreground">
              Lead time: 8–12 weeks. Ships from our facility in Germany.
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-border overflow-hidden">
          <button
            class="flex w-full items-center justify-between p-3 text-sm font-medium"
            (click)="section3 = !section3"
          >
            <span>Warranty</span>
            <span>{{ section3 ? '−' : '+' }}</span>
          </button>
          <div [uiCollapse]="section3">
            <div class="border-t border-border px-3 pb-3 pt-2 text-sm text-muted-foreground">
              2-year parts and labor warranty. Extended service plans available.
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
