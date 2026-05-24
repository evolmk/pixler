import type { Meta, StoryObj } from '@storybook/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Badge } from '../components/badge';
import { Button } from '../components/button';

const meta: Meta = { title: 'Demos/Design', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

const SPEC_PATH = '../../../../_specs/spec-ui/spec-ui-design-system.md';

// Eyebrow + brand-rule live example
function EyebrowExample() {
  return (
    <div className="space-y-1">
      <p className="eyebrow text-muted-foreground">01 — Overview</p>
      <h2 className="text-2xl font-bold text-foreground">Design System</h2>
      <div className="h-0.5 w-12 bg-brand" />
    </div>
  );
}

// Hero numbers live example
function HeroNumbers() {
  return (
    <div className="flex gap-8">
      {[
        { value: '4.81', label: 'Avg. response' },
        { value: '12k', label: 'Tokens / run' },
        { value: '98%', label: 'Cache hit rate' },
      ].map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="text-5xl font-bold tabular-nums text-foreground">{s.value}</span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// Stat chip live example
function StatChips() {
  return (
    <div className="flex gap-2">
      <Badge variant="secondary">12 open</Badge>
      <Badge variant="outline">4 in review</Badge>
      <Badge className="bg-status-success text-white">2 merged</Badge>
    </div>
  );
}

const MARKDOWN_CONTENT = `# Design System — Pixler

> On-demand agent reference for building Pixler UI.

---

## Intent

- **Who:** Developers and technical leads managing projects, workspaces, and terminal sessions.
- **Feel:** Grounded and precise — like a well-organized developer tool. Not consumer-retail playful, not cold SaaS sterile.
- **Surfaces:** Technical document rendered in a browser — flat, border-separated, gray-on-white with brand-green hits.

---

## Voice & Content

- **Grounded, declarative, developer-to-developer.** Assumes reader knows repos, branches, workspaces, terminal sessions.
- **Confident, never apologetic.** "No results" not "Sorry, we couldn't find anything."
- **Casing:** Title Case for nav/page titles · UPPERCASE WITH WIDE TRACKING for overlines · Sentence case for body.
- **Units:** durations human-readable (\`2h 15m\`) · counts with \`tabular-nums\`.
- **Emoji: never.** Use Lucide icons.

---

## Palette

Brand green \`#16a355\` is the single accent. All other colors come from the token contract in \`@pixler/ui-styles\`.

| Token | Role |
|-------|------|
| \`--background\` | Page canvas |
| \`--foreground\` | Primary text |
| \`--primary\` | Interactive elements, active states |
| \`--muted\` | Subtle fills |
| \`--destructive\` | Error, delete |
| \`--brand\` | Brand accent (#16a355) |

---

## Typography

- Base: 14px Inter Variable
- Scale: xs → 4xl via Tailwind
- Code: \`font-mono\` on monospace spans

---

## Component Rules

- All components use semantic tokens only — never hardcoded colors.
- \`cn()\` for class merging everywhere.
- \`forwardRef\` on every DOM element component.
- Motion respects \`prefers-reduced-motion\`.
`;

export const DesignDoc: Story = {
  name: 'Design Doc',
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-6 rounded bg-brand" />
          <span className="text-sm font-semibold text-foreground">Pixler Design System</span>
        </div>
        <Button variant="ghost" size="sm">Edit on GitHub</Button>
      </div>

      <div className="mx-auto flex max-w-5xl gap-8 px-8 py-10">
        {/* TOC */}
        <aside className="sticky top-10 h-fit w-52 shrink-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
          <nav className="space-y-1 text-sm">
            {['Intent', 'Voice & Content', 'Palette', 'Typography', 'Component Rules'].map((h) => (
              <a key={h} href={`#${h.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="block py-1 text-muted-foreground hover:text-foreground transition-colors">
                {h}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Hero eyebrow + brand rule */}
          <div className="mb-8">
            <EyebrowExample />
          </div>

          {/* Markdown doc */}
          <div className="prose prose-sm max-w-none text-foreground
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-foreground [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-4
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-foreground [&_h2]:scroll-mt-6
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground
            [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-foreground [&_p]:mb-4
            [&_li]:text-sm [&_li]:text-foreground
            [&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs
            [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto
            [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-muted
            [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
            [&_hr]:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
              {MARKDOWN_CONTENT}
            </ReactMarkdown>
          </div>

          {/* Live Hero Numbers example */}
          <div className="mt-10 space-y-3">
            <p className="text-sm font-semibold text-foreground">Live: Hero Numbers</p>
            <div className="rounded-lg border border-border p-6 bg-card">
              <HeroNumbers />
            </div>
          </div>

          {/* Live Stat Chips example */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-foreground">Live: Stat Chips</p>
            <div className="rounded-lg border border-border p-4 bg-card">
              <StatChips />
            </div>
          </div>
        </main>
      </div>
    </div>
  ),
};
