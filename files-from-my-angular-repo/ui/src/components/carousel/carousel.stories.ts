// @ts-nocheck
// Sprint 6 — comprehensive stories for all carousel variants and modes.
import { Meta, StoryObj } from '@storybook/angular';
import { placeholderImage } from '../../utils/placeholder';
import { CarouselComponent, CarouselContentComponent, CarouselItemComponent } from './carousel.component';
import {
  CarouselPrevComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
  CarouselCounterComponent,
} from './carousel-nav.component';
import { CarouselProgressComponent } from './carousel-progress.component';
import { CarouselThumbsComponent, CarouselThumbItemComponent } from './carousel-thumbs.component';
import { ThumbsGalleryComponent } from './carousel-thumbs-gallery.component';
import { LightboxGalleryDirective, LightboxItemDirective } from '../lightbox/index';

const meta: Meta<CarouselComponent> = {
  title: 'Components/Carousel',
  component: CarouselComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<CarouselComponent>;

const ALL_IMPORTS = [
  CarouselComponent,
  CarouselContentComponent,
  LightboxGalleryDirective,
  LightboxItemDirective,
  CarouselItemComponent,
  CarouselPrevComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
  CarouselCounterComponent,
  CarouselProgressComponent,
  CarouselThumbsComponent,
  CarouselThumbItemComponent,
  ThumbsGalleryComponent,
];

// Placeholder slides — `slide(w, h, n)` returns a placehold.co URL with a deterministic
// color from the palette so each lock value gets a visually distinct image.
const SLIDE_PALETTE = ['16A34A', '3b82f6', '8b5cf6', 'f59e0b', 'ef4444', '0ea5e9', 'd946ef', '14b8a6'];
const slide = (w: number, h: number, n: number): string =>
  placeholderImage({
    width: w,
    height: h,
    bg: SLIDE_PALETTE[(n - 1) % SLIDE_PALETTE.length],
    fg: 'ffffff',
    text: `Slide ${n}`,
  });

// ── All Variants ───────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Controls: Button (default)</p>
          <ui-carousel controls="button" class="w-full max-w-lg">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 1)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 2)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 3)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Controls: Dot</p>
          <ui-carousel controls="dot" class="w-full max-w-lg">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 4)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 5)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 6)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Controls: Button + Dot + Counter (manual composition)</p>
          <ui-carousel [loop]="true" controls="none" class="w-full max-w-lg">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 1)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 2)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 3)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 4)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-prev />
            <ui-carousel-next />
            <ui-carousel-counter />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autoplay + Progress Ring (3s, stop on hover)</p>
          <ui-carousel [loop]="true" [autoplay]="true" [autoplayDelay]="3000" [autoplayStopOnMouseEnter]="true" controls="button dot" class="w-full max-w-lg">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 5)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 6)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 7)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-progress size="md" />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Fade transition</p>
          <!-- h-48 required: Embla Fade plugin uses position:absolute on slides, collapsing viewport height -->
          <ui-carousel [loop]="true" transition="fade" controls="button dot" class="w-full max-w-lg h-48">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 8)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 9)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 10)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Multi-slide: 2-up</p>
          <ui-carousel align="start" controls="button" class="w-full max-w-xl">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5]; track n) {
                <ui-carousel-item class="basis-1/2">
                  <img [src]="slide(400, 300, n)" [alt]="'Slide ' + n" class="w-full h-40 object-cover rounded-lg"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Nav button variants</p>
          <div class="grid grid-cols-2 gap-4">
            @for (combo of [
              {v:'default',s:'circle'}, {v:'dark',s:'circle'},
              {v:'light',s:'circle'}, {v:'ghost',s:'circle'}
            ]; track combo.v) {
              <div>
                <p class="mb-1 text-[11px] text-muted-foreground">{{combo.v}} / {{combo.s}}</p>
                <ui-carousel [navVariant]="combo.v" [navShape]="combo.s" controls="button" class="w-full">
                  <ui-carousel-content>
                    <ui-carousel-item><img src="${slide(400, 200, 1)}" alt="s1" class="w-full h-32 object-cover rounded-lg"/></ui-carousel-item>
                    <ui-carousel-item><img src="${slide(400, 200, 2)}" alt="s2" class="w-full h-32 object-cover rounded-lg"/></ui-carousel-item>
                    <ui-carousel-item><img src="${slide(400, 200, 3)}" alt="s3" class="w-full h-32 object-cover rounded-lg"/></ui-carousel-item>
                  </ui-carousel-content>
                </ui-carousel>
              </div>
            }
          </div>
        </div>

      </div>
    `,
  }),
};

// ── Nav Button Variants ────────────────────────────────────────────────────────

export const NavButtonVariants: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-8 p-[50px]">

        <div>
          <p class="mb-4 text-sm font-semibold text-foreground">Variant × Shape — all combinations</p>
          <div class="grid grid-cols-3 gap-4">
            @for (combo of [
              {v:'default',s:'circle',label:'default / circle'},
              {v:'default',s:'rounded',label:'default / rounded'},
              {v:'default',s:'square',label:'default / square'},
              {v:'dark',s:'circle',label:'dark / circle'},
              {v:'dark',s:'rounded',label:'dark / rounded'},
              {v:'dark',s:'square',label:'dark / square'},
              {v:'light',s:'circle',label:'light / circle'},
              {v:'light',s:'rounded',label:'light / rounded'},
              {v:'light',s:'square',label:'light / square'},
              {v:'ghost',s:'circle',label:'ghost / circle'},
              {v:'ghost',s:'rounded',label:'ghost / rounded'},
              {v:'ghost',s:'square',label:'ghost / square'}
            ]; track combo.label) {
              <div>
                <p class="mb-1 text-[11px] text-muted-foreground uppercase tracking-wide">{{combo.label}}</p>
                <ui-carousel [navVariant]="combo.v" [navShape]="combo.s" controls="button" class="w-full">
                  <ui-carousel-content>
                    <ui-carousel-item><img src="${slide(400, 240, 1)}" alt="s1" class="w-full h-28 object-cover rounded-lg"/></ui-carousel-item>
                    <ui-carousel-item><img src="${slide(400, 240, 2)}" alt="s2" class="w-full h-28 object-cover rounded-lg"/></ui-carousel-item>
                    <ui-carousel-item><img src="${slide(400, 240, 3)}" alt="s3" class="w-full h-28 object-cover rounded-lg"/></ui-carousel-item>
                  </ui-carousel-content>
                </ui-carousel>
              </div>
            }
          </div>
        </div>

        <div>
          <p class="mb-4 text-sm font-semibold text-foreground">Thumbnail strip arrow variants — all 4</p>
          <div class="grid grid-cols-2 gap-6">
            @for (combo of [
              {v:'default',s:'circle',label:'default / circle'},
              {v:'dark',s:'circle',label:'dark / circle'},
              {v:'light',s:'rounded',label:'light / rounded'},
              {v:'ghost',s:'circle',label:'ghost / circle'}
            ]; track combo.label) {
              <div>
                <p class="mb-1 text-[11px] text-muted-foreground uppercase tracking-wide">{{combo.label}}</p>
                <ui-carousel [loop]="true" controls="none" class="w-full">
                  <ui-carousel-content>
                    @for (n of [1,2,3,4]; track n) {
                      <ui-carousel-item><img [src]="slide(400, 200, n)" [alt]="'s' + n" class="w-full h-28 object-cover rounded-lg"/></ui-carousel-item>
                    }
                  </ui-carousel-content>
                  <ui-carousel-thumbs type="scrollable" thumbSize="sm" [arrows]="true" [arrowVariant]="combo.v" [arrowShape]="combo.s" class="mt-2">
                    @for (n of [1,2,3,4]; track n; let i = $index) {
                      <ui-carousel-thumb-item [index]="i"><img [src]="slide(120, 96, n)" [alt]="'t' + n"/></ui-carousel-thumb-item>
                    }
                  </ui-carousel-thumbs>
                </ui-carousel>
              </div>
            }
          </div>
        </div>

      </div>
    `,
  }),
};

// ── Thumbs Only (standalone — no image viewport) ──────────────────────────────
// Use ui-thumbs-gallery as the state provider instead of ui-carousel.
// No Embla, no placeholder slides — just [count] + (selectionChange).

export const ThumbsOnly: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-12 p-[50px]">

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Modern strip — 8 images</p>
          <p class="mb-4 text-xs text-muted-foreground">
            ui-thumbs-gallery replaces ui-carousel — no viewport, no boilerplate.
            Wire (selectionChange) to open a lightbox (coming soon).
          </p>
          <ui-thumbs-gallery #g1 [count]="8" [loop]="true" class="w-full max-w-2xl mx-auto">
            <ui-carousel-thumbs type="modern" thumbSize="md" [arrows]="true">
              @for (n of [1,2,3,4,5,6,7,8]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 160, n)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
          <div class="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Selected: image {{ g1.selectedIndex() + 1 }} of 8</span>
            <span class="text-muted-foreground/40">—</span>
            <span class="italic text-muted-foreground/60">lightbox will open here</span>
          </div>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Scrollable strip — 12 images, large thumbs, dark arrows</p>
          <p class="mb-4 text-xs text-muted-foreground">Swipe or use arrows to browse; strip auto-scrolls to active thumb</p>
          <ui-thumbs-gallery #g2 [count]="12" [loop]="true" class="w-full max-w-3xl mx-auto">
            <ui-carousel-thumbs type="scrollable" thumbSize="lg" [arrows]="true" arrowVariant="dark">
              @for (n of [1,2,3,4,5,6,7,8,9,10,11,12]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 160, n)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
          <p class="mt-3 text-center text-sm text-muted-foreground">Selected: {{ g2.selectedIndex() + 1 }} of 12</p>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Scrollable strip — ghost arrows</p>
          <p class="mb-4 text-xs text-muted-foreground">arrowVariant="ghost" — just the chevron, no background panel</p>
          <ui-thumbs-gallery [count]="8" [loop]="true" class="w-full max-w-2xl mx-auto">
            <ui-carousel-thumbs type="scrollable" thumbSize="md" [arrows]="true" arrowVariant="ghost">
              @for (n of [1,2,3,4,5,6,7,8]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 160, n + 5)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Classic strip — 4 images, no arrows</p>
          <ui-thumbs-gallery #g3 [count]="4" [loop]="true" class="w-full max-w-sm mx-auto">
            <ui-carousel-thumbs type="classic" thumbSize="md">
              @for (n of [1,2,3,4]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 160, n + 10)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
          <p class="mt-3 text-center text-sm text-muted-foreground">Selected: {{ g3.selectedIndex() + 1 }} of 4</p>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Square thumbs — [square]="true"</p>
          <p class="mb-4 text-xs text-muted-foreground">Images cropped to fill the square; height mirrors width from thumbSize</p>
          <ui-thumbs-gallery [count]="6" [loop]="true" class="w-full max-w-2xl mx-auto">
            <ui-carousel-thumbs type="classic" thumbSize="md" [square]="true" [arrows]="true">
              @for (n of [1,2,3,4,5,6]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 200, n + 20)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom height — [thumbHeightPx]="56" (panoramic)</p>
          <ui-thumbs-gallery [count]="6" [loop]="true" class="w-full max-w-2xl mx-auto">
            <ui-carousel-thumbs type="classic" thumbSize="md" [thumbHeightPx]="56" [arrows]="true">
              @for (n of [1,2,3,4,5,6]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i">
                  <img [src]="slide(200, 160, n + 30)" [alt]="'Image ' + n"/>
                </ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-thumbs-gallery>
        </div>

      </div>
    `,
  }),
};

// ── Basic ──────────────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px]">
        <ui-carousel controls="button" class="w-full max-w-lg mx-auto">
          <ui-carousel-content>
            <ui-carousel-item><img src="${slide(800, 400, 1)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 2)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 3)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
          </ui-carousel-content>
        </ui-carousel>
      </div>
    `,
  }),
};

// ── Loop ──────────────────────────────────────────────────────────────────────

export const Loop: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px]">
        <p class="mb-4 text-sm text-muted-foreground text-center">loop=true — wraps from last back to first</p>
        <ui-carousel [loop]="true" controls="button dot" class="w-full max-w-lg mx-auto">
          <ui-carousel-content>
            <ui-carousel-item><img src="${slide(800, 400, 4)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 5)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 6)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 7)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
          </ui-carousel-content>
        </ui-carousel>
      </div>
    `,
  }),
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px] flex justify-center">
        <div>
          <p class="mb-4 text-sm text-muted-foreground text-center">orientation="vertical" — explicit height required; viewport fills it via h-full</p>
          <!-- h-72 on carousel → viewport inherits h-full → items use basis-full for full-height slides -->
          <ui-carousel orientation="vertical" controls="button dot" [loop]="true" class="h-72 w-80">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(400, 600, 1)}" alt="Slide 1" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 2)}" alt="Slide 2" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 3)}" alt="Slide 3" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 4)}" alt="Slide 4" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};

// ── Vertical + Thumbs: arrows on slide ───────────────────────────────────────

export const VerticalSlideWithThumbs: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px] flex justify-center">
        <div>
          <p class="mb-1 text-sm text-muted-foreground text-center font-medium">Vertical + thumbs — arrows on slide (controls="button")</p>
          <p class="mb-4 text-xs text-muted-foreground text-center">Up/down arrows are scoped to the slide area; thumb strip sits cleanly below</p>
          <ui-carousel orientation="vertical" [loop]="true" controls="button" class="h-64 w-80">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(400, 600, 1)}" alt="Slide 1" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 2)}" alt="Slide 2" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 3)}" alt="Slide 3" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 4)}" alt="Slide 4" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="classic" thumbSize="sm" class="mt-2">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(120, 96, 1)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(120, 96, 2)}" alt="Thumb 2"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="2"><img src="${slide(120, 96, 3)}" alt="Thumb 3"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="3"><img src="${slide(120, 96, 4)}" alt="Thumb 4"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};

// ── Vertical + Thumbs: arrows in strip ───────────────────────────────────────

export const VerticalStripWithThumbs: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px] flex justify-center">
        <div>
          <p class="mb-1 text-sm text-muted-foreground text-center font-medium">Vertical + thumbs — arrows in strip (controls="none" + thumbs [arrows]="true")</p>
          <p class="mb-4 text-xs text-muted-foreground text-center">Slide area is clean; prev/next live at the ends of the thumbnail strip</p>
          <ui-carousel orientation="vertical" [loop]="true" controls="none" class="h-64 w-80">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(400, 600, 5)}" alt="Slide 1" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 6)}" alt="Slide 2" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 7)}" alt="Slide 3" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(400, 600, 8)}" alt="Slide 4" class="w-full h-full object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="classic" thumbSize="sm" [arrows]="true" class="mt-2">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(120, 96, 5)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(120, 96, 6)}" alt="Thumb 2"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="2"><img src="${slide(120, 96, 7)}" alt="Thumb 3"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="3"><img src="${slide(120, 96, 8)}" alt="Thumb 4"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};

// ── Dots & Counter Variants ───────────────────────────────────────────────────

export const DotsAndCounter: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dots — dark (default, for light backgrounds)</p>
          <ui-carousel controls="dot" [loop]="true" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dots — light (for dark/image backgrounds)</p>
          <ui-carousel controls="dot" dotsVariant="light" [loop]="true" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              @for (n of [5,6,7,8]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Counter — dark (default) bottom-right</p>
          <ui-carousel controls="button" [loop]="true" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-counter />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Counter — light, on image</p>
          <ui-carousel controls="button" [loop]="true" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              @for (n of [5,6,7,8]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-counter variant="light" />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dots + counter + autoplay progress — all overlays at once</p>
          <ui-carousel controls="dot" dotsVariant="light" [loop]="true" [autoplay]="true" [autoplayDelay]="3000" [autoplayStopOnMouseEnter]="true" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              @for (n of [9,10,11,12]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-progress size="md" />
            <ui-carousel-counter variant="light" />
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Autoplay ──────────────────────────────────────────────────────────────────

export const Autoplay: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autoplay — 5s delay, countdown size=sm</p>
          <ui-carousel [loop]="true" [autoplay]="true" [autoplayDelay]="5000" controls="dot" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 11)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 12)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 13)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-progress size="sm" />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autoplay — 4s delay, countdown size=md, hover to pause</p>
          <ui-carousel [loop]="true" [autoplay]="true" [autoplayDelay]="4000" controls="button dot" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 14)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 15)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 16)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 17)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-progress size="md" />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autoplay — 3s delay, countdown size=lg, no controls</p>
          <ui-carousel [loop]="true" [autoplay]="true" [autoplayDelay]="3000" controls="none" class="w-full max-w-lg mx-auto">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 18)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 19)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 20)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-progress size="lg" />
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Auto Scroll ───────────────────────────────────────────────────────────────

export const AutoScroll: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Auto Scroll — continuous forward (speed=2, drag continues scroll)</p>
          <ui-carousel [loop]="true" [autoScroll]="true" [autoScrollSpeed]="2" [autoScrollStopOnInteraction]="false" controls="none" class="w-full max-w-xl mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6]; track n) {
                <ui-carousel-item class="basis-1/3">
                  <img [src]="slide(400, 300, n)" [alt]="'Slide ' + n" class="w-full h-32 object-cover rounded-lg mx-1"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Auto Scroll — reverse (speed=3, drag continues scroll)</p>
          <ui-carousel [loop]="true" [autoScroll]="true" [autoScrollSpeed]="3" autoScrollDirection="backward" [autoScrollStopOnInteraction]="false" controls="none" class="w-full max-w-xl mx-auto">
            <ui-carousel-content>
              @for (n of [7,8,9,10,11,12]; track n) {
                <ui-carousel-item class="basis-1/3">
                  <img [src]="slide(400, 300, n)" [alt]="'Slide ' + n" class="w-full h-32 object-cover rounded-lg mx-1"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Multi Slide ───────────────────────────────────────────────────────────────

export const MultiSlide: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">2-up (basis-1/2) — slide 1 at a time</p>
          <ui-carousel #c2up="uiCarousel" align="start" controls="button" class="w-full max-w-xl mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6]; track n) {
                <ui-carousel-item class="basis-1/2">
                  <img [src]="slide(400, 300, n)" [alt]="'Slide ' + n" class="w-full h-40 object-cover rounded-lg"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
          <p class="text-center text-sm text-muted-foreground mt-2 tabular-nums">{{ c2up.selectedIndex() + 1 }} / {{ c2up.scrollSnaps().length }}</p>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">3-up (basis-1/3) — slide 1 at a time</p>
          <ui-carousel #c3up="uiCarousel" align="start" controls="button" class="w-full max-w-2xl mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6,7]; track n) {
                <ui-carousel-item class="basis-1/3">
                  <img [src]="slide(400, 300, n)" [alt]="'Slide ' + n" class="w-full h-40 object-cover rounded-lg"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
          <p class="text-center text-sm text-muted-foreground mt-2 tabular-nums">{{ c3up.selectedIndex() + 1 }} / {{ c3up.scrollSnaps().length }}</p>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">3-up — scroll 3 at a time (slidesToScroll=3)</p>
          <ui-carousel #c3s="uiCarousel" align="start" [slidesToScroll]="3" controls="button" class="w-full max-w-2xl mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6,7,8,9]; track n) {
                <ui-carousel-item class="basis-1/3">
                  <img [src]="slide(400, 300, n + 10)" [alt]="'Slide ' + n" class="w-full h-40 object-cover rounded-lg"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
          <p class="text-center text-sm text-muted-foreground mt-2 tabular-nums">{{ c3s.selectedIndex() + 1 }} / {{ c3s.scrollSnaps().length }}</p>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">dragFree=true (free scrolling, no snap)</p>
          <ui-carousel align="start" [dragFree]="true" controls="none" class="w-full max-w-xl mx-auto">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6]; track n) {
                <ui-carousel-item class="basis-1/3">
                  <img [src]="slide(400, 300, n + 20)" [alt]="'Slide ' + n" class="w-full h-32 object-cover rounded-lg"/>
                </ui-carousel-item>
              }
            </ui-carousel-content>
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Fade Transition ───────────────────────────────────────────────────────────

export const FadeTransition: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Fade (opacity crossfade between slides)</p>
          <!-- h-48 required: Embla Fade plugin uses position:absolute on slides, collapsing viewport height -->
          <ui-carousel [loop]="true" transition="fade" controls="button dot" class="w-full max-w-lg mx-auto h-48">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 21)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 22)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 23)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 24)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Autoplay + Fade</p>
          <ui-carousel [loop]="true" transition="fade" [autoplay]="true" [autoplayDelay]="2000" [autoplayStopOnMouseEnter]="true" controls="dot" class="w-full max-w-lg mx-auto h-48">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 25)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 26)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 27)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-progress size="sm" />
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Thumbnails ────────────────────────────────────────────────────────────────

export const Thumbnails: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-12 p-[50px] max-w-xl">

        <!-- ── Arrow position 1: buttons on the slide area ────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Modern thumbs — arrows on slide</p>
          <p class="mb-3 text-xs text-muted-foreground">controls="button" — built-in arrows are scoped to the slide viewport, not the full carousel height</p>
          <ui-carousel [loop]="true" controls="button" class="w-full">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 1)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 2)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 3)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 4)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="modern" thumbSize="md" class="mt-2">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(200, 160, 1)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(200, 160, 2)}" alt="Thumb 2"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="2"><img src="${slide(200, 160, 3)}" alt="Thumb 3"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="3"><img src="${slide(200, 160, 4)}" alt="Thumb 4"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── Arrow position 2: arrows inside the thumbnail strip ──────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Classic thumbs — arrows in strip</p>
          <p class="mb-3 text-xs text-muted-foreground">controls="none" + thumbs [arrows]="true" — prev/next live at the strip ends, not on the slide</p>
          <ui-carousel [loop]="true" controls="none" class="w-full">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 5)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 6)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 7)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 8)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="classic" thumbSize="sm" [arrows]="true" class="mt-2">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(120, 96, 5)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(120, 96, 6)}" alt="Thumb 2"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="2"><img src="${slide(120, 96, 7)}" alt="Thumb 3"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="3"><img src="${slide(120, 96, 8)}" alt="Thumb 4"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Scrollable thumbs — arrows in strip (8 slides)</p>
          <p class="mb-3 text-xs text-muted-foreground">Strip auto-scrolls to active thumb; swipe the strip to browse</p>
          <ui-carousel [loop]="true" controls="none" class="w-full">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6,7,8]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-thumbs type="scrollable" thumbSize="sm" [arrows]="true" class="mt-2">
              @for (n of [1,2,3,4,5,6,7,8]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i"><img [src]="slide(120, 96, n)" [alt]="'Thumb ' + n"/></ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── 2-image edge case ─────────────────────────────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">2 images — modern thumbs</p>
          <p class="mb-3 text-xs text-muted-foreground">Edge case: only 2 slides with modern clip thumb</p>
          <ui-carousel [loop]="true" controls="button" class="w-full">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 400, 1)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 400, 2)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="modern" thumbSize="md" class="mt-2">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(200, 160, 1)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(200, 160, 2)}" alt="Thumb 2"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── 10-image scrollable ──────────────────────────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">10 images — scrollable thumbs (dark arrow variant)</p>
          <p class="mb-3 text-xs text-muted-foreground">Strip auto-scrolls; swipe the strip; dark circle arrows</p>
          <ui-carousel [loop]="true" controls="button" navVariant="dark" class="w-full">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-thumbs type="scrollable" thumbSize="sm" [arrows]="true" arrowVariant="dark" class="mt-2">
              @for (n of [1,2,3,4,5,6,7,8,9,10]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i"><img [src]="slide(120, 96, n)" [alt]="'Thumb ' + n"/></ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── Arrow variants on strip ──────────────────────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Classic thumbs — light / rounded arrows</p>
          <ui-carousel [loop]="true" controls="none" class="w-full">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5,6]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n + 20)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-thumbs type="classic" thumbSize="sm" [arrows]="true" arrowVariant="light" arrowShape="rounded" class="mt-2">
              @for (n of [1,2,3,4,5,6]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i"><img [src]="slide(120, 96, n + 20)" [alt]="'Thumb ' + n"/></ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── Square thumbs ─────────────────────────────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Square thumbs — [square]="true" (images cropped)</p>
          <ui-carousel [loop]="true" controls="button" class="w-full">
            <ui-carousel-content>
              @for (n of [1,2,3,4,5]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-thumbs type="classic" thumbSize="md" [square]="true" class="mt-2">
              @for (n of [1,2,3,4,5]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i"><img [src]="slide(200, 200, n)" [alt]="'Thumb ' + n"/></ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

        <!-- ── Custom height ──────────────────────────────────────────── -->

        <div>
          <p class="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom height — [thumbHeightPx]="48" (panoramic crop)</p>
          <ui-carousel [loop]="true" controls="none" class="w-full">
            <ui-carousel-content>
              @for (n of [5,6,7,8]; track n) {
                <ui-carousel-item><img [src]="slide(800, 400, n)" [alt]="'Slide ' + n" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
              }
            </ui-carousel-content>
            <ui-carousel-thumbs type="scrollable" thumbSize="md" [thumbHeightPx]="48" [arrows]="true" class="mt-2">
              @for (n of [5,6,7,8]; track n; let i = $index) {
                <ui-carousel-thumb-item [index]="i"><img [src]="slide(200, 160, n)" [alt]="'Thumb ' + n"/></ui-carousel-thumb-item>
              }
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Product Gallery ───────────────────────────────────────────────────────────

export const ProductGallery: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px] flex justify-center">
        <div class="w-full max-w-xl rounded-xl overflow-hidden border border-border">
          <p class="py-3 text-sm text-muted-foreground text-center border-b border-border">Product gallery — main image + modern thumbs below</p>
          <ui-carousel [loop]="true" controls="button" class="w-full">
            <ui-carousel-content>
              <ui-carousel-item><img src="${slide(800, 500, 30)}" alt="Product view 1" class="w-full h-80 object-cover"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 500, 31)}" alt="Product view 2" class="w-full h-80 object-cover"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 500, 32)}" alt="Product view 3" class="w-full h-80 object-cover"/></ui-carousel-item>
              <ui-carousel-item><img src="${slide(800, 500, 33)}" alt="Product view 4" class="w-full h-80 object-cover"/></ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-thumbs type="modern" thumbSize="lg" [clipWidth]="52" class="mt-3 px-4 pb-4">
              <ui-carousel-thumb-item [index]="0"><img src="${slide(200, 160, 30)}" alt="Thumb 1"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="1"><img src="${slide(200, 160, 31)}" alt="Thumb 2"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="2"><img src="${slide(200, 160, 32)}" alt="Thumb 3"/></ui-carousel-thumb-item>
              <ui-carousel-thumb-item [index]="3"><img src="${slide(200, 160, 33)}" alt="Thumb 4"/></ui-carousel-thumb-item>
            </ui-carousel-thumbs>
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};

// ── Wheel Gestures ────────────────────────────────────────────────────────────

export const WheelGestures: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px]">
        <p class="mb-4 text-sm text-muted-foreground text-center">wheelGestures=true — use mouse scroll wheel to navigate</p>
        <ui-carousel [wheelGestures]="true" [loop]="true" controls="button dot" class="w-full max-w-lg mx-auto">
          <ui-carousel-content>
            <ui-carousel-item><img src="${slide(800, 400, 40)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 41)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 42)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 43)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
          </ui-carousel-content>
        </ui-carousel>
      </div>
    `,
  }),
};

// ── Headless / API Access ─────────────────────────────────────────────────────

export const HeadlessApiAccess: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px] flex flex-col gap-6">
        <p class="text-sm text-muted-foreground text-center">controls="none" — consumer builds own UI via template var or emblaInited output</p>
        <ui-carousel #myCarousel="uiCarousel" controls="none" [loop]="true" class="w-full max-w-lg mx-auto">
          <ui-carousel-content>
            <ui-carousel-item><img src="${slide(800, 400, 50)}" alt="Slide 1" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 51)}" alt="Slide 2" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 52)}" alt="Slide 3" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
            <ui-carousel-item><img src="${slide(800, 400, 53)}" alt="Slide 4" class="w-full h-48 object-cover rounded-lg"/></ui-carousel-item>
          </ui-carousel-content>
        </ui-carousel>
        <div class="flex items-center justify-center gap-3">
          <button class="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" (click)="myCarousel.prev()">← Prev</button>
          <span class="text-sm text-muted-foreground tabular-nums">
            Slide {{ myCarousel.selectedIndex() + 1 }} of {{ myCarousel.slideCount() }}
          </span>
          <button class="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm" (click)="myCarousel.next()">Next →</button>
        </div>
      </div>
    `,
  }),
};

// ── Responsive Breakpoints ────────────────────────────────────────────────────

export const Responsive: Story = {
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="p-[50px]">
        <p class="mb-4 text-sm text-muted-foreground text-center">Resize viewport — 1 slide on mobile, 2 on tablet+</p>
        <ui-carousel
          align="start"
          [slidesToScroll]="1"
          [breakpoints]="{ '(min-width: 640px)': { slidesToScroll: 2 } }"
          controls="button dot"
          class="w-full max-w-xl mx-auto"
        >
          <ui-carousel-content>
            @for (n of [1,2,3,4,5,6]; track n) {
              <ui-carousel-item class="sm:basis-1/2">
                <img [src]="slide(400, 300, n + 60)" [alt]="'Slide ' + n" class="w-full h-40 object-cover rounded-lg"/>
              </ui-carousel-item>
            }
          </ui-carousel-content>
        </ui-carousel>
      </div>
    `,
  }),
};

// ── Carousel + Lightbox Integration ────────────────────────────────────────────────────────────────

export const WithLightbox: Story = {
  name: 'Carousel + Lightbox',
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col gap-10 p-[50px]">

        <div>
          <p class="mb-1 text-sm font-medium">Multi-slide gallery — click any slide to open full-screen lightbox</p>
          <p class="mb-3 text-xs text-muted-foreground">Attach <code>[lbGallery]</code> to <code>ui-carousel-content</code>, <code>[lbItem]</code> to each image. Carousel navigates; click opens lightbox.</p>
          <ui-carousel [loop]="true" controls="button" class="w-full max-w-2xl">
            <ui-carousel-content
              [lbGallery]
              [options]="{ loop: true, showThumbs: true, thumbPosition: 'bottom', showCaption: true, openFrom: 'origin' }"
            >
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 101)}" thumb="${slide(200, 140, 101)}" alt="Product 1" caption="CX-200 Front View" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 102)}" thumb="${slide(200, 140, 102)}" alt="Product 2" caption="CX-200 Side View" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 103)}" thumb="${slide(200, 140, 103)}" alt="Product 3" caption="CX-200 Rear View" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 104)}" thumb="${slide(200, 140, 104)}" alt="Product 4" caption="CX-200 Detail" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 105)}" thumb="${slide(200, 140, 105)}" alt="Product 5" caption="CX-200 Controls" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
              <ui-carousel-item class="basis-1/2 md:basis-1/3">
                <img lbItem src="${slide(1200, 800, 106)}" thumb="${slide(200, 140, 106)}" alt="Product 6" caption="CX-200 In Action" class="w-full h-48 object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition-opacity" />
              </ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-prev />
            <ui-carousel-next />
            <ui-carousel-dots />
          </ui-carousel>
        </div>

        <div>
          <p class="mb-1 text-sm font-medium">Hero carousel — single slide, click to zoom</p>
          <p class="mb-3 text-xs text-muted-foreground">Full-width hero banner. Clicking the image opens the lightbox at the current slide index.</p>
          <ui-carousel [loop]="true" controls="dot" class="w-full max-w-2xl">
            <ui-carousel-content
              [lbGallery]
              [options]="{ loop: true, toolbarRight: ['zoom-in', 'zoom-out', 'fullscreen', 'close'], openFrom: 'origin' }"
            >
              <ui-carousel-item>
                <img lbItem src="${slide(1200, 600, 111)}" thumb="${slide(200, 100, 111)}" alt="Hero 1" caption="Model CX-200 — full line view" class="w-full h-64 object-cover rounded-xl cursor-zoom-in" />
              </ui-carousel-item>
              <ui-carousel-item>
                <img lbItem src="${slide(1200, 600, 112)}" thumb="${slide(200, 100, 112)}" alt="Hero 2" caption="Conveyor integration" class="w-full h-64 object-cover rounded-xl cursor-zoom-in" />
              </ui-carousel-item>
              <ui-carousel-item>
                <img lbItem src="${slide(1200, 600, 113)}" thumb="${slide(200, 100, 113)}" alt="Hero 3" caption="Installation complete" class="w-full h-64 object-cover rounded-xl cursor-zoom-in" />
              </ui-carousel-item>
            </ui-carousel-content>
            <ui-carousel-dots />
          </ui-carousel>
        </div>

      </div>
    `,
  }),
};

// ── Mobile peek (1 + ½) ────────────────────────────────────────────────────────
// Half-slide on the right hints horizontal swipe. align="start" pins the active
// slide to the left edge so the peek always sits on the right; basis-2/3 leaves
// ~33% of viewport for the next slide. Wrapped in a 390px frame to simulate a
// phone viewport.

export const MobilePeek: Story = {
  name: 'Mobile (1 + ½ peek)',
  render: () => ({
    props: { slide },
    moduleMetadata: { imports: ALL_IMPORTS },
    template: `
      <div class="flex flex-col items-center gap-3 p-6">
        <div class="text-center">
          <p class="eyebrow text-muted-foreground">Mobile · 390px</p>
          <p class="mt-1 text-sm text-muted-foreground">Half-slide on the right hints horizontal swipe.</p>
        </div>

        <div class="w-[390px] rounded-3xl border border-border bg-card p-3 shadow-sm">
          <ui-carousel align="start" controls="none" class="w-full">
            <ui-carousel-content>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 1)}" alt="Slide 1" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 2)}" alt="Slide 2" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 3)}" alt="Slide 3" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 4)}" alt="Slide 4" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 5)}" alt="Slide 5" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
              <ui-carousel-item class="basis-2/3">
                <img src="${slide(800, 600, 6)}" alt="Slide 6" class="w-full h-44 object-cover rounded-lg"/>
              </ui-carousel-item>
            </ui-carousel-content>
          </ui-carousel>
        </div>
      </div>
    `,
  }),
};
