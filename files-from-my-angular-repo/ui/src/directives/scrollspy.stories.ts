// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ScrollspyDirective } from './scrollspy.directive';

const meta: Meta = {
  title: 'Directives/Scrollspy',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ScrollspyDirective] },
    props: {
      activeSection: '',
      onActiveSection: (_section: string) => {},
    },
    template: `
      <div class="flex gap-6">
        <!-- TOC Nav -->
        <div class="w-40 shrink-0">
          <p class="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wide">Contents</p>
          <nav class="flex flex-col gap-1.5 sticky top-4">
            <a href="#section-overview" class="text-sm text-muted-foreground hover:text-foreground transition-colors"
               [class.text-foreground]="activeSection === '#section-overview'"
               [class.font-medium]="activeSection === '#section-overview'">
              Overview
            </a>
            <a href="#section-specs" class="text-sm text-muted-foreground hover:text-foreground transition-colors"
               [class.text-foreground]="activeSection === '#section-specs'"
               [class.font-medium]="activeSection === '#section-specs'">
              Specifications
            </a>
            <a href="#section-usage" class="text-sm text-muted-foreground hover:text-foreground transition-colors"
               [class.text-foreground]="activeSection === '#section-usage'"
               [class.font-medium]="activeSection === '#section-usage'">
              Usage
            </a>
          </nav>
        </div>

        <!-- Scrollable content -->
        <div
          class="flex-1 h-64 overflow-y-auto space-y-8 pr-2"
          [uiScrollspy]="['#section-overview', '#section-specs', '#section-usage']"
          [offset]="20"
          (activeSection)="activeSection = $event"
        >
          <section id="section-overview" class="space-y-2">
            <h3 class="text-sm font-semibold">Overview</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              The LZR-2000 is our flagship rotary chuck capper, designed for high-speed production
              lines requiring consistent torque and minimal changeover time. Scroll down to read more.
            </p>
            <p class="text-sm text-muted-foreground leading-relaxed">
              With a production rate of up to 300 caps per minute, the LZR-2000 sets the standard
              for precision capping in the beverage industry.
            </p>
          </section>
          <section id="section-specs" class="space-y-2">
            <h3 class="text-sm font-semibold">Specifications</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Capacity: 300 CPM. Torque range: 5–50 N·cm. Cap diameter: 28–120mm.
              Power: 220V/50Hz, 3-phase. Weight: 850kg.
            </p>
          </section>
          <section id="section-usage" class="space-y-2">
            <h3 class="text-sm font-semibold">Usage</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Install inline with existing conveyor system. Requires 2m clearance on each side.
              Follow the quick-start guide included in the installation package.
            </p>
          </section>
        </div>
      </div>
    `,
  }),
};
