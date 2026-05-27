import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { useSetting } from '../../hooks/useSetting';
import {
  useModelRegistry,
  useRefreshModels,
  resolveFamily,
  normalizeModelSetting,
  firstAvailableModel,
} from '../../hooks/useModels';
import type { ModelRegistryDto } from '@pixler/shared-types';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

// Sentinel value used in the provider select to represent "inherit from global"
const GLOBAL_DEFAULT = '__global__';

function ProjectModelPicker({
  label,
  settingKey,
  description,
  registry,
}: {
  label: string;
  settingKey: string;
  description: string;
  registry: ModelRegistryDto;
}) {
  const { value: storedValue = '', set: setSetting } = useSetting<string>(settingKey);

  // P0: normalize must handle inherit states first — '' / '__global__' → ''
  const normalized = normalizeModelSetting(registry, storedValue);
  const isGlobal = normalized === ''; // inherit from global (empty or __global__)
  const isStale = !isGlobal && normalized === null; // unavailable provider → warn

  const availableProviders = registry.filter((p) => p.available);

  // For display: use normalized value when valid; fallback to firstAvailableModel when stale
  const displayValue = isStale
    ? (firstAvailableModel(registry) ?? '')
    : (normalized ?? '');

  const resolved = displayValue ? resolveFamily(registry, displayValue) : null;
  const [localProvider, setLocalProvider] = useState(
    resolved?.provider.provider ?? availableProviders[0]?.provider ?? '',
  );

  useEffect(() => {
    if (!localProvider && availableProviders[0]) {
      setLocalProvider(availableProviders[0].provider);
    }
  }, [availableProviders, localProvider]);

  // Sync localProvider when the stored/normalized value changes externally
  useEffect(() => {
    if (resolved?.provider.provider) {
      setLocalProvider(resolved.provider.provider);
    }
  }, [resolved?.provider.provider]);

  const providerObj = registry.find((p) => p.provider === localProvider);
  const families = providerObj?.families ?? [];

  // Derive currently selected family id
  const resolvedForProvider = displayValue ? resolveFamily(registry, displayValue) : null;
  const selectedFamilyId =
    resolvedForProvider?.provider.provider === localProvider
      ? (resolvedForProvider.family.id ?? families[0]?.id ?? '')
      : (families[0]?.id ?? '');

  const handleProviderChange = (prov: string) => {
    if (prov === GLOBAL_DEFAULT) {
      setSetting('');
      return;
    }
    setLocalProvider(prov);
    const firstFamily = registry.find((p) => p.provider === prov)?.families[0];
    if (firstFamily) setSetting(`${prov}:${firstFamily.id}`);
  };

  const handleFamilyChange = (familyId: string) => {
    setSetting(`${localProvider}:${familyId}`);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {isStale && (
        <div className="flex items-center gap-1 text-[11px] text-warning">
          <AlertTriangle className="size-3" />
          Previous provider no longer detected — falling back to first available.
        </div>
      )}
      <div className="flex gap-2">
        <select
          value={isGlobal ? GLOBAL_DEFAULT : localProvider}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="w-40 shrink-0 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          aria-label="Provider"
        >
          <option value={GLOBAL_DEFAULT}>Global default</option>
          {availableProviders.map((p) => (
            <option key={p.provider} value={p.provider}>{p.label}</option>
          ))}
        </select>
        {!isGlobal && (
          <select
            value={selectedFamilyId}
            onChange={(e) => handleFamilyChange(e.target.value)}
            disabled={families.length === 0}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
            aria-label="Family"
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

export function ModelsPanel() {
  const { data: registry = [], isLoading } = useModelRegistry();
  const refresh = useRefreshModels();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Detecting CLIs…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Overrides the global model defaults for this project. Select "Global default" to inherit.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh.mutateAsync()}
          disabled={refresh.isPending}
          className="gap-1.5 text-xs"
        >
          {refresh.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Refresh
        </Button>
      </div>

      <Section label="Agent role overrides">
        <ProjectModelPicker
          label="Planner"
          settingKey="models.planner"
          description="Reads the ticket and writes a step-by-step plan."
          registry={registry}
        />
        <ProjectModelPicker
          label="Reviewer"
          settingKey="models.reviewer"
          description="Critiques the plan and emits APPROVED or REJECTED."
          registry={registry}
        />
        <ProjectModelPicker
          label="Executor"
          settingKey="models.executor"
          description="Implements the plan and opens the PR."
          registry={registry}
        />
      </Section>
    </div>
  );
}
