import { useRef, useState } from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { Columns2, AlignLeft } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useSetting } from '../hooks/useSetting';
import type { DiffFileDetail } from '@pixler/shared-types';

interface Props {
  file: DiffFileDetail;
}

export function DiffEditor({ file }: Props) {
  const [sideBySide, setSideBySide] = useState(true);
  const editorRef = useRef<unknown>(null);
  const { value: wordWrap = 'off' } = useSetting<'off' | 'on'>('diff.wordWrap');
  const { value: renderWhitespace = 'none' } = useSetting<'none' | 'boundary' | 'all'>('diff.renderWhitespace');

  if (file.isBinary) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Binary file — diff not available
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 shrink-0 items-center gap-1 border-b border-border px-2">
        <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">{file.path}</span>
        <Button
          variant={sideBySide ? 'secondary' : 'ghost'}
          size="icon-xs"
          onClick={() => setSideBySide(true)}
          aria-label="Side-by-side view"
        >
          <Columns2 className="size-3.5" />
        </Button>
        <Button
          variant={!sideBySide ? 'secondary' : 'ghost'}
          size="icon-xs"
          onClick={() => setSideBySide(false)}
          aria-label="Unified view"
        >
          <AlignLeft className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1">
        <MonacoDiffEditor
          key={`${file.path}-${sideBySide}`}
          original={file.oldContent ?? ''}
          modified={file.newContent ?? ''}
          language={file.language}
          theme="vs-dark"
          options={{
            readOnly: true,
            renderSideBySide: sideBySide,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on',
            wordWrap: wordWrap,
            renderWhitespace: renderWhitespace,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
          onMount={(editor) => { editorRef.current = editor; }}
        />
      </div>
    </div>
  );
}
