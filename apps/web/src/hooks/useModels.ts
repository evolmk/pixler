import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import type { ModelRegistryDto, ProviderModels, ModelFamily, ModelVersion } from '@pixler/shared-types';

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

/**
 * Resolve a `provider:family` string to its provider, family, and latest version.
 * Returns null if the provider or family is not found in the registry.
 */
export function resolveFamily(
  registry: ModelRegistryDto,
  providerFamily: string,
): { provider: ProviderModels; family: ModelFamily; latest: ModelVersion } | null {
  const colonIdx = providerFamily.indexOf(':');
  if (colonIdx === -1) return null;
  const providerId = providerFamily.slice(0, colonIdx);
  const familyId = providerFamily.slice(colonIdx + 1);

  const provider = registry.find((p) => p.provider === providerId);
  if (!provider) return null;
  const family = provider.families.find((f) => f.id === familyId);
  if (!family || !family.versions[0]) return null;
  return { provider, family, latest: family.versions[0] };
}

/**
 * Resolve a model ID to its provider + family from the registry.
 * Used for legacy normalization — given a specific version id, find the enclosing family.
 * Kept for backward-compat; do not delete until all legacy paths are gone.
 */
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

/**
 * Normalize a stored model setting value to a canonical `provider:family` string.
 *
 * Normalization rules (checked in order — P0: inherit branch FIRST):
 *   1. `''` or `'__global__'`   → return `''`  (inherit sentinel — never warns)
 *   2. `'provider:family'`      → passthrough if provider+family exist; else null (warn)
 *   3. Legacy version id         → find enclosing family → `provider:family`
 *   4. Bare provider id          → `provider:firstFamily`
 *   5. Unknown / undetected      → null  (the ONLY case that should trigger a warning)
 */
export function normalizeModelSetting(
  registry: ModelRegistryDto,
  value: string,
): string | null {
  // 1. Inherit sentinel — must come before everything else (P0)
  if (!value || value === '__global__') return '';

  // 2. Already provider:family form
  if (value.includes(':')) {
    const colonIdx = value.indexOf(':');
    const providerId = value.slice(0, colonIdx);
    const familyId = value.slice(colonIdx + 1);
    const provider = registry.find((p) => p.provider === providerId);
    if (!provider) return null; // provider not in registry at all → warn
    if (!provider.available) return null; // provider detected before but CLI gone → warn
    const family = provider.families.find((f) => f.id === familyId);
    if (family) return value; // passthrough
    // Family not found — fall back to first family of that provider
    const firstFamily = provider.families[0];
    if (firstFamily) return `${providerId}:${firstFamily.id}`;
    return null;
  }

  // 3. Legacy specific version id — contains '-' separating name parts (e.g. claude-opus-4-7)
  //    Try resolveModel to find the enclosing family
  const resolvedFromVersion = resolveModel(registry, value);
  if (resolvedFromVersion) {
    return `${resolvedFromVersion.provider.provider}:${resolvedFromVersion.family.id}`;
  }

  // 4. Bare provider id (e.g. 'claude')
  const provider = registry.find((p) => p.provider === value);
  if (provider) {
    if (!provider.available) return null; // installed before, CLI gone → warn
    const firstFamily = provider.families[0];
    if (firstFamily) return `${value}:${firstFamily.id}`;
    return null;
  }

  // 5. Completely unknown — warn
  return null;
}

/**
 * Get the first available model as a `provider:family` string.
 * Used as the fallback when an unavailable provider is stored and a warning is shown.
 * Returns null when no provider is available at all.
 */
export function firstAvailableModel(registry: ModelRegistryDto): string | null {
  for (const provider of registry) {
    if (!provider.available) continue;
    for (const family of provider.families) {
      return `${provider.provider}:${family.id}`;
    }
  }
  return null;
}
