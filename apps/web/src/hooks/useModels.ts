import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import type { ModelRegistryDto, ProviderModels, ModelFamily } from '@pixler/shared-types';

async function fetchRegistry(): Promise<ModelRegistryDto> {
  const res = await fetch('/api/models');
  if (!res.ok) return [];
  return res.json();
}

async function refreshRegistry(): Promise<ModelRegistryDto> {
  const res = await fetch('/api/models/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
}

export function useModelRegistry() {
  const qc = useQueryClient();

  useEffect(() => {
    const handler = (event: { type: string }) => {
      if (event.type === 'models:updated') {
        void qc.invalidateQueries({ queryKey: ['models', 'registry'] });
      }
    };
    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [qc]);

  return useQuery({
    queryKey: ['models', 'registry'],
    queryFn: fetchRegistry,
    staleTime: 5 * 60_000,
  });
}

export function useRefreshModels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshRegistry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['models', 'registry'] });
    },
  });
}

/** Resolve a model ID to its provider + family from the registry. */
export function resolveModel(
  registry: ModelRegistryDto,
  modelId: string,
): { provider: ProviderModels; family: ModelFamily } | null {
  for (const provider of registry) {
    for (const family of provider.families) {
      if (family.versions.some((v) => v.id === modelId)) {
        return { provider, family };
      }
    }
  }
  return null;
}

/** Get first available model ID from the registry. */
export function firstAvailableModel(registry: ModelRegistryDto): string | null {
  for (const provider of registry) {
    if (!provider.available) continue;
    for (const family of provider.families) {
      if (family.versions[0]) return family.versions[0].id;
    }
  }
  return null;
}
