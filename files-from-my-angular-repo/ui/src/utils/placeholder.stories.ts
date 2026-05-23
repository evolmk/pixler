// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage, PLACEHOLDER_DEFAULTS } from './placeholder';

/**
 * `placeholderImage(opts)` — generates `placehold.co` URLs for storybook demos,
 * empty-state images, and image preloaders. All options are optional.
 *
 * Defaults: 300x300, bg `#f4f4f4`, fg `#888888`, font `roboto`, ratio `1:1`.
 */
const meta: Meta = {
  title: 'Utilities/Placeholder Image',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const cardClass = 'flex flex-col gap-2 rounded-lg border border-border bg-transparent p-3 text-xs';

export const Default: Story = {
  name: 'Default (no args)',
  render: () => ({
    props: { url: placeholderImage() },
    template: `
      <div class="flex flex-col items-start gap-3 p-6">
        <p class="text-sm text-muted-foreground">
          <code>placeholderImage()</code> — uses every default
          (${PLACEHOLDER_DEFAULTS.width}x${PLACEHOLDER_DEFAULTS.width},
          bg <code>#${PLACEHOLDER_DEFAULTS.bg}</code>,
          fg <code>#${PLACEHOLDER_DEFAULTS.fg}</code>,
          font <code>${PLACEHOLDER_DEFAULTS.font}</code>).
        </p>
        <img [src]="url" alt="Placeholder" class="rounded-lg border border-border" />
        <code class="text-[11px] text-muted-foreground break-all max-w-md">{{ url }}</code>
      </div>
    `,
  }),
};

export const AspectRatios: Story = {
  name: 'Aspect Ratios',
  render: () => ({
    props: {
      cells: [
        { label: '1:1 (square)', url: placeholderImage({ width: 300, ratio: '1:1' }) },
        { label: '4:3 (standard)', url: placeholderImage({ width: 320, ratio: '4:3' }) },
        { label: '16:9 (widescreen)', url: placeholderImage({ width: 320, ratio: '16:9' }) },
        { label: '3:2 (photo)', url: placeholderImage({ width: 320, ratio: '3:2' }) },
      ],
    },
    template: `
      <div class="p-6">
        <p class="mb-4 text-sm text-muted-foreground">
          Pass <code>ratio</code> with a single dimension and the other side is computed:
          <code>placeholderImage({{ '{' }} width: 320, ratio: '16:9' {{ '}' }})</code>.
        </p>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (c of cells; track c.label) {
            <div class="${cardClass}">
              <p class="font-semibold">{{ c.label }}</p>
              <img [src]="c.url" [alt]="c.label" class="w-full rounded-md border border-border" />
            </div>
          }
        </div>
      </div>
    `,
  }),
};

export const SpecifyWidthOrHeight: Story = {
  name: 'Width OR Height + Ratio',
  render: () => ({
    props: {
      byWidth: placeholderImage({ width: 480, ratio: '4:3' }),
      byHeight: placeholderImage({ height: 240, ratio: '16:9' }),
      byBoth: placeholderImage({ width: 400, height: 200 }),
      byRatioOnly: placeholderImage({ ratio: '3:2' }),
    },
    template: `
      <div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <div class="${cardClass}">
          <p class="font-semibold">width: 480, ratio: '4:3' → 480x360</p>
          <img [src]="byWidth" alt="By width" class="rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">height: 240, ratio: '16:9' → 427x240</p>
          <img [src]="byHeight" alt="By height" class="rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">width: 400, height: 200 (ratio ignored)</p>
          <img [src]="byBoth" alt="By both" class="rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">ratio: '3:2' (default width 300) → 300x200</p>
          <img [src]="byRatioOnly" alt="Ratio only" class="rounded-md border border-border" />
        </div>
      </div>
    `,
  }),
};

export const Colors: Story = {
  name: 'Custom Colors',
  render: () => ({
    props: {
      cells: [
        { label: 'Default', url: placeholderImage({ width: 200 }) },
        { label: 'Brand blue', url: placeholderImage({ width: 200, bg: '3b82f6', fg: 'ffffff' }) },
        { label: 'Success', url: placeholderImage({ width: 200, bg: '16A34A', fg: 'ffffff' }) },
        { label: 'Warning', url: placeholderImage({ width: 200, bg: 'f59e0b', fg: 'ffffff' }) },
        { label: 'Error', url: placeholderImage({ width: 200, bg: 'ef4444', fg: 'ffffff' }) },
        { label: 'Dark', url: placeholderImage({ width: 200, bg: '1f2937', fg: 'f9fafb' }) },
      ],
    },
    template: `
      <div class="p-6">
        <p class="mb-4 text-sm text-muted-foreground">
          <code>bg</code> and <code>fg</code> accept hex (with or without <code>#</code>).
        </p>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          @for (c of cells; track c.label) {
            <div class="${cardClass}">
              <p class="font-semibold">{{ c.label }}</p>
              <img [src]="c.url" [alt]="c.label" class="w-full rounded-md border border-border" />
            </div>
          }
        </div>
      </div>
    `,
  }),
};

export const CustomText: Story = {
  name: 'Custom Text',
  render: () => ({
    props: {
      defaultText: placeholderImage({ width: 240, ratio: '4:3' }),
      customText: placeholderImage({ width: 240, ratio: '4:3', text: 'No image' }),
      productText: placeholderImage({ width: 240, ratio: '4:3', text: 'Product Image', bg: '0ea5e9', fg: 'ffffff' }),
    },
    template: `
      <div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        <div class="${cardClass}">
          <p class="font-semibold">No text → dimensions</p>
          <img [src]="defaultText" alt="default" class="rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">text: 'No image'</p>
          <img [src]="customText" alt="no image" class="rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">text + custom colors</p>
          <img [src]="productText" alt="product" class="rounded-md border border-border" />
        </div>
      </div>
    `,
  }),
};

export const Fonts: Story = {
  name: 'Font Options',
  render: () => ({
    props: {
      cells: (['roboto', 'montserrat', 'oswald', 'playfairdisplay', 'opensans', 'raleway'] as const).map((font) => ({
        font,
        url: placeholderImage({ width: 240, ratio: '4:3', font, text: font }),
      })),
    },
    template: `
      <div class="p-6">
        <p class="mb-4 text-sm text-muted-foreground">
          9 fonts available: roboto (default), lato, montserrat, opensans, oswald,
          playfairdisplay, ptsans, raleway, sourcesanspro.
        </p>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          @for (c of cells; track c.font) {
            <div class="${cardClass}">
              <p class="font-semibold">{{ c.font }}</p>
              <img [src]="c.url" [alt]="c.font" class="w-full rounded-md border border-border" />
            </div>
          }
        </div>
      </div>
    `,
  }),
};

export const FormatsAndRetina: Story = {
  name: 'Formats & Retina',
  render: () => ({
    props: {
      png: placeholderImage({ width: 200, format: 'png' }),
      jpg: placeholderImage({ width: 200, format: 'jpg' }),
      webp: placeholderImage({ width: 200, format: 'webp' }),
      svg: placeholderImage({ width: 200, format: 'svg' }),
      retina: placeholderImage({ width: 200, retina: true }),
    },
    template: `
      <div class="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5">
        <div class="${cardClass}">
          <p class="font-semibold">format: 'png'</p>
          <img [src]="png" alt="png" class="w-full rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">format: 'jpg'</p>
          <img [src]="jpg" alt="jpg" class="w-full rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">format: 'webp'</p>
          <img [src]="webp" alt="webp" class="w-full rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">format: 'svg'</p>
          <img [src]="svg" alt="svg" class="w-full rounded-md border border-border" />
        </div>
        <div class="${cardClass}">
          <p class="font-semibold">retina: true (@2x)</p>
          <img [src]="retina" alt="retina" class="w-full rounded-md border border-border" />
        </div>
      </div>
    `,
  }),
};

export const RealWorldUsage: Story = {
  name: 'Real-world Usage',
  render: () => ({
    props: {
      productCard: placeholderImage({ width: 320, ratio: '1:1', text: 'Product Image' }),
      heroBanner: placeholderImage({ width: 1200, ratio: '16:9', text: 'Hero Banner', bg: '1f2937', fg: 'f9fafb' }),
      videoThumb: placeholderImage({ width: 320, ratio: '16:9', text: 'Video Thumbnail', bg: '8b5cf6', fg: 'ffffff' }),
      avatar: placeholderImage({ width: 80, ratio: '1:1', text: 'JD' }),
      emptyState: placeholderImage({ width: 240, ratio: '4:3', text: 'No image yet' }),
    },
    template: `
      <div class="flex flex-col gap-8 p-6">

        <div>
          <p class="mb-2 text-sm font-semibold">Product card thumbnail (1:1)</p>
          <img [src]="productCard" alt="product" class="w-40 rounded-md border border-border" />
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Hero banner (16:9)</p>
          <img [src]="heroBanner" alt="hero" class="w-full max-w-2xl rounded-lg border border-border" />
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Video thumbnail (16:9)</p>
          <img [src]="videoThumb" alt="video" class="w-64 rounded-md border border-border" />
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Avatar (1:1)</p>
          <img [src]="avatar" alt="avatar" class="w-20 rounded-full border border-border" />
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Empty-state image (4:3)</p>
          <img [src]="emptyState" alt="empty" class="w-60 rounded-md border border-border" />
        </div>

      </div>
    `,
  }),
};
