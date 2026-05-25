import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { buildTerminalTheme, watchTheme } from '../lib/terminal-theme';
import { useTerminal } from '../hooks/useTerminal';
import { useSetting } from '../hooks/useSetting';

interface TerminalPaneProps {
  workspaceId?: string | null;
  /** Subscribe to an existing terminal instead of findOrCreate. */
  terminalId?: string | null;
  /** Called with the resolved terminal ID once the session is ready. */
  onTerminalReady?: (id: string) => void;
  /** Ref that will be populated with the interrupt fn so the parent can call it. */
  onInterruptRef?: React.MutableRefObject<(() => void) | null>;
}

export function TerminalPane({
  workspaceId,
  terminalId: explicitTerminalId,
  onTerminalReady,
  onInterruptRef,
}: TerminalPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const mountedRef = useRef(false);
  const writeRef = useRef<(data: string) => void>(() => {});
  const resizeRef = useRef<(cols: number, rows: number) => void>(() => {});

  const { value: fontFamily } = useSetting<string>('terminal.fontFamily');
  const { value: fontSize } = useSetting<number>('terminal.fontSize');
  const { value: cursorStyle } = useSetting<'block' | 'underline' | 'bar'>('terminal.cursorStyle');
  const { value: scrollback } = useSetting<number>('terminal.scrollback');
  const { value: copyOnSelect } = useSetting<boolean>('terminal.copyOnSelect');

  const handleData = useCallback((data: string) => {
    xtermRef.current?.write(data);
  }, []);

  const { write, resize, interrupt, terminalId: resolvedId } = useTerminal({
    workspaceId,
    terminalId: explicitTerminalId,
    onData: handleData,
  });

  useEffect(() => { writeRef.current = write; }, [write]);
  useEffect(() => { resizeRef.current = resize; }, [resize]);

  // Expose interrupt to parent
  useEffect(() => {
    if (onInterruptRef) onInterruptRef.current = interrupt;
  }, [interrupt, onInterruptRef]);

  // Notify parent once terminal id is resolved
  useEffect(() => {
    if (resolvedId) onTerminalReady?.(resolvedId);
  }, [resolvedId, onTerminalReady]);

  // Mount xterm once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mountedRef.current) return;
    mountedRef.current = true;

    const term = new Terminal({
      fontFamily: fontFamily ?? 'JetBrains Mono, Menlo, Monaco, monospace',
      fontSize: fontSize ?? 13,
      cursorStyle: cursorStyle ?? 'block',
      cursorBlink: true,
      scrollback: scrollback ?? 5000,
      allowProposedApi: true,
      theme: buildTerminalTheme(),
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(container);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.onData((data) => writeRef.current(data));

    const stopWatching = watchTheme(() => {
      term.options.theme = buildTerminalTheme();
    });

    return () => {
      stopWatching();
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount once only

  // ResizeObserver keeps PTY cols/rows in sync
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const fitAddon = fitAddonRef.current;
      if (!fitAddon) return;
      fitAddon.fit();
      const term = xtermRef.current;
      if (term) resizeRef.current(term.cols, term.rows);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Re-apply settings when they change
  useEffect(() => {
    const term = xtermRef.current;
    if (!term) return;
    if (fontFamily) term.options.fontFamily = fontFamily;
    if (fontSize) term.options.fontSize = fontSize;
    if (cursorStyle) term.options.cursorStyle = cursorStyle;
    if (scrollback != null) term.options.scrollback = scrollback;
    fitAddonRef.current?.fit();
  }, [fontFamily, fontSize, cursorStyle, scrollback]);

  // Copy-on-select
  useEffect(() => {
    const term = xtermRef.current;
    if (!term || !copyOnSelect) return;
    const { dispose } = term.onSelectionChange(() => {
      const sel = term.getSelection();
      if (sel) navigator.clipboard.writeText(sel).catch(() => {});
    });
    return dispose;
  }, [copyOnSelect]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      style={{ backgroundColor: 'var(--background)', padding: '2px' }}
    />
  );
}
