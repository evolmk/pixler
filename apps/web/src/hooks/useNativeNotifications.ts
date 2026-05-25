import { useEffect } from 'react';
import { socket } from '../lib/socket';
import { useSetting } from './useSetting';

function isDndActive(start: string, end: string): boolean {
  if (!start || !end) return false;
  const now = new Date();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (sh == null || sm == null || eh == null || em == null) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  if (startMin <= endMin) {
    return nowMin >= startMin && nowMin < endMin;
  }
  return nowMin >= startMin || nowMin < endMin;
}

export function useNativeNotifications() {
  const { value: enabled } = useSetting<boolean>('notifications.native');
  const { value: dndStart } = useSetting<string>('notifications.dnd.start');
  const { value: dndEnd } = useSetting<string>('notifications.dnd.end');

  useEffect(() => {
    if (!enabled) return;
    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handler = (data: unknown) => {
      const evt = data as { kind: string; severity: string; activityId: string };
      if (document.hasFocus()) return;
      if (Notification.permission !== 'granted') return;
      if (isDndActive(dndStart ?? '', dndEnd ?? '')) return;
      if (evt.severity !== 'success' && evt.severity !== 'warning' && evt.severity !== 'error') return;

      new Notification('Pixler', {
        body: evt.kind.replace(/\./g, ' '),
        icon: '/favicon.ico',
        tag: evt.activityId,
      });
    };

    socket.on('activity.appended', handler);
    return () => { socket.off('activity.appended', handler); };
  }, [enabled, dndStart, dndEnd]);
}
