import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { useSetting } from '../../hooks/useSetting';
import { useModelRegistry, useRefreshModels, resolveModel } from '../../hooks/useModels';
import type { ModelRegistryDto } from '@pixler/shared-types';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

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
  const { value: modelId = '', set: setModelId } = useSetting<string>(settingKey);
  const isGlobal = !modelId || modelId === GLOBAL_DEFAULT;

  const availableProviders = registry.filter((p) => p.available);
  const resolved = !isGlobal ? resolveModel(registry, modelId) : null;
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

  const isStale = !isGlobal && modelId && !resolveModel(registry, modelId);

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
          Previous model no longer available.
        </div>
      )}
      <div className="flex gap-2">
        <select
          value={isGlobal ? GLOBAL_DEFAULT : localProvider}
          onChange={(e) => {
            if (e.target.value === GLOBAL_DEFAULT) {
              setModelId('');
            } else {
              handleProviderChange(e.target.value);
            }
          }}
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
          Overrides the global defaults for this project. Select "Global default" to inherit.
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
