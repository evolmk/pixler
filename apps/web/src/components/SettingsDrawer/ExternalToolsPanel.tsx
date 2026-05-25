import { CheckCircle, XCircle, Link2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@pixler/ui/components/button';
import { useSetting } from '../../hooks/useSetting';
import { useIDEs } from '../../hooks/useIDEs';

interface SchemeStatus {
  registered: boolean;
  platform: string;
  method: string;
}

function useSchemeStatus() {
  return useQuery<SchemeStatus>({
    queryKey: ['deeplink', 'scheme-status'],
    queryFn: () => fetch('/api/deeplink/scheme-status').then((r) => r.json()),
    staleTime: 10_000,
  });
}

function useRegisterScheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetch('/api/deeplink/register-scheme', { method: 'POST' }).then((r) => r.json()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['deeplink', 'scheme-status'] }),
  });
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function IdeRow({ id, name, version, available }: { id: string; name: string; version: string | null; available: boolean }) {
  const { value: defaultIde, set: setDefaultIde } = useSetting<string>('ide.default');

  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
      onClick={() => available && setDefaultIde(id)}
    >
      {available ? (
        <CheckCircle className="size-3.5 shrink-0 text-success" />
      ) : (
        <XCircle className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span className={available ? '' : 'text-muted-foreground'}>{name}</span>
      {version && (
        <span className="ml-1 text-xs text-muted-foreground">{version.split('\n')[0]?.substring(0, 20)}</span>
      )}
      {defaultIde === id && (
        <span className="ml-auto text-[10px] text-primary">default</span>
      )}
    </div>
  );
}

export function ExternalToolsPanel() {
  const { data: ides = [], isLoading } = useIDEs();
  const { data: scheme, isLoading: schemeLoading } = useSchemeStatus();
  const register = useRegisterScheme();

  return (
    <div className="space-y-6">
      <Section label="IDEs">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Detecting…</p>
        ) : ides.length === 0 ? (
          <p className="text-xs text-muted-foreground">No IDEs detected.</p>
        ) : (
          <div className="space-y-1.5">
            {ides.map((ide) => (
              <IdeRow key={ide.id} {...ide} />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Click an available IDE to set it as the default. Open-in-IDE uses the default when no IDE is specified.
        </p>
      </Section>

      <Section label="URL Scheme (pixler://)">
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1">pixler:// deep links</span>
          {schemeLoading ? (
            <span className="text-xs text-muted-foreground">Checking…</span>
          ) : scheme?.registered ? (
            <CheckCircle className="size-3.5 text-success" />
          ) : (
            <XCircle className="size-3.5 text-muted-foreground" />
          )}
        </div>
        {!schemeLoading && !scheme?.registered && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            disabled={register.isPending}
            onClick={() => register.mutate()}
          >
            {register.isPending ? 'Registering…' : 'Register pixler:// scheme'}
          </Button>
        )}
        <p className="text-xs text-muted-foreground">
          Enables <code className="font-mono">pixler://workspace/&lt;id&gt;</code> links to open workspaces directly from other apps.
          {scheme && ` (${scheme.method})`}
        </p>
      </Section>
    </div>
  );
}
