import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseTerminalOptions {
  workspaceId: string | null | undefined;
  cols?: number;
  rows?: number;
  onData: (data: string) => void;
  onExit?: (code: number) => void;
}

interface UseTerminalReturn {
  terminalId: string | null;
  write: (data: string) => void;
  resize: (cols: number, rows: number) => void;
}

export function useTerminal({
  workspaceId,
  cols,
  rows,
  onData,
  onExit,
}: UseTerminalOptions): UseTerminalReturn {
  const [terminalId, setTerminalId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const terminalIdRef = useRef<string | null>(null);
  const onDataRef = useRef(onData);
  const onExitRef = useRef(onExit);

  useEffect(() => { onDataRef.current = onData; });
  useEffect(() => { onExitRef.current = onExit; });

  useEffect(() => {
    if (!workspaceId) return;

    let mounted = true;

    const sock = io(`${window.location.origin}/terminals`, {
      reconnection: true,
      reconnectionDelay: 1000,
    });
    socketRef.current = sock;

    sock.on('terminal.data', ({ terminalId: id, data }: { terminalId: string; data: string }) => {
      if (id === terminalIdRef.current) onDataRef.current(data);
    });

    sock.on('terminal.exit', ({ terminalId: id, exitCode }: { terminalId: string; exitCode: number }) => {
      if (id === terminalIdRef.current) onExitRef.current?.(exitCode);
    });

    fetch(`/api/workspaces/${workspaceId}/terminal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cols: cols ?? 80, rows: rows ?? 24 }),
    })
      .then((r) => r.json() as Promise<{ terminalId: string }>)
      .then(({ terminalId: id }) => {
        if (!mounted) return;
        terminalIdRef.current = id;
        setTerminalId(id);
        sock.emit('terminal.subscribe', id);
      });

    return () => {
      mounted = false;
      sock.disconnect();
      socketRef.current = null;
      terminalIdRef.current = null;
      setTerminalId(null);
    };
  }, [workspaceId]); // cols/rows intentionally excluded — initial size only

  const write = useCallback((data: string) => {
    const id = terminalIdRef.current;
    if (!id || !socketRef.current) return;
    socketRef.current.emit('terminal.input', { terminalId: id, data });
  }, []);

  const resize = useCallback((c: number, r: number) => {
    const id = terminalIdRef.current;
    if (!id || !socketRef.current) return;
    socketRef.current.emit('terminal.resize', { terminalId: id, cols: c, rows: r });
  }, []);

  return { terminalId, write, resize };
}
