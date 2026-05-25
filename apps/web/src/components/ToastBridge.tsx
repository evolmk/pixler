import { useEffect } from 'react';
import { toast } from '@pixler/ui/components/sonner';
import { socket } from '../lib/socket';
import { useSetting } from '../hooks/useSetting';

function isDndActive(start: string, end: string): boolean {
  if (!start || !end) return false;
  const now = new Date();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (sh == null || sm == null || eh == null || em == null) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  if (startMin <= endMin) return nowMin >= startMin && nowMin < endMin;
  return nowMin >= startMin || nowMin < endMin;
}

const SEVERITY_SEVERITIES = new Set(['success', 'warning', 'error']);

export function ToastBridge() {
  const { value: dndStart } = useSetting<string>('notifications.dnd.start');
  const { value: dndEnd } = useSetting<string>('notifications.dnd.end');

  useEffect(() => {
    const handler = (data: unknown) => {
      const evt = data as { kind: string; severity: string; activityId: string };
      if (!SEVERITY_SEVERITIES.has(evt.severity)) return;
      if (isDndActive(dndStart ?? '', dndEnd ?? '')) return;

      const title = evt.kind.replace(/\./g, ' ');
      if (evt.severity === 'success') {
        toast.success(title, { id: evt.activityId });
      } else if (evt.severity === 'error') {
        toast.error(title, { id: evt.activityId });
      } else {
        toast.warning(title, { id: evt.activityId });
      }
    };

    socket.on('activity.appended', handler);
    return () => { socket.off('activity.appended', handler); };
  }, [dndStart, dndEnd]);

  return null;
}
