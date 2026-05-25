import { useEffect, useRef } from 'react';
import { ResizableSplit } from '@pixler/ui/components/resizable-split';
import { Toaster } from '@pixler/ui/components/sonner';
import { useSetting } from '../hooks/useSetting';
import { useLayoutStore, type PaneLayout } from '../stores/layout';
import { TopBar } from '../components/TopBar';
import { WorkspacesSidebar } from '../components/WorkspacesSidebar';
import { CenterTabs } from '../components/CenterTabs';
import { RightPane } from '../components/RightPane';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { ProjectSettingsDrawer } from '../components/ProjectSettingsDrawer';

/**
 * 3-pane shell for `/p/$projectId` and `/p/$projectId/w/$workspaceId`.
 * Full-bleed states bypass the resizable splits — bigTerminal and per-pane
 * expand chevrons each render only the relevant component.
 */
export function ProjectShell() {
  const panes = useLayoutStore((s) => s.panes);
  const setOuter = useLayoutStore((s) => s.setOuter);
  const setInner = useLayoutStore((s) => s.setInner);
  const hydrate = useLayoutStore((s) => s.hydrate);
  const bigTerminal = useLayoutStore((s) => s.bigTerminal);
  const fullBleed = useLayoutStore((s) => s.fullBleed);

  const { value: persisted, set: persist } = useSetting<PaneLayout>('layout.paneSizes');

  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current && persisted?.outer && persisted?.inner) {
      hydrate(persisted);
      hydrated.current = true;
    }
  }, [persisted, hydrate]);

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

  const renderPanes = () => {
    if (bigTerminal || fullBleed === 'right') {
      return <RightPane />;
    }
    if (fullBleed === 'sidebar') {
      return <WorkspacesSidebar />;
    }
    if (fullBleed === 'center') {
      return <CenterTabs />;
    }
    return (
      <ResizableSplit sizes={panes.outer} onResize={handleOuter} className="h-full">
        <aside data-testid="sidebar" className="h-full border-r border-border">
          <WorkspacesSidebar />
        </aside>
        <ResizableSplit sizes={panes.inner} onResize={handleInner} className="h-full">
          <main className="h-full">
            <CenterTabs />
          </main>
          <section className="h-full border-l border-border">
            <RightPane />
          </section>
        </ResizableSplit>
      </ResizableSplit>
    );
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />
      <div className="min-h-0 flex-1">
        {renderPanes()}
      </div>

      {/* Global drawers */}
      <SettingsDrawer />
      <ProjectSettingsDrawer />

      {/* Activity toast viewport — M18 populates this */}
      <Toaster position="bottom-right" />
    </div>
  );
}
