import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import { useSetting } from '../../hooks/useSetting';
import { useModelRegistry, useRefreshModels, resolveModel, firstAvailableModel } from '../../hooks/useModels';
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
  const { value: modelId = '', set: setModelId } = useSetting<string>(settingKey);

  const availableProviders = registry.filter((p) => p.available);
  const resolved = modelId ? resolveModel(registry, modelId) : null;
  const selectedProvider = resolved?.provider ?? availableProviders[0];
  const [localProvider, setLocalProvider] = useState(selectedProvider?.provider ?? '');

  useEffect(() => {
    if (!localProvider && availableProviders[0]) {
      setLocalProvider(availableProviders[0].provider);
    }
  }, [availableProviders, localProvider]);

  const providerObj = registry.find((p) => p.provider === localProvider);
  const modelOptions = providerObj?.families.flatMap((f) =>
    f.versions.map((v) => ({ id: v.id, label: `${f.label} — ${v.label}` })),
  ) ?? [];

  const isStale = modelId && !resolveModel(registry, modelId);

  const handleProviderChange = (prov: string) => {
    setLocalProvider(prov);
    const first = registry.find((p) => p.provider === prov)?.families[0]?.versions[0]?.id;
    if (first) setModelId(first);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {isStale && (
        <div className="flex items-center gap-1 text-[11px] text-warning">
          <AlertTriangle className="size-3" />
          Previous model no longer available — please re-select.
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
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={modelOptions.length === 0}
          className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
          aria-label="Model"
        >
          {modelOptions.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
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

      <Section label="Agent roles">
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
        Individual projects can override these defaults in{' '}
        <span className="font-medium">Project Settings → Models</span>.
      </p>
    </div>
  );
}
