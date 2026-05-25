import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useThemeStore } from '../stores/theme';
import { getMonacoTheme } from '../lib/monaco-theme';

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function PlanEditor({ value, onChange, readOnly }: Props) {
  const editorRef = useRef<unknown>(null);
  const resolvedMode = useThemeStore((s) => s.resolvedMode);
  const monacoTheme = getMonacoTheme(resolvedMode);

  return (
    <Editor
      height="100%"
      language="markdown"
      value={value}
      theme={monacoTheme}
      options={{
        readOnly,
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        folding: false,
        fontSize: 13,
        padding: { top: 8, bottom: 8 },
        scrollBeyondLastLine: false,
      }}
      onMount={(editor) => { editorRef.current = editor; }}
      onChange={(v) => onChange(v ?? '')}
    />
  );
}
