import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { WorkspaceEvent } from '@pixler/shared-types';

export function useWorkspaceEvents(
  workspaceId: string | null,
  handler: (event: WorkspaceEvent) => void,
) {
  useEffect(() => {
    if (!workspaceId) return;

    socket.emit('join:workspace', workspaceId);
    socket.on('workspace:event', handler);

    return () => {
      socket.emit('leave:workspace', workspaceId);
      socket.off('workspace:event', handler);
    };
  }, [workspaceId, handler]);
}
