// @ts-nocheck
// Sprint 10 — comprehensive Storybook stories for ui-lightbox.
import { Component, inject } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage } from '../../utils/placeholder';
import { LightboxComponent, LightboxGalleryDirective, LightboxItemDirective, LightboxService } from './index';
import { CarouselComponent, CarouselContentComponent, CarouselItemComponent } from '../carousel/carousel.component';
import {
  CarouselPrevComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
} from '../carousel/carousel-nav.component';

// ─── Sample data ──────────────────────────────────────────────────────────────

const PALETTE = ['16A34A', '3b82f6', '8b5cf6', 'f59e0b', 'ef4444', '0ea5e9', 'd946ef', '14b8a6'];
const lbSrc = (text: string, idx: number) =>
  placeholderImage({ width: 1200, ratio: '3:2', bg: PALETTE[idx % PALETTE.length], fg: 'ffffff', text });
const lbThumb = (text: string, idx: number) =>
  placeholderImage({ width: 200, ratio: '3:2', bg: PALETTE[idx % PALETTE.length], fg: 'ffffff', text });

const IMAGES = [
  {
    src: lbSrc('Mountain vista', 0),
    thumb: lbThumb('Mountain', 0),
    alt: 'Mountain vista',
    caption: 'Mountain vista at dusk',
  },
  {
    src: lbSrc('Forest path', 1),
    thumb: lbThumb('Forest', 1),
    alt: 'Forest path',
    caption: 'Morning light through the forest',
  },
  {
    src: lbSrc('Ocean waves', 2),
    thumb: lbThumb('Ocean', 2),
    alt: 'Ocean waves',
    caption: 'Waves on a calm evening',
  },
  {
    src: lbSrc('City skyline', 3),
    thumb: lbThumb('City', 3),
    alt: 'City skyline',
    caption: 'City lights after sunset',
  },
  {
    src: lbSrc('Desert dunes', 4),
    thumb: lbThumb('Desert', 4),
    alt: 'Desert dunes',
    caption: 'Golden sands at noon',
  },
  {
    src: lbSrc('Snowy peak', 5),
    thumb: lbThumb('Snow', 5),
    alt: 'Snowy peak',
    caption: 'First snow of the season',
  },
  {
    src: lbSrc('Waterfall', 6),
    thumb: lbThumb('Waterfall', 6),
    alt: 'Waterfall',
    caption: 'Cascade in the valley',
  },
  {
    src: lbSrc('Sunrise', 7),
    thumb: lbThumb('Sunrise', 7),
    alt: 'Sunrise',
    caption: 'Golden hour at the lake',
  },
];

const VIDEO_ITEMS = [
  {
    src: lbSrc('Mountain', 0),
    thumb: lbThumb('Mountain', 0),
    alt: 'Mountain',
    caption: 'Photo 1',
  },
  {
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    alt: 'YouTube video',
    type: 'youtube',
    caption: 'YouTube clip',
  },
  {
    src: lbSrc('Ocean', 2),
    thumb: lbThumb('Ocean', 2),
    alt: 'Ocean',
    caption: 'Photo 3',
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumb: lbThumb('Video poster', 4),
    alt: 'Video clip',
    type: 'video',
    poster: lbSrc('Video poster', 4),
    caption: 'Sample MP4 video',
  },
];

// Machinery-style images with hotspot pins
const MACHINERY_ITEMS = [
  {
    src: lbSrc('Machine front', 0),
    thumb: lbThumb('Machine front', 0),
    alt: 'Capping machine front view',
    caption: 'Model CX-200 — front assembly',
    pins: [
      {
        id: 'motor',
        x: 28,
        y: 55,
        label: 'Drive Motor',
        content: '<strong>Drive Motor</strong><br>3-phase, 2.2kW, IP54',
      },
      {
        id: 'chuck',
        x: 52,
        y: 42,
        label: 'Capping Chuck',
        content: '<strong>Capping Chuck</strong><br>Adjustable torque 0–15 Nm',
      },
      {
        id: 'sensor',
        x: 72,
        y: 30,
        label: 'Presence Sensor',
        content: '<strong>Presence Sensor</strong><br>Inductive, NPN, 8mm range',
      },
      { id: 'hmi', x: 80, y: 70, label: 'HMI Panel', content: '<strong>HMI Panel</strong><br>7" touch screen, IP65' },
    ],
  },
  {
    src: lbSrc('Conveyor belt', 1),
    thumb: lbThumb('Conveyor', 1),
    alt: 'Conveyor belt section',
    caption: 'Conveyor drive section',
    pins: [
      {
        id: 'belt',
        x: 35,
        y: 60,
        label: 'Drive Belt',
        content: '<strong>Drive Belt</strong><br>Polyurethane, width 100mm',
      },
      {
        id: 'tensioner',
        x: 65,
        y: 40,
        label: 'Tensioner',
        content: '<strong>Tensioner</strong><br>Spring-loaded, auto-adjust',
      },
    ],
  },
];

// ─── Demo components (service / inline / carousel) ────────────────────────────

@Component({
  selector: 'lb-programmatic-demo',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4 p-6">
      <p class="text-sm text-muted-foreground">Click a button to open the lightbox at a specific slide:</p>
      <div class="flex flex-wrap gap-3">
        @for (item of items; track item; let i = $index) {
          <button
            (click)="openAt(i, $event)"
            class="relative h-20 w-28 overflow-hidden rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img [src]="item.thumb" [alt]="item.alt" class="h-full w-full object-cover" />
            <span
              class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity"
              >Open {{ i + 1 }}</span
            >
          </button>
        }
      </div>
      <p class="text-xs text-muted-foreground">Opened: {{ lastIndex !== null ? 'Index ' + lastIndex : 'none' }}</p>
    </div>
  `,
})
class ProgrammaticDemoComponent {
  private readonly _lb = inject(LightboxService);
  items = IMAGES;
  lastIndex: number | null = null;

  openAt(index: number, _event: MouseEvent): void {
    const ref = this._lb.open(this.items, {
      startIndex: index,
      loop: true,
      showThumbs: true,
      thumbPosition: 'bottom',
    });
    void ref.afterClosed$.then((i) => (this.lastIndex = i));
  }
}

@Component({
  selector: 'lb-inline-demo',
  standalone: true,
  imports: [LightboxComponent],
  template: `
    <div class="p-6">
      <p class="mb-4 text-sm text-muted-foreground">Inline (embedded) mode — lightbox renders in-page, no overlay.</p>
      <div class="relative h-[480px] w-full overflow-hidden rounded-xl border bg-black">
        <ui-lightbox
          #lb
          [items]="items"
          [inline]="true"
          [showThumbs]="true"
          thumbPosition="bottom"
          thumbType="modern"
          [loop]="true"
          [toolbarRight]="['zoom-in', 'zoom-out', 'fullscreen', 'rotate-cw', 'close']"
          [showCounter]="true"
        />
      </div>
      <div class="mt-3 flex gap-2">
        @for (item of items; track item; let i = $index) {
          <button
            (click)="lb.open(i)"
            class="h-12 w-16 overflow-hidden rounded border cursor-pointer hover:ring-2 hover:ring-ring"
          >
            <img [src]="item.thumb" [alt]="item.alt" class="h-full w-full object-cover" />
          </button>
        }
      </div>
    </div>
  `,
})
class InlineDemoComponent {
  items = IMAGES.slice(0, 5);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Lightbox',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ─── 1. Size Variants ────────────────────────────────────────────────────────

@Component({
  selector: 'lb-size-demo',
  standalone: true,
  template: `
    <div class="flex flex-col gap-6 p-6">
      <p class="text-sm text-muted-foreground">
        Open the lightbox at different sizes. Non-fullscreen sizes render as centered, constrained overlays. Click
        backdrop or X to close.
      </p>
      <div class="flex flex-wrap gap-3">
        @for (size of sizes; track size) {
          <button
            (click)="openSize(size)"
            class="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-accent cursor-pointer"
          >
            {{ size }}
          </button>
        }
      </div>
    </div>
  `,
})
class SizeDemoComponent {
  private readonly _lb = inject(LightboxService);
  readonly sizes = ['sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'fullscreen'] as const;
  readonly items = IMAGES.slice(0, 4);

  openSize(size: (typeof this.sizes)[number]): void {
    this._lb.open(this.items, {
      size,
      loop: true,
      showCounter: true,
      showThumbs: size !== 'sm',
      openFrom: 'center',
    });
  }
}

export const SizeVariants: Story = {
  name: '1. Size Variants',
  render: () => ({
    moduleMetadata: { imports: [SizeDemoComponent] },
    template: `<lb-size-demo />`,
  }),
};

// ─── 2. Basic Gallery ─────────────────────────────────────────────────────────

export const BasicGallery: Story = {
  name: 'Basic Gallery',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES },
    template: `
      <div class="p-6">
        <p class="mb-4 text-sm text-muted-foreground">Click any image to open the lightbox. Loop enabled, counter shown.</p>
        <div
          [lbGallery]
          [options]="{ loop: true, showCounter: true, thumbPosition: 'bottom', openFrom: 'origin' }"
          class="grid grid-cols-4 gap-3"
        >
          @for (img of images; track img.src) {
            <img
              lbItem
              [src]="img.src"
              [thumb]="img.thumb"
              [alt]="img.alt"
              [caption]="img.caption"
              class="h-28 w-full rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
            />
          }
        </div>
      </div>
    `,
  }),
};

// ─── 2. Thumbnail Strip ───────────────────────────────────────────────────────

export const ThumbnailStrip: Story = {
  name: 'Thumbnail Strip',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES },
    template: `
      <div class="flex flex-col gap-10 p-6">

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Modern thumbs — bottom (default)</p>
          <div [lbGallery] [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom', thumbType: 'modern' }" class="flex flex-wrap gap-2">
            @for (img of images; track img.src) {
              <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-20 w-28 rounded object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Classic thumbs — bottom</p>
          <div [lbGallery] [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom', thumbType: 'classic' }" class="flex flex-wrap gap-2">
            @for (img of images; track img.src) {
              <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-20 w-28 rounded object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Modern thumbs — left side</p>
          <div [lbGallery] [options]="{ loop: true, showThumbs: true, thumbPosition: 'left', thumbType: 'modern', thumbSize: 'sm' }" class="flex flex-wrap gap-2">
            @for (img of images; track img.src) {
              <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-20 w-28 rounded object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Modern thumbs — top-right corner</p>
          <div [lbGallery] [options]="{ loop: true, showThumbs: true, thumbPosition: 'top-right', thumbType: 'modern', thumbSize: 'sm' }" class="flex flex-wrap gap-2">
            @for (img of images; track img.src) {
              <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-20 w-28 rounded object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

      </div>
    `,
  }),
};

// ─── 3. Video Gallery ─────────────────────────────────────────────────────────

export const VideoGallery: Story = {
  name: 'Video Gallery',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { items: VIDEO_ITEMS },
    template: `
      <div class="p-6">
        <p class="mb-4 text-sm text-muted-foreground">Mix of images, YouTube embed, and HTML5 video. Click any item to open.</p>
        <div
          [lbGallery]
          [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom' }"
          class="grid grid-cols-4 gap-3"
        >
          @for (item of items; track item.src) {
            <div class="relative h-28 w-full overflow-hidden rounded-lg cursor-zoom-in group">
              <img
                lbItem
                [src]="item.src"
                [thumb]="item.thumb"
                [alt]="item.alt"
                [caption]="item.caption"
                [type]="item.type"
                class="h-full w-full object-cover group-hover:opacity-90 transition-opacity"
              />
              @if (item.type === 'youtube' || item.type === 'video') {
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    `,
  }),
};

// ─── 4. Zoom, Rotate & Flip ───────────────────────────────────────────────────

export const ZoomRotateFlip: Story = {
  name: 'Zoom, Rotate & Flip',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES.slice(0, 4) },
    template: `
      <div class="p-6">
        <p class="mb-2 text-sm text-muted-foreground">Full transform toolbar: zoom in/out/reset, rotate CW/CCW, flip X/Y, download.</p>
        <p class="mb-4 text-xs text-muted-foreground">Double-click image to zoom. Scroll wheel zooms. Drag to pan when zoomed.</p>
        <div
          [lbGallery]
          [options]="{
            loop: true,
            showThumbs: true,
            thumbPosition: 'bottom',
            showDownload: true,
            toolbarLeft: ['counter'],
            toolbarCenter: [],
            toolbarRight: ['zoom-in', 'zoom-out', 'zoom-reset', 'rotate-cw', 'rotate-ccw', 'flip-x', 'flip-y', 'download', 'fullscreen', 'close']
          }"
          class="grid grid-cols-4 gap-3"
        >
          @for (img of images; track img.src) {
            <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-28 w-full rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
          }
        </div>
      </div>
    `,
  }),
};

// ─── 5. Hotspot Pins ──────────────────────────────────────────────────────────

export const HotspotPins: Story = {
  name: 'Hotspot Pins',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { items: MACHINERY_ITEMS },
    template: `
      <div class="flex flex-col gap-10 p-6">

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dot pins (default) — click pin to reveal tooltip</p>
          <div [lbGallery] [options]="{ loop: false, showThumbs: true, showPins: true, pinsToggle: true, pinStyle: 'dot', toolbarRight: ['pins-toggle', 'zoom-in', 'zoom-out', 'fullscreen', 'close'] }" class="flex gap-3">
            @for (item of items; track item.src) {
              <img lbItem [src]="item.src" [thumb]="item.thumb" [alt]="item.alt" [caption]="item.caption" [pins]="item.pins" class="h-32 w-48 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Numbered pins — pair with an external legend</p>
          <div [lbGallery] [options]="{ loop: false, showPins: true, pinsToggle: true, pinStyle: 'numbered', toolbarRight: ['pins-toggle', 'zoom-in', 'zoom-out', 'close'] }" class="flex gap-3">
            @for (item of items; track item.src) {
              <img lbItem [src]="item.src" [thumb]="item.thumb" [alt]="item.alt" [caption]="item.caption" [pins]="item.pins" class="h-32 w-48 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
          <div class="mt-3 flex flex-col gap-1">
            @for (pin of items[0].pins; track pin.id; let i = $index) {
              <p class="text-xs text-muted-foreground"><span class="font-medium text-foreground">{{ i + 1 }}.</span> {{ pin.label }}</p>
            }
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Label pins — text label always visible</p>
          <div [lbGallery] [options]="{ loop: false, showPins: true, pinStyle: 'label', pinSize: 'md', toolbarRight: ['pins-toggle', 'zoom-in', 'zoom-out', 'close'] }" class="flex gap-3">
            @for (item of items; track item.src) {
              <img lbItem [src]="item.src" [thumb]="item.thumb" [alt]="item.alt" [caption]="item.caption" [pins]="item.pins" class="h-32 w-48 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
            }
          </div>
        </div>

      </div>
    `,
  }),
};

// ─── 6. Gallery Directive ─────────────────────────────────────────────────────

export const GalleryDirective: Story = {
  name: 'Gallery Directive ([lbGallery])',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES },
    template: `
      <div class="p-6">
        <p class="mb-1 text-sm font-medium">Declarative gallery with card grid</p>
        <p class="mb-4 text-xs text-muted-foreground">Attach <code>[lbGallery]</code> to any container, <code>[lbItem]</code> to any descendant image. No service injection needed.</p>
        <div
          [lbGallery]
          [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom', showCaption: true, openFrom: 'origin' }"
          class="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          @for (img of images; track img.src) {
            <div class="group overflow-hidden rounded-xl border bg-card cursor-zoom-in hover:shadow-md transition-shadow">
              <img
                lbItem
                [src]="img.src"
                [thumb]="img.thumb"
                [alt]="img.alt"
                [caption]="img.caption"
                class="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="px-3 py-2">
                <p class="truncate text-xs text-muted-foreground">{{ img.alt }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    `,
  }),
};

// ─── 7. Inline (Embedded) Mode ────────────────────────────────────────────────

export const InlineMode: Story = {
  name: 'Inline (Embedded) Mode',
  render: () => ({
    moduleMetadata: { imports: [InlineDemoComponent] },
    template: `<lb-inline-demo />`,
  }),
};

// ─── 8. Programmatic (LightboxService) ───────────────────────────────────────

export const Programmatic: Story = {
  name: 'Programmatic (LightboxService)',
  render: () => ({
    moduleMetadata: { imports: [ProgrammaticDemoComponent] },
    template: `<lb-programmatic-demo />`,
  }),
};

// ─── 9. Custom Toolbar ────────────────────────────────────────────────────────

export const ToolbarCustom: Story = {
  name: 'Custom Toolbar Layout',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES.slice(0, 5) },
    template: `
      <div class="p-6">
        <p class="mb-1 text-sm font-medium">Toolbar: counter center, share + thumbs-toggle left, download + fullscreen + close right</p>
        <p class="mb-4 text-xs text-muted-foreground">Fully configurable via <code>toolbarLeft</code>, <code>toolbarCenter</code>, <code>toolbarRight</code> inputs.</p>
        <div
          [lbGallery]
          [options]="{
            loop: true,
            showThumbs: true,
            thumbPosition: 'bottom',
            showShare: true,
            showDownload: true,
            shareNetworks: ['copy', 'twitter', 'facebook'],
            toolbarLeft: ['thumbs-toggle', 'share'],
            toolbarCenter: ['counter'],
            toolbarRight: ['download', 'fullscreen', 'close']
          }"
          class="flex flex-wrap gap-3"
        >
          @for (img of images; track img.src) {
            <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-28 w-40 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
          }
        </div>
      </div>
    `,
  }),
};

// ─── 10. Drag-to-Close + Idle Chrome ──────────────────────────────────────────

export const DragToCloseIdle: Story = {
  name: 'Drag-to-Close + Idle Mode',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES.slice(0, 4) },
    template: `
      <div class="p-6">
        <p class="mb-1 text-sm font-medium">Drag image down to close · toolbar fades after 2s idle</p>
        <p class="mb-4 text-xs text-muted-foreground"><code>[dragToClose]="true"</code> · <code>[idle]="2000"</code> · Move mouse to wake.</p>
        <div
          [lbGallery]
          [options]="{ loop: true, dragToClose: true, idle: 2000, showThumbs: false, openFrom: 'center' }"
          class="flex flex-wrap gap-3"
        >
          @for (img of images; track img.src) {
            <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-28 w-40 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity" />
          }
        </div>
      </div>
    `,
  }),
};

// ─── 11. Protected Images ─────────────────────────────────────────────────────

export const ProtectedImages: Story = {
  name: 'Protected Images',
  render: () => ({
    moduleMetadata: { imports: [LightboxGalleryDirective, LightboxItemDirective] },
    props: { images: IMAGES.slice(0, 4) },
    template: `
      <div class="p-6">
        <p class="mb-1 text-sm font-medium">Right-click disabled · drag to save disabled</p>
        <p class="mb-4 text-xs text-muted-foreground"><code>[protect]="true"</code> disables context menu and pointer-events on images.</p>
        <div
          [lbGallery]
          [options]="{ loop: true, protect: true, showThumbs: true }"
          class="flex flex-wrap gap-3"
        >
          @for (img of images; track img.src) {
            <img lbItem [src]="img.src" [thumb]="img.thumb" [alt]="img.alt" class="h-28 w-40 rounded-lg object-cover cursor-zoom-in hover:opacity-90 transition-opacity select-none" />
          }
        </div>
      </div>
    `,
  }),
};

// ─── 12. Carousel + Lightbox Integration ─────────────────────────────────────

export const CarouselWithLightbox: Story = {
  name: 'Carousel + Lightbox',
  render: () => ({
    moduleMetadata: {
      imports: [
        LightboxGalleryDirective,
        LightboxItemDirective,
        CarouselComponent,
        CarouselContentComponent,
        CarouselItemComponent,
        CarouselPrevComponent,
        CarouselNextComponent,
        CarouselDotsComponent,
      ],
    },
    props: { images: IMAGES },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-1 text-sm font-medium">Click any slide to open full-screen lightbox</p>
          <p class="mb-4 text-xs text-muted-foreground">
            Combine ui-carousel for browsing with ui-lightbox for full-screen zoom.
          </p>
          <ui-carousel [loop]="true" controls="button" class="w-full max-w-2xl">
            <ui-carousel-content [lbGallery] [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom' }">
              @for (img of images; track img) {
                <ui-carousel-item class="basis-1/2 md:basis-1/3">
                  <img
                    lbItem
                    [src]="img.src"
                    [thumb]="img.thumb"
                    [alt]="img.alt"
                    [caption]="img.caption"
                    class="w-full h-48 object-cover rounded-lg cursor-zoom-in"
                  />
                </ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-prev />
            <ui-carousel-next />
            <ui-carousel-dots />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-1 text-sm font-medium">Single-slide hero carousel with lightbox</p>
          <p class="mb-4 text-xs text-muted-foreground">Full-width hero — click the image to zoom.</p>
          <ui-carousel [loop]="true" controls="dot" class="w-full max-w-2xl">
            <ui-carousel-content [lbGallery] [options]="{ loop: true, openFrom: 'origin' }">
              @for (img of images.slice(0, 4); track img) {
                <ui-carousel-item>
                  <img
                    lbItem
                    [src]="img.src"
                    [thumb]="img.thumb"
                    [alt]="img.alt"
                    [caption]="img.caption"
                    class="w-full h-64 object-cover rounded-xl cursor-zoom-in"
                  />
                </ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-dots />
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};

// ─── Minimal Mode ────────────────────────────────────────────────────────────

export const MinimalMode: Story = {
  name: 'Minimal Mode',
  render: () => ({
    moduleMetadata: {
      imports: [LightboxGalleryDirective, LightboxItemDirective],
    },
    props: { images: IMAGES },
    template: `
      <div class="flex flex-wrap gap-3 p-6" [lbGallery] [options]="{ mode: 'minimal', loop: true }">
        @for (img of images; track img) {
          <img
            lbItem
            [src]="img.src"
            [thumb]="img.thumb"
            [alt]="img.alt"
            class="h-32 w-48 cursor-pointer rounded-lg object-cover transition-shadow hover:shadow-lg"
          />
        }
      </div>
    `,
  }),
};
