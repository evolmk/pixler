import type { Meta, StoryObj } from '@storybook/react';
import { DesignMdViewer, type DesignMdSection } from '../components/design-md-viewer';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Calendar } from '../components/calendar';
import { SegmentedControl } from '../components/segmented-control';
import { BottomTabs } from '../components/bottom-tabs';
import { EmptyState } from '../components/empty-state';
import { Input } from '../components/input';
import { Switch } from '../components/switch';
import { Label } from '../components/label';
import { Checkbox } from '../components/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';
import { Tabs, TabsList, TabsTrigger } from '../components/tabs';
import { MessageSquare, FileText, GitPullRequest, CheckSquare, Inbox } from 'lucide-react';
import { useState } from 'react';

const meta: Meta = { title: 'Demos/Design.md', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

const COLOR_SWATCHES = [
  { token: 'var(--brand)', label: 'brand', role: 'Primary action' },
  { token: 'var(--brand-light)', label: 'brand-light', role: 'Hover state' },
  { token: 'var(--brand-dark)', label: 'brand-dark', role: 'Active state' },
  { token: 'var(--status-error)', label: 'error', role: 'Destructive' },
  { token: 'var(--status-warning)', label: 'warning', role: 'Caution' },
  { token: 'var(--status-success)', label: 'success', role: 'Positive' },
  { token: 'var(--status-info)', label: 'info', role: 'Informational' },
];

const TYPE_SCALE = [
  { label: 'Display', size: 'text-5xl font-bold' },
  { label: '4xl', size: 'text-4xl font-bold' },
  { label: '3xl', size: 'text-3xl font-semibold' },
  { label: '2xl', size: 'text-2xl font-semibold' },
  { label: 'xl', size: 'text-xl font-medium' },
  { label: 'lg', size: 'text-lg font-medium' },
  { label: 'base', size: 'text-base' },
  { label: 'sm', size: 'text-sm' },
  { label: 'xs', size: 'text-xs' },
];

const sections: DesignMdSection[] = [
  {
    number: '01',
    eyebrow: 'Overview',
    title: 'Design Language',
    lead: 'Pixler\'s design language is grounded and precise — built for developers who think in repos, branches, and tasks. Flat, border-separated surfaces with brand-green as the single accent (#16a355). Never consumer-retail playful; never cold SaaS sterile.',
  },
  {
    number: '02',
    eyebrow: 'Foundations',
    title: 'Color',
    lead: 'Brand greens carry the interactive layer. Neutrals provide the document-like surface ramp. Status colors communicate outcomes without noise.',
    examples: (
      <div className="flex flex-wrap gap-4">
        {COLOR_SWATCHES.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5 items-center">
            <div className="size-14 rounded-lg border border-border" style={{ backgroundColor: s.token }} />
            <p className="text-xs font-mono text-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.role}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    eyebrow: 'Typography',
    title: 'Type Scale',
    lead: 'Inter Variable at 14px base. Display numerals for hero metrics. Full scale from xs to 4xl. Eyebrow utility for overline labels.',
    examples: (
      <div className="space-y-2">
        <div className="flex gap-8 mb-4">
          {['4.81', '12k', '98%'].map((n) => (
            <div key={n} className="flex flex-col">
              <span className="text-5xl font-bold tabular-nums text-foreground">{n}</span>
              <span className="text-xs text-muted-foreground">metric</span>
            </div>
          ))}
        </div>
        {TYPE_SCALE.map((t) => (
          <div key={t.label} className="flex items-baseline gap-4">
            <span className="w-14 text-xs font-mono text-muted-foreground">{t.label}</span>
            <span className={`${t.size} text-foreground`}>Pixler</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '04',
    eyebrow: 'Components',
    title: 'Buttons',
    lead: 'Six CVA variants × three sizes. Default uses brand-primary. Ghost and link variants for low-priority actions. Destructive for irreversible operations.',
    examples: (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['sm', 'default', 'lg'] as const).map((s) => (
            <Button key={s} size={s}>Size {s}</Button>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '05',
    eyebrow: 'Components',
    title: 'Tabs & Segmented',
    lead: 'Pill tabs for top-level surface switching. SegmentedControl for inline filter selections. BottomTabs for mobile one-tap navigation.',
    examples: (
      <div className="space-y-6">
        {(() => {
          const [seg, setSeg] = useState('day');
          const [tab, setTab] = useState('chat');
          return (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-2">SegmentedControl</p>
                <SegmentedControl value={seg} onChange={setSeg} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Pill Tabs</p>
                <Tabs defaultValue="plan">
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="plan">Plan</TabsTrigger>
                    <TabsTrigger value="diff">Diff</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">BottomTabs (mobile-only — visible when viewport &lt;768px)</p>
                <div className="relative h-20 rounded-lg border border-dashed border-border overflow-hidden">
                  <BottomTabs
                    items={[
                      { value: 'chat', label: 'Chat', icon: <MessageSquare /> },
                      { value: 'plan', label: 'Plan', icon: <FileText /> },
                      { value: 'pr', label: 'PR', icon: <GitPullRequest /> },
                      { value: 'checks', label: 'Checks', icon: <CheckSquare /> },
                    ]}
                    value={tab}
                    onChange={setTab}
                    className="!fixed-none !relative !bottom-auto"
                  />
                </div>
              </div>
            </>
          );
        })()}
      </div>
    ),
  },
  {
    number: '06',
    eyebrow: 'Components',
    title: 'Cards & Surfaces',
    lead: 'Card is the primary elevated surface. Border-radius scale from md to xl. Empty State for zero-data views with icon, headline, and CTA.',
    examples: (
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          {['rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map((r) => (
            <div key={r} className={`w-24 h-16 bg-card border border-border ${r} flex items-end p-2`}>
              <span className="text-[10px] font-mono text-muted-foreground">{r.replace('rounded-', '')}</span>
            </div>
          ))}
        </div>
        <EmptyState icon={Inbox} title="No items yet" body="Items you create will appear here." action={<Button size="sm">Add item</Button>} />
      </div>
    ),
  },
  {
    number: '07',
    eyebrow: 'Components',
    title: 'Forms',
    lead: 'Input, Textarea, Checkbox, Switch, and RadioGroup follow consistent height and focus-ring patterns. All form elements use the input token for background.',
    examples: (
      <div className="space-y-4 max-w-sm">
        <div className="space-y-1.5">
          <Label>Default input</Label>
          <Input placeholder="Enter value…" />
        </div>
        <div className="space-y-1.5">
          <Label>Disabled input</Label>
          <Input disabled placeholder="Disabled" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><Checkbox id="ck1" defaultChecked /><Label htmlFor="ck1">Checked</Label></div>
          <div className="flex items-center gap-2"><Switch id="sw1" defaultChecked /><Label htmlFor="sw1">Enabled</Label></div>
        </div>
        <RadioGroup defaultValue="option1" className="flex gap-4">
          <div className="flex items-center gap-2"><RadioGroupItem value="option1" id="r1" /><Label htmlFor="r1">Option 1</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="option2" id="r2" /><Label htmlFor="r2">Option 2</Label></div>
        </RadioGroup>
        <Calendar mode="single" selected={new Date()} className="rounded-md border border-border" />
      </div>
    ),
  },
  {
    number: '08',
    eyebrow: 'Patterns',
    title: 'Compositions',
    lead: 'Pixler-specific compositions assembled from primitives: workspace row, PR status row, and agent status indicators.',
    examples: (
      <div className="space-y-3 max-w-sm">
        <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-xs font-mono text-primary">WS</span></div>
            <div><p className="text-sm font-medium text-foreground">workspace/feature-auth</p><p className="text-xs text-muted-foreground">main · 3 commits ahead</p></div>
          </div>
          <Badge variant="secondary">Running</Badge>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
          <div><p className="text-sm font-medium text-foreground">#124 — Add auth flow</p><p className="text-xs text-muted-foreground">opened 2h ago</p></div>
          <div className="flex gap-1"><Badge className="bg-status-success text-white text-[10px]">CI ✓</Badge><Badge variant="outline" className="text-[10px]">Review</Badge></div>
        </div>
      </div>
    ),
  },
  {
    number: '09',
    eyebrow: 'Responsive',
    title: 'Breakpoints & Touch Targets',
    lead: 'Five breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). Minimum touch target: h-11 (44px) for interactive elements on mobile.',
    markdown: `
| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| sm | 640px | Relaxed single-column |
| md | 768px | Two-column, sheet vs drawer |
| lg | 1024px | Three-pane layout |
| xl | 1280px | Wide content + sidebar |
| 2xl | 1536px | Max content width |

Touch targets: \`h-11\` (44px) minimum, \`py-3\` on list rows, \`size="icon-sm"\` for compact icon buttons.
    `,
  },
];

export const DesignMd: Story = {
  name: 'Design.md',
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-8">
        <p className="eyebrow text-muted-foreground mb-1">Pixler Design System</p>
        <h1 className="text-4xl font-bold text-foreground">Visual Language</h1>
        <div className="h-0.5 w-16 bg-brand mt-3" />
      </div>
      <DesignMdViewer sections={sections} tocTitle="On this page" />
    </div>
  ),
};
