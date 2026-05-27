import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
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

function ModelPicker({
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

  const availableProviders = registry.filter((p) => p.available);

  // Normalize the stored value: '' / '__global__' → inherit; legacy version id → family;
  // bare provider → firstFamily; provider:family → passthrough; unknown → null (warn).
  const normalized = normalizeModelSetting(registry, storedValue);
  const isStale = normalized === null; // only true when provider is missing/unavailable

  // For display, use normalized value or fall back to firstAvailableModel
  const displayValue = isStale
    ? (firstAvailableModel(registry) ?? '')
    : (normalized ?? '');

  // Derive selectedProvider and selectedFamily from displayValue
  const resolved = displayValue ? resolveFamily(registry, displayValue) : null;
  const [localProvider, setLocalProvider] = useState(
    resolved?.provider.provider ?? availableProviders[0]?.provider ?? '',
  );

  useEffect(() => {
    if (!localProvider && availableProviders[0]) {
      setLocalProvider(availableProviders[0].provider);
    }
  }, [availableProviders, localProvider]);

  // When the normalized value changes externally (e.g. after a refresh), sync localProvider
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
          value={localProvider}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="w-36 shrink-0 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          aria-label="Provider"
        >
          {availableProviders.length === 0 && (
            <option value="">No CLIs detected</option>
          )}
          {availableProviders.map((p) => (
            <option key={p.provider} value={p.provider}>{p.label}</option>
          ))}
        </select>
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

  const hasAvailable = registry.some((p) => p.available);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {hasAvailable
            ? `${registry.filter((p) => p.available).length} of ${registry.length} providers detected`
            : 'No agent CLIs detected'}
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
          Refresh models
        </Button>
      </div>

      {!hasAvailable && (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-[11px] text-warning-foreground">
          No agent CLIs found. Install Claude, Gemini, or Codex CLI and click Refresh.
        </div>
      )}

      <Section label="Agent role defaults">
        <ModelPicker
          label="Planner"
          settingKey="models.planner"
          description="Reads the ticket and writes a step-by-step plan."
          registry={registry}
        />
        <ModelPicker
          label="Reviewer"
          settingKey="models.reviewer"
          description="Critiques the plan and emits APPROVED or REJECTED."
          registry={registry}
        />
        <ModelPicker
          label="Executor"
          settingKey="models.executor"
          description="Implements the plan and opens the PR."
          registry={registry}
        />
      </Section>

      <Separator />

      <p className="text-[11px] text-muted-foreground">
        These are defaults only — individual workflow steps can override the model used for each role.
        Per-project overrides are set in{' '}
        <span className="font-medium">Project Settings → Models</span>.
      </p>
    </div>
  );
}
