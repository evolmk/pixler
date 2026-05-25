import { useEffect, useRef } from 'react';
import { useSetting } from './useSetting';

export function useWorkspaceClearOnSwitch(workspaceId: string | undefined) {
  const prevIdRef = useRef<string | undefined>(undefined);
  const { value: clearOnSwitch } = useSetting<boolean>('workspace.clearOnSwitch');

  useEffect(() => {
    const prev = prevIdRef.current;
    prevIdRef.current = workspaceId;

    if (!prev || prev === workspaceId) return;
    if (clearOnSwitch === false) return;

    fetch(`/api/workspaces/${prev}/terminals/clear`, { method: 'POST' }).catch(() => {});
  }, [workspaceId, clearOnSwitch]);
}
