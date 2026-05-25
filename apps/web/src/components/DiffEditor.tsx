import { useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { Columns2, AlignLeft } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useSetting } from '../hooks/useSetting';
import { useThemeStore } from '../stores/theme';
import { getMonacoTheme } from '../lib/monaco-theme';
import type { DiffFileDetail } from '@pixler/shared-types';

const FONT_SIZE_MIN = 9;
const FONT_SIZE_MAX = 24;

interface Props {
  file: DiffFileDetail;
}

export function DiffEditor({ file }: Props) {
  const [sideBySide, setSideBySide] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const editorRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { value: wordWrap = 'off' } = useSetting<'off' | 'on'>('diff.wordWrap');
  const { value: renderWhitespace = 'none' } = useSetting<'none' | 'boundary' | 'all'>('diff.renderWhitespace');
  const resolvedMode = useThemeStore((s) => s.resolvedMode);
  const monacoTheme = getMonacoTheme(resolvedMode);

  useGesture({
    onPinch: ({ offset: [scale] }) => {
      setFontSize(Math.round(Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, 13 * scale))));
    },
  }, { target: containerRef });

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
      <div className="flex-1" ref={containerRef}>
        <MonacoDiffEditor
          key={`${file.path}-${sideBySide}`}
          original={file.oldContent ?? ''}
          modified={file.newContent ?? ''}
          language={file.language}
          theme={monacoTheme}
          options={{
            readOnly: true,
            renderSideBySide: sideBySide,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: fontSize,
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
