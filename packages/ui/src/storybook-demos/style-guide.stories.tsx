import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/button';
import { Badge } from '../components/badge';
import { Separator } from '../components/separator';

const meta: Meta = { title: 'Demos/Style Guide', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

const semanticColors = [
  { name: 'background', token: 'bg-background', label: 'Background' },
  { name: 'foreground', token: 'bg-foreground', label: 'Foreground' },
  { name: 'card', token: 'bg-card', label: 'Card' },
  { name: 'primary', token: 'bg-primary', label: 'Primary' },
  { name: 'secondary', token: 'bg-secondary', label: 'Secondary' },
  { name: 'muted', token: 'bg-muted', label: 'Muted' },
  { name: 'accent', token: 'bg-accent', label: 'Accent' },
  { name: 'destructive', token: 'bg-destructive', label: 'Destructive' },
  { name: 'border', token: 'bg-border', label: 'Border' },
  { name: 'input', token: 'bg-input', label: 'Input' },
  { name: 'ring', token: 'bg-ring', label: 'Ring' },
];

const brandColors = [
  { token: 'bg-brand', label: 'brand' },
  { token: 'bg-brand-light', label: 'brand-light' },
  { token: 'bg-brand-dark', label: 'brand-dark' },
];

const statusColors = [
  { token: 'bg-status-error', label: 'error' },
  { token: 'bg-status-warning', label: 'warning' },
  { token: 'bg-status-success', label: 'success' },
  { token: 'bg-status-info', label: 'info' },
];

const textSizes = [
  { label: 'xs', cls: 'text-xs' },
  { label: 'sm', cls: 'text-sm' },
  { label: 'base', cls: 'text-base' },
  { label: 'lg', cls: 'text-lg' },
  { label: 'xl', cls: 'text-xl' },
  { label: '2xl', cls: 'text-2xl' },
  { label: '3xl', cls: 'text-3xl' },
  { label: '4xl', cls: 'text-4xl' },
];

const weights = [
  { label: 'light', cls: 'font-light' },
  { label: 'normal', cls: 'font-normal' },
  { label: 'medium', cls: 'font-medium' },
  { label: 'semibold', cls: 'font-semibold' },
  { label: 'bold', cls: 'font-bold' },
  { label: 'extrabold', cls: 'font-extrabold' },
];

const radii = ['rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'];
const shadows = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
const spacings = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <Separator className="mt-2" />
      </div>
      {children}
    </section>
  );
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`size-12 rounded-md border border-border ${token}`} />
      <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
    </div>
  );
}

export const Guide: Story = {
  name: 'Style Guide',
  render: () => (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pixler UI — Style Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">Design tokens, typography, spacing, and component patterns.</p>
      </div>

      <Section title="Semantic Colors">
        <div className="flex flex-wrap gap-4">
          {semanticColors.map((c) => <Swatch key={c.name} token={c.token} label={c.label} />)}
        </div>
      </Section>

      <Section title="Brand & Status Colors">
        <div className="flex flex-wrap gap-4">
          {brandColors.map((c) => <Swatch key={c.label} token={c.token} label={c.label} />)}
          {statusColors.map((c) => <Swatch key={c.label} token={c.token} label={c.label} />)}
        </div>
      </Section>

      <Section title="Typography Scale">
        <div className="space-y-2">
          {textSizes.map((s) => (
            <div key={s.label} className="flex items-baseline gap-4">
              <span className="w-10 text-xs text-muted-foreground font-mono">{s.label}</span>
              <span className={`${s.cls} text-foreground font-medium`}>The quick brown fox jumps over the lazy dog</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font Weights">
        <div className="space-y-1">
          {weights.map((w) => (
            <div key={w.label} className="flex items-baseline gap-4">
              <span className="w-20 text-xs text-muted-foreground font-mono">{w.label}</span>
              <span className={`${w.cls} text-base text-foreground`}>Inter Variable — Pixler UI</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Text Colors">
        <div className="flex flex-wrap gap-4">
          {[
            { cls: 'text-foreground', label: 'foreground' },
            { cls: 'text-muted-foreground', label: 'muted-foreground' },
            { cls: 'text-primary', label: 'primary' },
            { cls: 'text-secondary-foreground', label: 'secondary-fg' },
            { cls: 'text-destructive', label: 'destructive' },
            { cls: 'text-brand', label: 'brand' },
          ].map((c) => (
            <div key={c.cls} className="flex flex-col gap-1">
              <span className={`${c.cls} text-sm font-medium`}>Aa</span>
              <span className="text-[10px] text-muted-foreground font-mono">{c.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border Radius">
        <div className="flex flex-wrap items-center gap-4">
          {radii.map((r) => (
            <div key={r} className="flex flex-col items-center gap-1.5">
              <div className={`size-12 bg-primary ${r}`} />
              <span className="text-[10px] text-muted-foreground font-mono">{r.replace('rounded-', '')}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadows">
        <div className="flex flex-wrap items-end gap-6">
          {shadows.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`size-16 rounded-md bg-card border border-border ${s}`} />
              <span className="text-[10px] text-muted-foreground font-mono">{s.replace('shadow-', '') || 'default'}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing Scale">
        <div className="space-y-1">
          {spacings.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-8 text-xs text-muted-foreground font-mono text-right">{s}</span>
              <div style={{ width: `${s * 4}px` }} className="h-3 bg-primary rounded-sm" />
              <span className="text-xs text-muted-foreground">{s * 4}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Component Comparison">
        <div className="flex gap-4 flex-wrap">
          {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          {(['default', 'secondary', 'outline', 'destructive'] as const).map((v) => (
            <Badge key={v} variant={v}>{v}</Badge>
          ))}
        </div>
      </Section>

      <Section title="Hover & Interactive States">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-md text-sm bg-muted hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">Hover me</div>
          <div className="px-4 py-2 rounded-md text-sm border border-border hover:border-primary cursor-pointer transition-colors">Border hover</div>
          <div className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Text hover</div>
        </div>
      </Section>

      <Section title="Opacity Variants">
        <div className="flex gap-2 flex-wrap">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((o) => (
            <div key={o} className="flex flex-col items-center gap-1">
              <div className={`size-10 rounded bg-primary opacity-${o}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{o}%</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};
