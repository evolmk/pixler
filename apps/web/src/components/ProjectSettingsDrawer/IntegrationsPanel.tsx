import { useParams } from '@tanstack/react-router';
import { Label } from '@pixler/ui/components/label';
import { useLinearStatus, useLinearTeams, useLinearProjects } from '../../hooks/useLinear';
import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function IntegrationsPanel() {
  const params = useParams({ strict: false }) as { projectId?: string };
  const projectId = params.projectId;

  const { data: status } = useLinearStatus();
  const { data: teams = [] } = useLinearTeams();

  const { value: teamKey = '', set: setTeamKey } = useSetting<string>('linear.team');
  const { value: projectLinearTeamKey = '' } = useSetting<string>('linear.team');

  const activeTeam = teams.find((t) => t.key === (projectLinearTeamKey || teamKey));
  const { data: linearProjects = [] } = useLinearProjects(activeTeam?.id);

  if (!status?.connected) {
    return (
      <p className="text-xs text-muted-foreground">
        Connect your Linear account in{' '}
        <span className="font-medium">Settings → Linear</span> first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Section label="Linear team">
        <div className="space-y-1.5">
          <Label htmlFor="proj-linear-team" className="text-xs">Team override</Label>
          <select
            id="proj-linear-team"
            value={projectLinearTeamKey}
            onChange={(e) => setTeamKey(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Use global default ({teamKey || 'none'})</option>
            {teams.map((t) => (
              <option key={t.id} value={t.key}>
                {t.name} ({t.key})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">
            Tickets from this team will appear in the sidebar for this project.
          </p>
        </div>
      </Section>

      {linearProjects.length > 0 && (
        <Section label="Linear projects">
          <p className="text-xs text-muted-foreground">
            {linearProjects.length} project{linearProjects.length !== 1 ? 's' : ''} available in{' '}
            {activeTeam?.name ?? 'selected team'}.
          </p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {linearProjects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
