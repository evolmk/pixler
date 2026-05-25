import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { AgentPhase } from '@pixler/orchestrator';

export interface OrchestratorState {
  phase: AgentPhase;
  rejectionCount: number;
  maxRejections: number;
  autoApprovePlan: boolean;
  autoApproveValidation: boolean;
  autoApprovePr: boolean;
  ticketId?: string;
  prUrl?: string;
  lastCritique?: string;
  error?: string;
}

async function fetchState(workspaceId: string): Promise<OrchestratorState | null> {
  const res = await fetch(`/api/workspaces/${workspaceId}/orchestrator/state`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch orchestrator state');
  return res.json();
}

async function postAction(workspaceId: string, action: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`/api/workspaces/${workspaceId}/orchestrator/${action}`, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Orchestrator ${action} failed`);
  return res.json();
}

export function useOrchestratorState(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string; workspaceId: string }) => {
      if (event.workspaceId === workspaceId && event.type.startsWith('agent.')) {
        void queryClient.invalidateQueries({ queryKey: ['orchestrator', workspaceId] });
      }
    };
    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, queryClient]);

  return useQuery({
    queryKey: ['orchestrator', workspaceId],
    queryFn: () => fetchState(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 5_000,
  });
}

export interface StartResponse {
  started: boolean;
  needsConfirmation?: boolean;
  preflight?: { percent: number; parallelCount: number; threshold: number };
}

async function startOrchestrator(workspaceId: string, override = false): Promise<StartResponse> {
  const url = `/api/workspaces/${workspaceId}/orchestrator/start${override ? '?override=true' : ''}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start orchestrator');
  return res.json() as Promise<StartResponse>;
}

export function useOrchestratorStart(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (override: boolean = false) => startOrchestrator(workspaceId, override),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orchestrator', workspaceId] }),
  });
}

export function useOrchestratorApprove(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction(workspaceId, 'approve'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orchestrator', workspaceId] }),
  });
}

export function useOrchestratorReject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note?: string) => postAction(workspaceId, 'reject', note ? { note } : undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orchestrator', workspaceId] }),
  });
}

export function useOrchestratorInterrupt(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postAction(workspaceId, 'interrupt'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orchestrator', workspaceId] }),
  });
}

export const GATE_PHASES = new Set<AgentPhase>([
  'awaiting_plan_approval',
  'awaiting_validation_approval',
  'awaiting_pr_approval',
]);

export const ACTIVE_PHASES = new Set<AgentPhase>([
  'planning',
  'reviewing',
  'executing',
  'validating',
]);
