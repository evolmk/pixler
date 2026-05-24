import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@pixler/ui/lib/utils';
import { AdaptiveSheet } from '@pixler/ui/components/adaptive-sheet';
import { useMediaQuery } from '@pixler/ui/hooks/use-media-query';

export interface DesignMdSection {
  number: string;
  eyebrow: string;
  title: string;
  lead: string;
  markdown?: string;
  examples?: React.ReactNode;
}

interface DesignMdViewerProps {
  sections: DesignMdSection[];
  tocTitle?: string;
  className?: string;
}

function TocRail({ sections, activeId }: { sections: DesignMdSection[]; activeId: string }) {
  return (
    <nav className="space-y-1">
      {sections.map((s) => {
        const id = `section-${s.number}`;
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              'block rounded px-2 py-1 text-sm transition-colors',
              isActive
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="mr-1.5 font-mono text-[10px] text-muted-foreground">{s.number}</span>
            {s.title}
          </a>
        );
      })}
    </nav>
  );
}

function DesignMdViewer({ sections, tocTitle = 'On this page', className }: DesignMdViewerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [activeId, setActiveId] = React.useState(`section-${sections[0]?.number ?? ''}`);
  const [tocOpen, setTocOpen] = React.useState(false);

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.number}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(`section-${s.number}`); },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className={cn('relative flex gap-8', className)}>
      {isDesktop ? (
        <aside className="sticky top-6 h-fit w-56 shrink-0 self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {tocTitle}
          </p>
          <TocRail sections={sections} activeId={activeId} />
        </aside>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="sticky top-3 z-10 mb-4 flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm"
          >
            {tocTitle}
          </button>
          <AdaptiveSheet open={tocOpen} onOpenChange={setTocOpen} title={tocTitle}>
            <div className="px-4 pb-6">
              <TocRail sections={sections} activeId={activeId} />
            </div>
          </AdaptiveSheet>
        </>
      )}

      <div className="min-w-0 max-w-[760px] flex-1 space-y-16">
        {sections.map((s) => (
          <section key={s.number} id={`section-${s.number}`} className="scroll-mt-6 border-t border-border pt-10 first:border-0 first:pt-0">
            <p className="eyebrow mb-3 text-muted-foreground">
              {s.number} — {s.eyebrow}
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">{s.title}</h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">{s.lead}</p>
            {s.markdown && (
              <div className="prose prose-sm mb-8 max-w-none text-foreground [&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1 [&_code]:font-mono [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.markdown}</ReactMarkdown>
              </div>
            )}
            {s.examples && (
              <div className="rounded-lg border border-border p-6">{s.examples}</div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export { DesignMdViewer };
