function resolveVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000000';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerPixlerMonacoTheme(editor: any): void {
  editor.editor.defineTheme('pixler-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': resolveVar('--background') || '#1e1e1e',
      'editor.foreground': resolveVar('--foreground') || '#d4d4d4',
      'editorLineNumber.foreground': resolveVar('--muted-foreground') || '#858585',
      'editorCursor.foreground': resolveVar('--primary') || '#aeafad',
      'editor.selectionBackground': resolveVar('--accent') || '#264f78',
      'editor.lineHighlightBackground': resolveVar('--muted') || '#2a2d2e',
      'editorWidget.background': resolveVar('--card') || '#252526',
      'editorWidget.border': resolveVar('--border') || '#454545',
      'input.background': resolveVar('--input') || '#3c3c3c',
      'scrollbarSlider.background': resolveVar('--border') || '#424242',
    },
  });

  editor.editor.defineTheme('pixler-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': resolveVar('--background') || '#ffffff',
      'editor.foreground': resolveVar('--foreground') || '#000000',
      'editorLineNumber.foreground': resolveVar('--muted-foreground') || '#237893',
      'editorCursor.foreground': resolveVar('--primary') || '#000000',
      'editor.selectionBackground': resolveVar('--accent') || '#add6ff',
      'editor.lineHighlightBackground': resolveVar('--muted') || '#f5f5f5',
      'editorWidget.background': resolveVar('--card') || '#f3f3f3',
      'editorWidget.border': resolveVar('--border') || '#c8c8c8',
      'input.background': resolveVar('--input') || '#ffffff',
      'scrollbarSlider.background': resolveVar('--border') || '#c1c1c1',
    },
  });
}

export function getMonacoTheme(resolvedMode: 'light' | 'dark'): string {
  return resolvedMode === 'dark' ? 'pixler-dark' : 'pixler-light';
}
