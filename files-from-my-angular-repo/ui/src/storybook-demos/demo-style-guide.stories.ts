// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'style-guide-demo',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="p-8 max-w-[1200px] mx-auto space-y-12 text-foreground bg-background">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold mb-2">Style Guide</h1>
        <p class="text-muted-foreground">
          Tailwind CSS utility reference using the project's design tokens. All colors adapt to the active theme preset
          and light/dark mode.
        </p>
      </div>

      <!-- 1: Semantic Colors -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Semantic Colors</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Theme-aware tokens via CSS variables. Use
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">bg-&#123;token&#125;</code> /
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">text-&#123;token&#125;</code>.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          @for (c of semanticColors; track c.name) {
            <div class="rounded-lg border border-border overflow-hidden">
              <div class="h-16" [class]="c.bg"></div>
              <div class="px-3 py-2 bg-card">
                <p class="text-xs font-semibold">{{ c.name }}</p>
                <p class="text-[10px] text-muted-foreground font-mono">{{ c.class }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- 2: Brand & Status Colors -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Brand & Status Colors</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Lazar brand palette and fixed status colors (not theme-dependent).
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          @for (c of brandColors; track c.name) {
            <div class="rounded-lg border border-border overflow-hidden">
              <div class="h-16" [class]="c.bg"></div>
              <div class="px-3 py-2 bg-card">
                <p class="text-xs font-semibold">{{ c.name }}</p>
                <p class="text-[10px] text-muted-foreground font-mono">{{ c.class }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- 3: Text Colors -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Text Colors</h2>
        <p class="text-sm text-muted-foreground mb-4">Pair text tokens with background tokens for proper contrast.</p>
        <div class="space-y-2 rounded-lg border border-border p-4 bg-card">
          @for (t of textColors; track t.class) {
            <div class="flex items-baseline gap-4">
              <code class="text-[10px] font-mono text-muted-foreground w-44 shrink-0">{{ t.class }}</code>
              <span [class]="t.class + ' text-sm font-medium'">{{ t.label }}</span>
            </div>
          }
        </div>
      </section>

      <!-- 4: Typography Scale -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Typography Scale</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Tailwind's default type scale. Combine with
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">font-&#123;weight&#125;</code>.
        </p>
        <div class="space-y-3 rounded-lg border border-border p-4 bg-card">
          @for (t of typeSizes; track t.class) {
            <div class="flex items-baseline gap-4">
              <code class="text-[10px] font-mono text-muted-foreground w-20 shrink-0">{{ t.class }}</code>
              <span [class]="t.class + ' text-foreground'">{{ t.label }}</span>
            </div>
          }
        </div>

        <h3 class="text-base font-semibold mt-6 mb-3">Font Weights</h3>
        <div class="flex flex-wrap gap-4 rounded-lg border border-border p-4 bg-card">
          @for (w of fontWeights; track w.class) {
            <div class="text-center">
              <span [class]="'text-lg text-foreground ' + w.class">Aa</span>
              <p class="text-[10px] font-mono text-muted-foreground mt-1">{{ w.class }}</p>
            </div>
          }
        </div>
      </section>

      <!-- 5: Background + Text Combinations -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Background + Text Combos</h2>
        <p class="text-sm text-muted-foreground mb-4">Common pairings showing how tokens work together.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          @for (c of combos; track c.label) {
            <div [class]="'rounded-lg border border-border px-4 py-3 ' + c.bg">
              <p [class]="c.text + ' text-sm font-semibold'">{{ c.label }}</p>
              <p [class]="c.subtext + ' text-xs mt-0.5'">{{ c.bgClass }} + {{ c.textClass }}</p>
            </div>
          }
        </div>
      </section>

      <!-- 6: Borders & Radius -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Borders & Radius</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Border colors use
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">border-&#123;token&#125;</code>. Radius uses
          the <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">--radius</code> scale.
        </p>

        <h3 class="text-base font-semibold mb-3">Border Colors</h3>
        <div class="flex flex-wrap gap-3 mb-6">
          @for (b of borderColors; track b.label) {
            <div [class]="'w-24 h-16 rounded-lg border-2 bg-card flex items-end justify-center pb-1.5 ' + b.class">
              <span class="text-[10px] font-mono text-muted-foreground">{{ b.label }}</span>
            </div>
          }
        </div>

        <h3 class="text-base font-semibold mb-3">Border Radius</h3>
        <div class="flex flex-wrap gap-4">
          @for (r of radiusSizes; track r.class) {
            <div class="text-center">
              <div [class]="'w-16 h-16 bg-muted border border-border mx-auto ' + r.class"></div>
              <p class="text-[10px] font-mono text-muted-foreground mt-2">{{ r.class }}</p>
            </div>
          }
        </div>
      </section>

      <!-- 7: Hover & Interactive States -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Hover & Interactive States</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Hover over each block to see the effect. Uses Tailwind state modifiers
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">hover:</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">focus:</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">active:</code>.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          @for (h of hoverExamples; track h.label) {
            <div
              [class]="
                'rounded-lg border border-border p-4 bg-card transition-all duration-200 cursor-pointer ' + h.classes
              "
              tabindex="0"
            >
              <p class="text-sm font-semibold text-foreground">{{ h.label }}</p>
              <p class="text-[10px] font-mono text-muted-foreground mt-1">{{ h.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- 8: Opacity Variants -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Opacity Variants</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Append <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/&#123;n&#125;</code> to any color for
          opacity. Works with <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">bg-brand/10</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">text-foreground/50</code>, etc.
        </p>
        <div class="flex gap-2 items-end">
          @for (o of opacities; track o.value) {
            <div class="text-center">
              <div [class]="'w-12 h-12 rounded-md ' + o.bg"></div>
              <p class="text-[10px] font-mono text-muted-foreground mt-1">{{ o.value }}</p>
            </div>
          }
        </div>
        <p class="text-[10px] font-mono text-muted-foreground mt-2">bg-brand/&#123;opacity&#125;</p>
      </section>

      <!-- 9: Shadows -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Shadows</h2>
        <p class="text-sm text-muted-foreground mb-4">Tailwind shadow utilities.</p>
        <div class="flex flex-wrap gap-6">
          @for (s of shadows; track s.class) {
            <div class="text-center">
              <div [class]="'w-20 h-20 rounded-lg bg-card border border-border ' + s.class"></div>
              <p class="text-[10px] font-mono text-muted-foreground mt-2">{{ s.class }}</p>
            </div>
          }
        </div>
      </section>

      <!-- 10: Spacing Scale -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Spacing Scale</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Applies to
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">p-</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">m-</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">gap-</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">w-</code>,
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">h-</code>, etc.
        </p>
        <div class="space-y-1.5">
          @for (s of spacingSizes; track s.size) {
            <div class="flex items-center gap-3">
              <code class="text-[10px] font-mono text-muted-foreground w-10 text-right shrink-0">{{ s.size }}</code>
              <div class="h-3.5 bg-brand/60 rounded-sm" [style.width.px]="s.px"></div>
              <span class="text-[10px] text-muted-foreground">{{ s.px }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- 11: Component Comparison Blocks -->
      <section>
        <h2 class="text-xl font-semibold mb-1">Component Comparison</h2>
        <p class="text-sm text-muted-foreground mb-4">Same layout styled with different token combinations.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Neutral -->
          <div class="rounded-xl border border-border bg-card p-5 space-y-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
              >
                N
              </div>
              <div>
                <p class="text-sm font-semibold text-card-foreground">Neutral Card</p>
                <p class="text-xs text-muted-foreground">bg-card + border-border</p>
              </div>
            </div>
            <p class="text-sm text-muted-foreground">Uses default card and muted tokens. Subtle and non-intrusive.</p>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium"
                >Secondary</span
              >
              <span class="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground font-medium">Muted</span>
            </div>
          </div>

          <!-- Brand -->
          <div class="rounded-xl border border-brand/20 bg-brand/5 p-5 space-y-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center text-xs font-bold text-brand"
              >
                B
              </div>
              <div>
                <p class="text-sm font-semibold text-foreground">Brand Card</p>
                <p class="text-xs text-muted-foreground">bg-brand/5 + border-brand/20</p>
              </div>
            </div>
            <p class="text-sm text-muted-foreground">Uses brand color at low opacity for tinted backgrounds.</p>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-brand text-white font-medium">Brand</span>
              <span class="px-2.5 py-1 text-xs rounded-md bg-brand/15 text-brand font-medium">Brand/15</span>
            </div>
          </div>

          <!-- Error -->
          <div class="rounded-xl border border-status-error/20 bg-status-error/5 p-5 space-y-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-status-error/15 flex items-center justify-center text-xs font-bold text-status-error"
              >
                !
              </div>
              <div>
                <p class="text-sm font-semibold text-foreground">Error Card</p>
                <p class="text-xs text-muted-foreground">bg-status-error/5 + border</p>
              </div>
            </div>
            <p class="text-sm text-muted-foreground">Uses destructive/error tokens for alerts and warnings.</p>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 text-xs rounded-md bg-destructive text-destructive-foreground font-medium"
                >Destructive</span
              >
              <span class="px-2.5 py-1 text-xs rounded-md bg-status-error/15 text-status-error font-medium"
                >Error/15</span
              >
            </div>
          </div>
        </div>

        <!-- Primary vs Secondary vs Accent -->
        <h3 class="text-base font-semibold mt-6 mb-3">Primary vs Secondary vs Accent</h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-lg bg-primary p-4">
            <p class="text-sm font-semibold text-primary-foreground">Primary</p>
            <p class="text-xs text-primary-foreground/70">bg-primary + text-primary-foreground</p>
          </div>
          <div class="rounded-lg bg-secondary p-4">
            <p class="text-sm font-semibold text-secondary-foreground">Secondary</p>
            <p class="text-xs text-secondary-foreground/70">bg-secondary + text-secondary-foreground</p>
          </div>
          <div class="rounded-lg bg-accent p-4">
            <p class="text-sm font-semibold text-accent-foreground">Accent</p>
            <p class="text-xs text-accent-foreground/70">bg-accent + text-accent-foreground</p>
          </div>
        </div>

        <!-- Status row -->
        <h3 class="text-base font-semibold mt-6 mb-3">Status Colors</h3>
        <div class="grid grid-cols-4 gap-3">
          <div class="rounded-lg bg-status-success/10 border border-status-success/20 p-3 text-center">
            <div class="w-6 h-6 rounded-full bg-status-success mx-auto mb-1.5"></div>
            <p class="text-xs font-semibold text-status-success">Success</p>
          </div>
          <div class="rounded-lg bg-status-warning/10 border border-status-warning/20 p-3 text-center">
            <div class="w-6 h-6 rounded-full bg-status-warning mx-auto mb-1.5"></div>
            <p class="text-xs font-semibold text-status-warning">Warning</p>
          </div>
          <div class="rounded-lg bg-status-error/10 border border-status-error/20 p-3 text-center">
            <div class="w-6 h-6 rounded-full bg-status-error mx-auto mb-1.5"></div>
            <p class="text-xs font-semibold text-status-error">Error</p>
          </div>
          <div class="rounded-lg bg-status-info/10 border border-status-info/20 p-3 text-center">
            <div class="w-6 h-6 rounded-full bg-status-info mx-auto mb-1.5"></div>
            <p class="text-xs font-semibold text-status-info">Info</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
class StyleGuideDemoComponent {
  semanticColors = [
    { name: 'Background', bg: 'bg-background', class: 'bg-background' },
    { name: 'Foreground', bg: 'bg-foreground', class: 'bg-foreground' },
    { name: 'Card', bg: 'bg-card', class: 'bg-card' },
    { name: 'Card Foreground', bg: 'bg-card-foreground', class: 'bg-card-foreground' },
    { name: 'Popover', bg: 'bg-popover', class: 'bg-popover' },
    { name: 'Primary', bg: 'bg-primary', class: 'bg-primary' },
    { name: 'Primary Foreground', bg: 'bg-primary-foreground', class: 'bg-primary-foreground' },
    { name: 'Secondary', bg: 'bg-secondary', class: 'bg-secondary' },
    { name: 'Muted', bg: 'bg-muted', class: 'bg-muted' },
    { name: 'Muted Foreground', bg: 'bg-muted-foreground', class: 'bg-muted-foreground' },
    { name: 'Accent', bg: 'bg-accent', class: 'bg-accent' },
    { name: 'Accent Foreground', bg: 'bg-accent-foreground', class: 'bg-accent-foreground' },
    { name: 'Destructive', bg: 'bg-destructive', class: 'bg-destructive' },
    { name: 'Border', bg: 'bg-border', class: 'bg-border' },
    { name: 'Input', bg: 'bg-input', class: 'bg-input' },
    { name: 'Ring', bg: 'bg-ring', class: 'bg-ring' },
  ];

  brandColors = [
    { name: 'Brand', bg: 'bg-brand', class: 'bg-brand' },
    { name: 'Brand Light', bg: 'bg-brand-light', class: 'bg-brand-light' },
    { name: 'Brand Dark', bg: 'bg-brand-dark', class: 'bg-brand-dark' },
    { name: 'Lazar Green', bg: 'bg-lazar-green', class: 'bg-lazar-green' },
    { name: 'Lazar Green Dark', bg: 'bg-lazar-green-dark', class: 'bg-lazar-green-dark' },
    { name: 'Status Error', bg: 'bg-status-error', class: 'bg-status-error' },
    { name: 'Status Warning', bg: 'bg-status-warning', class: 'bg-status-warning' },
    { name: 'Status Success', bg: 'bg-status-success', class: 'bg-status-success' },
    { name: 'Status Info', bg: 'bg-status-info', class: 'bg-status-info' },
  ];

  textColors = [
    { class: 'text-foreground', label: 'Primary text — headings, body' },
    { class: 'text-muted-foreground', label: 'Secondary text — descriptions, labels' },
    { class: 'text-card-foreground', label: 'Card text — content inside cards' },
    { class: 'text-accent-foreground', label: 'Accent text — on accent backgrounds' },
    { class: 'text-primary-foreground', label: 'Inverted text — on primary backgrounds' },
    { class: 'text-destructive', label: 'Error text — validation messages' },
    { class: 'text-brand', label: 'Brand text — links, highlights' },
    { class: 'text-brand-dark', label: 'Brand dark — hover links' },
    { class: 'text-status-success', label: 'Success text — confirmations' },
    { class: 'text-status-warning', label: 'Warning text — cautions' },
    { class: 'text-status-error', label: 'Error text — alerts' },
    { class: 'text-status-info', label: 'Info text — informational' },
  ];

  typeSizes = [
    { class: 'text-xs', label: 'Extra Small (12px) — captions, badges' },
    { class: 'text-sm', label: 'Small (14px) — labels, secondary text' },
    { class: 'text-base', label: 'Base (16px) — body text' },
    { class: 'text-lg', label: 'Large (18px) — subtitles' },
    { class: 'text-xl', label: 'Extra Large (20px) — section headings' },
    { class: 'text-2xl', label: '2XL (24px) — page titles' },
    { class: 'text-3xl', label: '3XL (30px) — hero headings' },
    { class: 'text-4xl', label: '4XL (36px) — display text' },
  ];

  fontWeights = [
    { class: 'font-light' },
    { class: 'font-normal' },
    { class: 'font-medium' },
    { class: 'font-semibold' },
    { class: 'font-bold' },
    { class: 'font-extrabold' },
  ];

  combos = [
    {
      bg: 'bg-background',
      text: 'text-foreground',
      subtext: 'text-muted-foreground',
      label: 'Page Background',
      bgClass: 'bg-background',
      textClass: 'text-foreground',
    },
    {
      bg: 'bg-card',
      text: 'text-card-foreground',
      subtext: 'text-muted-foreground',
      label: 'Card Surface',
      bgClass: 'bg-card',
      textClass: 'text-card-foreground',
    },
    {
      bg: 'bg-muted',
      text: 'text-foreground',
      subtext: 'text-muted-foreground',
      label: 'Muted Surface',
      bgClass: 'bg-muted',
      textClass: 'text-foreground',
    },
    {
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      subtext: 'text-primary-foreground/70',
      label: 'Primary Button',
      bgClass: 'bg-primary',
      textClass: 'text-primary-foreground',
    },
    {
      bg: 'bg-secondary',
      text: 'text-secondary-foreground',
      subtext: 'text-secondary-foreground/70',
      label: 'Secondary Button',
      bgClass: 'bg-secondary',
      textClass: 'text-secondary-foreground',
    },
    {
      bg: 'bg-accent',
      text: 'text-accent-foreground',
      subtext: 'text-accent-foreground/70',
      label: 'Accent / Hover',
      bgClass: 'bg-accent',
      textClass: 'text-accent-foreground',
    },
    {
      bg: 'bg-destructive',
      text: 'text-destructive-foreground',
      subtext: 'text-destructive-foreground/70',
      label: 'Destructive',
      bgClass: 'bg-destructive',
      textClass: 'text-destructive-foreground',
    },
    {
      bg: 'bg-brand',
      text: 'text-white',
      subtext: 'text-white/70',
      label: 'Brand CTA',
      bgClass: 'bg-brand',
      textClass: 'text-white',
    },
    {
      bg: 'bg-brand/10',
      text: 'text-brand',
      subtext: 'text-brand/70',
      label: 'Brand Tint',
      bgClass: 'bg-brand/10',
      textClass: 'text-brand',
    },
  ];

  borderColors = [
    { class: 'border-border', label: 'border' },
    { class: 'border-input', label: 'input' },
    { class: 'border-ring', label: 'ring' },
    { class: 'border-brand', label: 'brand' },
    { class: 'border-brand/30', label: 'brand/30' },
    { class: 'border-destructive', label: 'destructive' },
    { class: 'border-status-success', label: 'success' },
    { class: 'border-status-warning', label: 'warning' },
  ];

  radiusSizes = [
    { class: 'rounded-none' },
    { class: 'rounded-sm' },
    { class: 'rounded-md' },
    { class: 'rounded-lg' },
    { class: 'rounded-xl' },
    { class: 'rounded-2xl' },
    { class: 'rounded-full' },
  ];

  hoverExamples = [
    { label: 'Hover: Background', classes: 'hover:bg-accent', desc: 'hover:bg-accent' },
    { label: 'Hover: Brand Tint', classes: 'hover:bg-brand/10', desc: 'hover:bg-brand/10' },
    { label: 'Hover: Shadow', classes: 'hover:shadow-lg', desc: 'hover:shadow-lg' },
    { label: 'Hover: Scale Up', classes: 'hover:scale-[1.02]', desc: 'hover:scale-[1.02]' },
    { label: 'Hover: Border Color', classes: 'hover:border-brand', desc: 'hover:border-brand' },
    { label: 'Hover: Ring', classes: 'hover:ring-2 hover:ring-ring', desc: 'hover:ring-2 hover:ring-ring' },
    { label: 'Active: Scale Down', classes: 'hover:bg-accent active:scale-[0.98]', desc: 'active:scale-[0.98]' },
    {
      label: 'Focus: Ring',
      classes: 'focus:ring-2 focus:ring-brand focus:outline-none',
      desc: 'focus:ring-2 focus:ring-brand',
    },
    {
      label: 'Combined',
      classes: 'hover:bg-brand/10 hover:border-brand hover:shadow-md',
      desc: 'bg + border + shadow',
    },
  ];

  opacities = [
    { value: 5, bg: 'bg-brand/5' },
    { value: 10, bg: 'bg-brand/10' },
    { value: 20, bg: 'bg-brand/20' },
    { value: 30, bg: 'bg-brand/30' },
    { value: 40, bg: 'bg-brand/40' },
    { value: 50, bg: 'bg-brand/50' },
    { value: 60, bg: 'bg-brand/60' },
    { value: 70, bg: 'bg-brand/70' },
    { value: 80, bg: 'bg-brand/80' },
    { value: 90, bg: 'bg-brand/90' },
    { value: 100, bg: 'bg-brand' },
  ];

  shadows = [
    { class: 'shadow-none' },
    { class: 'shadow-sm' },
    { class: 'shadow' },
    { class: 'shadow-md' },
    { class: 'shadow-lg' },
    { class: 'shadow-xl' },
    { class: 'shadow-2xl' },
  ];

  spacingSizes = [
    { size: '0.5', px: 2 },
    { size: '1', px: 4 },
    { size: '1.5', px: 6 },
    { size: '2', px: 8 },
    { size: '3', px: 12 },
    { size: '4', px: 16 },
    { size: '5', px: 20 },
    { size: '6', px: 24 },
    { size: '8', px: 32 },
    { size: '10', px: 40 },
    { size: '12', px: 48 },
    { size: '16', px: 64 },
    { size: '20', px: 80 },
    { size: '24', px: 96 },
  ];
}

// ── Story Setup ──────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Demos/Style Guide',
  tags: ['!autodocs'],
};
export default meta;
type Story = StoryObj;

export const StyleGuide: Story = {
  name: 'Style Guide',
  render: () => ({
    moduleMetadata: { imports: [StyleGuideDemoComponent] },
    template: '<style-guide-demo />',
  }),
};
