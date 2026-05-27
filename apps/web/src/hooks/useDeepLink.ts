import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { socket } from '../lib/socket';
import { useCurrentProjectStore } from '../stores/currentProject';
import type { AppEvent } from '@pixler/shared-types';

export function useDeepLink() {
  const navigate = useNavigate();
  const setProjectId = useCurrentProjectStore((s) => s.setProjectId);

  useEffect(() => {
    const handler = (event: AppEvent) => {
      if (event.type !== 'deeplink.received') return;
      if (event.resource === 'workspace') {
        void navigate({ to: '/w/$workspaceId', params: { workspaceId: event.id } });
      } else if (event.resource === 'project') {
        setProjectId(event.id);
        void navigate({ to: '/' });
      }
    };

    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [navigate, setProjectId]);
}
