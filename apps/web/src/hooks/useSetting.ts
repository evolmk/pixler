import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { socket } from '../lib/socket';

async function fetchSettings(): Promise<Record<string, unknown>> {
  const res = await fetch('/api/settings?scope=global');
  return res.json();
}

async function patchSetting(key: string, value: unknown): Promise<void> {
  await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scope: 'global', patch: { [key]: value } }),
  });
}

export function useSetting<T = unknown>(key: string): {
  value: T | undefined;
  set: (value: T) => void;
  isLoading: boolean;
} {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    const handler = (event: { type: string; key: string }) => {
      if (event.type === 'settings.changed') {
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      }
    };
    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [queryClient]);

  const mutation = useMutation({
    mutationFn: (value: T) => patchSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const set = useCallback(
    (value: T) => mutation.mutate(value),
    [mutation],
  );

  return {
    value: data?.[key] as T | undefined,
    set,
    isLoading,
  };
}
