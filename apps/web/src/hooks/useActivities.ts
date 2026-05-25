import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { Activity, ActivitiesPage, MarkSeenDto } from '@pixler/shared-types';

export type { Activity };

async function fetchActivities(params: {
  scope?: string;
  scopeId?: string;
  unseenOnly?: boolean;
  cursor?: number;
}): Promise<ActivitiesPage> {
  const url = new URL('/api/activities', window.location.href);
  if (params.scope) url.searchParams.set('scope', params.scope);
  if (params.scopeId) url.searchParams.set('scopeId', params.scopeId);
  if (params.unseenOnly) url.searchParams.set('unseenOnly', 'true');
  if (params.cursor) url.searchParams.set('before', String(params.cursor));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json() as Promise<ActivitiesPage>;
}

export function useActivities(opts?: { scope?: string; scopeId?: string; unseenOnly?: boolean }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onAppended = () => {
      void queryClient.invalidateQueries({ queryKey: ['activities'] });
    };
    socket.on('activity.appended', onAppended);
    return () => { socket.off('activity.appended', onAppended); };
  }, [queryClient]);

  return useInfiniteQuery({
    queryKey: ['activities', opts?.scope, opts?.scopeId, opts?.unseenOnly],
    queryFn: ({ pageParam }) =>
      fetchActivities({ ...opts, cursor: pageParam as number | undefined }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ActivitiesPage) => {
      const activities = lastPage.activities;
      if (activities.length < 50) return undefined;
      return activities[activities.length - 1]?.created_at;
    },
  });
}

export function useUnseenCount(scope?: string, scopeId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onAppended = () => {
      void queryClient.invalidateQueries({ queryKey: ['activities-unseen', scope, scopeId] });
    };
    socket.on('activity.appended', onAppended);
    return () => { socket.off('activity.appended', onAppended); };
  }, [queryClient, scope, scopeId]);

  return useQuery({
    queryKey: ['activities-unseen', scope, scopeId],
    queryFn: async () => {
      const page = await fetchActivities({ scope, scopeId, unseenOnly: true });
      return page.unseenCount;
    },
  });
}

export function useMarkSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: MarkSeenDto) => {
      const res = await fetch('/api/activities/mark-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw new Error('Failed to mark seen');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useRecentActivities(limit = 20): Activity[] {
  const { data } = useActivities();
  return data?.pages.flatMap((p) => p.activities).slice(0, limit) ?? [];
}

export function useMarkAllActivitiesSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/activities/mark-all-seen', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to mark all seen');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
