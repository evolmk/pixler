import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { Message, MessagesPage, SendMessageDto } from '@pixler/shared-types';

async function fetchMessages(workspaceId: string, cursor?: string): Promise<MessagesPage> {
  const url = cursor
    ? `/api/workspaces/${workspaceId}/messages?cursor=${cursor}`
    : `/api/workspaces/${workspaceId}/messages`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json() as Promise<MessagesPage>;
}

async function sendMessage(workspaceId: string, dto: SendMessageDto): Promise<Message> {
  const res = await fetch(`/api/workspaces/${workspaceId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json() as Promise<Message>;
}

async function clearMessages(workspaceId: string): Promise<void> {
  await fetch(`/api/workspaces/${workspaceId}/messages`, { method: 'DELETE' });
}

export function useMessages(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string; workspaceId: string }) => {
      if (event.workspaceId === workspaceId &&
          (event.type === 'message.appended' || event.type === 'message.streaming')) {
        void queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
      }
    };
    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, queryClient]);

  return useQuery({
    queryKey: ['messages', workspaceId],
    queryFn: () => fetchMessages(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 5_000,
    refetchInterval: 3_000,
  });
}

export function useSendMessage(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(workspaceId, { content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] }),
  });
}

export function useClearMessages(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearMessages(workspaceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] }),
  });
}
