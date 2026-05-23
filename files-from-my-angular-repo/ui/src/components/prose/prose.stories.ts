// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ProseComponent } from './prose.component';

const meta: Meta<ProseComponent> = {
  title: 'Display/Prose',
  component: ProseComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<ProseComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProseComponent] },
    template: `
      <div class="flex flex-col gap-8 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">sm</p>
          <ui-prose size="sm">
            <h2>Small Prose</h2>
            <p>Compact typography for dense UI surfaces, sidebars, and secondary content areas.</p>
          </ui-prose>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">default</p>
          <ui-prose size="default">
            <h2>Default Prose</h2>
            <p>Standard typography for main content areas, articles, and documentation.</p>
          </ui-prose>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">lg</p>
          <ui-prose size="lg">
            <h2>Large Prose</h2>
            <p>Larger typography for marketing pages, landing pages, and featured content.</p>
          </ui-prose>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [ProseComponent] },
    props: args,
    template: `
      <ui-prose [size]="size">
        <h1>Lazar Technologies</h1>
        <p>
          Founded in 1987, Lazar Technologies is a world leader in precision bottle capping machinery.
          Our equipment is trusted by manufacturers across the beverage, pharmaceutical, and personal care industries.
        </p>
        <h2>Our Products</h2>
        <p>We manufacture a comprehensive range of capping solutions:</p>
        <ul>
          <li>Rotary chuck cappers for high-speed lines</li>
          <li>Inline spindle cappers for continuous production</li>
          <li>Snap-on cappers for press-fit closures</li>
        </ul>
        <h3>Quality Assurance</h3>
        <p>
          Every machine undergoes <strong>rigorous testing</strong> before delivery.
          Our torque verification systems ensure <em>consistent closure integrity</em>.
        </p>
        <blockquote>
          Precision is not optional — it is the foundation of every closure we apply.
        </blockquote>
      </ui-prose>
    `,
  }),
  args: { size: 'default' },
};

// ── With Code ─────────────────────────────────────────────────────────────────

export const WithCode: Story = {
  render: () => ({
    moduleMetadata: { imports: [ProseComponent] },
    template: `
      <ui-prose>
        <h2>Configuration Example</h2>
        <p>Set the machine parameters using the API:</p>
        <pre><code>const config = {{ '{' }}
  torque: 12.5,
  speed: 300,
  mode: 'continuous',
{{ '}' }};</code></pre>
        <p>
          Inline code is also supported: use <code>machine.start()</code> to begin the capping cycle,
          and <code>machine.stop()</code> to end it safely.
        </p>
      </ui-prose>
    `,
  }),
};
