import { useEffect, useRef } from 'react';
import { useParams } from '@tanstack/react-router';
import { ResizableSplit } from '@pixler/ui/components/resizable-split';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@pixler/ui/components/dialog';
import { useSetting } from '../hooks/useSetting';
import { useLayoutStore, type PaneLayout } from '../stores/layout';
import { TopBar } from '../components/TopBar';

function PanePlaceholder({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-6 text-center">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

/**
 * 3-pane shell rendered for `/p/$projectId` and `/p/$projectId/w/$workspaceId`.
 * Sprint 1 ships the hollow skeleton; TopBar (Sprint 2), real sidebar / tabs /
 * right pane (Sprint 3) and the settings drawer (Sprint 4) fill it in.
 *
 * Three panes via two nested `<ResizableSplit>`s (the wrapper takes exactly two
 * children): outer = sidebar | rest, inner = center | right.
 */
export function ProjectShell() {
  const { projectId, workspaceId } = useParams({ strict: false }) as {
    projectId?: string;
    workspaceId?: string;
  };

  const panes = useLayoutStore((s) => s.panes);
  const setOuter = useLayoutStore((s) => s.setOuter);
  const setInner = useLayoutStore((s) => s.setInner);
  const hydrate = useLayoutStore((s) => s.hydrate);
  const settingsOpen = useLayoutStore((s) => s.settingsOpen);
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);

  const { value: persisted, set: persist } = useSetting<PaneLayout>('layout.paneSizes');

  // Hydrate the store once from the persisted setting.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current && persisted?.outer && persisted?.inner) {
      hydrate(persisted);
      hydrated.current = true;
    }
  }, [persisted, hydrate]);

  // `onLayoutChange` fires on every pointer move — debounce the write-back so we
  // don't hammer the settings API + socket invalidation on each drag frame.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const schedulePersist = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(useLayoutStore.getState().panes), 300);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleOuter = (layout: { [id: string]: number }) => {
    const [a, b] = Object.values(layout);
    if (a == null || b == null) return;
    setOuter([a, b]);
    schedulePersist();
  };
  const handleInner = (layout: { [id: string]: number }) => {
    const [a, b] = Object.values(layout);
    if (a == null || b == null) return;
    setInner([a, b]);
    schedulePersist();
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />
      <ResizableSplit sizes={panes.outer} onResize={handleOuter} className="flex-1 min-h-0">
        <aside data-testid="sidebar" className="h-full border-r border-border">
          <PanePlaceholder
            label="Workspaces"
            sub={projectId ? `project: ${projectId}` : 'no project'}
          />
        </aside>
        <ResizableSplit sizes={panes.inner} onResize={handleInner} className="h-full">
          <main className="h-full">
            <PanePlaceholder
              label="Chat · Plan · Diff · Checks · PR"
              sub="center tabs land in Sprint 3"
            />
          </main>
          <section className="h-full border-l border-border">
            <PanePlaceholder
              label="Chat / Terminal"
              sub={workspaceId ? `workspace: ${workspaceId}` : 'no workspace selected'}
            />
          </section>
        </ResizableSplit>
      </ResizableSplit>

      {/* Settings drawer stub — Sprint 4 replaces this with a real Vaul drawer */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Full settings drawer ships in Sprint 4. Appearance, Linear, Git, and more.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
