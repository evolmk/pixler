import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { socket } from '../lib/socket';
import type { AppEvent } from '@pixler/shared-types';

export function useDeepLink() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: AppEvent) => {
      if (event.type !== 'deeplink.received') return;
      if (event.resource === 'workspace') {
        void navigate({ to: '/p/$projectId/w/$workspaceId', params: { projectId: '_', workspaceId: event.id } });
      } else if (event.resource === 'project') {
        void navigate({ to: '/p/$projectId', params: { projectId: event.id } });
      }
    };

    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [navigate]);
}
