import { useParams } from '@tanstack/react-router';
import { Label } from '@pixler/ui/components/label';
import { useLinearStatus, useLinearTeams, useLinearProjects } from '../../hooks/useLinear';
import { useSetting } from '../../hooks/useSetting';

type AgentMode = 'cli' | 'mcp' | 'both';

const AGENT_MODES: Array<{ value: AgentMode; label: string; description: string }> = [
  { value: 'cli', label: 'CLI (default)', description: 'Agents use pixler-linear commands. Lowest token cost.' },
  { value: 'mcp', label: 'MCP', description: 'Agents use the official Linear MCP server. Higher token cost.' },
  { value: 'both', label: 'Both', description: 'Agents may use either. Highest token cost.' },
];

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
  void projectId;

  const { data: status } = useLinearStatus();
  const { data: teams = [] } = useLinearTeams();

  const { value: teamKey = '', set: setTeamKey } = useSetting<string>('linear.team');
  const { value: projectLinearTeamKey = '' } = useSetting<string>('linear.team');
  const { value: agentMode = 'cli', set: setAgentMode } = useSetting<AgentMode>('linear.agentMode');

  const activeTeam = teams.find((t) => t.key === (projectLinearTeamKey || teamKey));
  const { data: linearProjects = [] } = useLinearProjects(activeTeam?.id);

  const showTokenWarning = agentMode === 'mcp' || agentMode === 'both';

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

      <Section label="Linear agent access">
        <div className="space-y-2">
          {AGENT_MODES.map((mode) => (
            <label key={mode.value} className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="linear-agent-mode"
                value={mode.value}
                checked={agentMode === mode.value}
                onChange={() => setAgentMode(mode.value)}
                className="mt-0.5 accent-primary"
              />
              <span className="space-y-0.5">
                <span className="text-sm font-medium leading-none">{mode.label}</span>
                <span className="block text-[11px] text-muted-foreground">{mode.description}</span>
              </span>
            </label>
          ))}
          {showTokenWarning && (
            <p className="rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning-foreground">
              MCP mode sends your full ticket schema to the agent on every call, which increases
              token usage significantly. Use CLI mode unless you need the extra context.
            </p>
          )}
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
