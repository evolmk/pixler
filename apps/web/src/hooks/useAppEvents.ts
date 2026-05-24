import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { AppEvent } from '@pixler/shared-types';

export function useAppEvents(handler: (event: AppEvent) => void) {
  useEffect(() => {
    socket.on('app:event', handler);
    return () => {
      socket.off('app:event', handler);
    };
  }, [handler]);
}
