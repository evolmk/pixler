import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { GitCompare } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useLayoutStore } from '../stores/layout';
import { useDiffFiles, useDiffFile } from '../hooks/useDiff';
import { DiffFileTree } from './DiffFileTree';
import { DiffEditor } from './DiffEditor';
import { HunkList } from './HunkList';

export function DiffTab() {
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId;
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setFullBleed(fullBleed === 'center' ? null : 'center');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullBleed, setFullBleed]);

  const { data: files = [], isLoading, refetch } = useDiffFiles(workspaceId);
  const { data: fileDetail, isLoading: isDetailLoading } = useDiffFile(workspaceId, selectedPath ?? undefined);

  if (!workspaceId) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState icon={GitCompare} title="No workspace selected" body="Open a workspace to see diffs." className="border-none" />
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="flex h-full min-h-0">
      {/* File tree sidebar */}
      <div className="flex w-56 shrink-0 flex-col border-r border-border">
        <div className="flex h-8 items-center justify-between px-3 border-b border-border">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Changed files
          </span>
          <Button variant="ghost" size="icon-xs" onClick={() => void refetch()} aria-label="Refresh">
            <RefreshCw className="size-3" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DiffFileTree files={files} selected={selectedPath} onSelect={setSelectedPath} />
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {selectedPath && fileDetail ? (
            <DiffEditor file={fileDetail} />
          ) : isDetailLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading…</div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={GitCompare}
                title={files.length > 0 ? 'Select a file' : 'No changes'}
                body={files.length > 0 ? 'Click a file in the tree to view its diff.' : 'All files are clean.'}
                className="border-none"
              />
            </div>
          )}
        </div>
        {selectedPath && fileDetail && workspaceId && (
          <HunkList workspaceId={workspaceId} file={fileDetail} />
        )}
      </div>
    </div>
  );
}
