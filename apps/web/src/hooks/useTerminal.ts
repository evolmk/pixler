import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseTerminalOptions {
  workspaceId: string | null | undefined;
  /** If set, subscribe to this existing terminal instead of findOrCreate. */
  terminalId?: string | null;
  cols?: number;
  rows?: number;
  onData: (data: string) => void;
  onExit?: (code: number) => void;
}

interface UseTerminalReturn {
  terminalId: string | null;
  write: (data: string) => void;
  resize: (cols: number, rows: number) => void;
  interrupt: () => void;
}

export function useTerminal({
  workspaceId,
  terminalId: explicitTerminalId,
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

    const resolveId = explicitTerminalId
      ? Promise.resolve(explicitTerminalId)
      : fetch(`/api/workspaces/${workspaceId}/terminal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cols: cols ?? 80, rows: rows ?? 24 }),
        })
          .then((r) => r.json() as Promise<{ terminalId: string }>)
          .then((d) => d.terminalId);

    resolveId.then((id) => {
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
  }, [workspaceId, explicitTerminalId]); // cols/rows intentionally excluded — initial size only

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

  const interrupt = useCallback(() => {
    const id = terminalIdRef.current;
    if (!id) return;
    fetch(`/api/terminals/${id}/interrupt`, { method: 'POST' }).catch(() => {});
  }, []);

  return { terminalId, write, resize, interrupt };
}

export function useTerminalList(workspaceId: string | null | undefined) {
  const [terminals, setTerminals] = useState<string[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    let mounted = true;

    const load = () =>
      fetch(`/api/workspaces/${workspaceId}/terminals`)
        .then((r) => r.json() as Promise<{ terminals: string[] }>)
        .then((d) => { if (mounted) setTerminals(d.terminals); });

    load();
    return () => { mounted = false; };
  }, [workspaceId]);

  const addTerminal = useCallback(async () => {
    if (!workspaceId) return null;
    const res = await fetch(`/api/workspaces/${workspaceId}/terminal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // pass a sentinel to force-create a new terminal (not findOrCreate)
      body: JSON.stringify({ forceNew: true }),
    });
    const { terminalId } = await res.json() as { terminalId: string };
    setTerminals((prev) => [...prev, terminalId]);
    return terminalId;
  }, [workspaceId]);

  return { terminals, addTerminal };
}
