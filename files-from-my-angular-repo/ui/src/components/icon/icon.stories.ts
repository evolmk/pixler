// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { Camera, Heart, Settings, Star, Trash2, Plus, Search, Bell, Home, Mail } from 'lucide-angular';
import { IconComponent } from './icon.component';

const meta: Meta<IconComponent> = {
  title: 'Components/Icon',
  component: IconComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Renders SVG icons from the <strong><a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer">Lucide</a></strong> icon library.',
          'Import the icon you need directly from `lucide-angular` and pass it to the `[name]` input.',
          'Browse the full catalog of 1500+ icons at <strong><a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer">lucide.dev/icons</a></strong>.',
          '',
          '```typescript',
          "import { Camera, Heart } from 'lucide-angular';",
          '',
          '// template',
          '<ui-icon [name]="CameraIcon" size="lg" />',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'sm', 'default', 'lg', 'xl', 'xxl'],
    },
    strokeWidth: {
      control: { type: 'number', min: 0.5, max: 4, step: 0.5 },
    },
    absoluteStrokeWidth: {
      control: 'boolean',
    },
    mirror: {
      control: 'boolean',
    },
  },
};
export default meta;
type Story = StoryObj<IconComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Camera },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: xs (mini 12px)</p>
          <ui-icon [name]="Camera" size="mini" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: sm (16px)</p>
          <ui-icon [name]="Camera" size="sm" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: default (20px)</p>
          <ui-icon [name]="Camera" size="default" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: lg (24px)</p>
          <ui-icon [name]="Camera" size="lg" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: xl (32px)</p>
          <ui-icon [name]="Camera" size="xl" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Size: 2xl (48px)</p>
          <ui-icon [name]="Camera" size="xxl" />
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">iconKey (data-icon DevTools attr)</p>
          <p class="mb-3 text-xs text-muted-foreground">Inspect this element — <code>data-icon="Camera"</code> is visible in DevTools.</p>
          <ui-icon [name]="Camera" iconKey="Camera" size="lg" />
        </div>
      </div>
    `,
  }),
};

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { ...args, icon: Camera },
    template: `<ui-icon [name]="icon" [size]="size" [strokeWidth]="strokeWidth" [absoluteStrokeWidth]="absoluteStrokeWidth" />`,
  }),
  args: {
    size: 'default',
    strokeWidth: 2,
    absoluteStrokeWidth: false,
  },
};

// ── Numeric Size ─────────────────────────────────────────────────────────────

export const NumericSize: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Camera },
    template: `
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Camera" [size]="14" />
          <span class="text-xs text-muted-foreground">14px</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Camera" [size]="28" />
          <span class="text-xs text-muted-foreground">28px</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Camera" [size]="48" />
          <span class="text-xs text-muted-foreground">48px</span>
        </div>
      </div>
    `,
  }),
};

// ── Stroke Width ─────────────────────────────────────────────────────────────

export const StrokeWidths: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Heart },
    template: `
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" [strokeWidth]="0.5" />
          <span class="text-xs text-muted-foreground">0.5</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" [strokeWidth]="1" />
          <span class="text-xs text-muted-foreground">1</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" [strokeWidth]="1.5" />
          <span class="text-xs text-muted-foreground">1.5</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" [strokeWidth]="2" />
          <span class="text-xs text-muted-foreground">2 (default)</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" [strokeWidth]="3" />
          <span class="text-xs text-muted-foreground">3</span>
        </div>
      </div>
    `,
  }),
};

// ── Absolute Stroke Width ────────────────────────────────────────────────────

export const AbsoluteStrokeWidth: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Star },
    template: `
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium mb-2">Normal stroke (scales with size)</p>
          <div class="flex items-end gap-4">
            <ui-icon [name]="Star" size="sm" [strokeWidth]="2" />
            <ui-icon [name]="Star" size="default" [strokeWidth]="2" />
            <ui-icon [name]="Star" size="lg" [strokeWidth]="2" />
            <ui-icon [name]="Star" size="xl" [strokeWidth]="2" />
          </div>
        </div>
        <div>
          <p class="text-sm font-medium mb-2">Absolute stroke (constant thickness)</p>
          <div class="flex items-end gap-4">
            <ui-icon [name]="Star" size="sm" [strokeWidth]="2" [absoluteStrokeWidth]="true" />
            <ui-icon [name]="Star" size="default" [strokeWidth]="2" [absoluteStrokeWidth]="true" />
            <ui-icon [name]="Star" size="lg" [strokeWidth]="2" [absoluteStrokeWidth]="true" />
            <ui-icon [name]="Star" size="xl" [strokeWidth]="2" [absoluteStrokeWidth]="true" />
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Mirror (Horizontal Flip) ─────────────────────────────────────────────

export const Mirror: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Search, Home },
    template: `
      <div class="space-y-4">
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-1">
            <ui-icon [name]="Search" size="lg" />
            <span class="text-xs text-muted-foreground">Normal</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ui-icon [name]="Search" size="lg" [mirror]="true" />
            <span class="text-xs text-muted-foreground">Mirrored</span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-1">
            <ui-icon [name]="Home" size="lg" />
            <span class="text-xs text-muted-foreground">Normal</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ui-icon [name]="Home" size="lg" [mirror]="true" />
            <span class="text-xs text-muted-foreground">Mirrored</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Custom Color via Class ───────────────────────────────────────────────────

export const CustomColors: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Heart, Star, Trash2, Plus, Search },
    template: `
      <div class="flex items-center gap-4">
        <ui-icon [name]="Heart" size="lg" class="text-red-500" />
        <ui-icon [name]="Star" size="lg" class="text-yellow-500" />
        <ui-icon [name]="Plus" size="lg" class="text-green-500" />
        <ui-icon [name]="Search" size="lg" class="text-blue-500" />
        <ui-icon [name]="Trash2" size="lg" class="text-destructive" />
      </div>
    `,
  }),
};

// ── Default Color (light/dark) ───────────────────────────────────────────────

export const DefaultColor: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Settings, Bell, Home, Mail },
    template: `
      <div>
        <p class="text-sm text-muted-foreground mb-2">No class — defaults to #444 (light) / #ccc (dark)</p>
        <div class="flex items-center gap-4">
          <ui-icon [name]="Settings" size="lg" />
          <ui-icon [name]="Bell" size="lg" />
          <ui-icon [name]="Home" size="lg" />
          <ui-icon [name]="Mail" size="lg" />
        </div>
      </div>
    `,
  }),
};

// ── Icon Gallery ─────────────────────────────────────────────────────────────

export const IconGallery: Story = {
  render: () => ({
    moduleMetadata: { imports: [IconComponent] },
    props: { Camera, Heart, Settings, Star, Trash2, Plus, Search, Bell, Home, Mail },
    template: `
      <div class="grid grid-cols-5 gap-4">
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Camera" size="lg" />
          <span class="text-xs text-muted-foreground">Camera</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Heart" size="lg" />
          <span class="text-xs text-muted-foreground">Heart</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Settings" size="lg" />
          <span class="text-xs text-muted-foreground">Settings</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Star" size="lg" />
          <span class="text-xs text-muted-foreground">Star</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Trash2" size="lg" />
          <span class="text-xs text-muted-foreground">Trash2</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Plus" size="lg" />
          <span class="text-xs text-muted-foreground">Plus</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Search" size="lg" />
          <span class="text-xs text-muted-foreground">Search</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Bell" size="lg" />
          <span class="text-xs text-muted-foreground">Bell</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Home" size="lg" />
          <span class="text-xs text-muted-foreground">Home</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <ui-icon [name]="Mail" size="lg" />
          <span class="text-xs text-muted-foreground">Mail</span>
        </div>
      </div>
    `,
  }),
};
