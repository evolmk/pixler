import { useParams } from '@tanstack/react-router';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Label } from '@pixler/ui/components/label';
import { Button } from '@pixler/ui/components/button';
import { useLinearStatus, useLinearTeams, useLinearProjects } from '../../hooks/useLinear';
import { useGithubStatus } from '../../hooks/useGithubStatus';
import { useSetting } from '../../hooks/useSetting';
import { useProjectLinearLink } from '../../hooks/useProjectLinearLink';
import { LinearProjectPicker } from '../LinearProjectPicker';

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

  const { data: ghStatus } = useGithubStatus();
  const { data: status } = useLinearStatus();
  const { data: teams = [] } = useLinearTeams();

  const { value: teamKey = '', set: setTeamKey } = useSetting<string>('linear.team');
  const { value: projectLinearTeamKey = '' } = useSetting<string>('linear.team');
  const { value: agentMode = 'cli', set: setAgentMode } = useSetting<AgentMode>('linear.agentMode');

  const {
    teamKey: linkTeamKey,
    teamId: linkTeamId,
    projectId: linkedProjectId,
    setTeam: setLinkTeam,
    setProject: setLinkProject,
    clear: clearLink,
  } = useProjectLinearLink(projectId);

  const activeTeam = teams.find((t) => t.key === (projectLinearTeamKey || teamKey));
  const { data: linearProjects = [] } = useLinearProjects(activeTeam?.id);
  const { data: linkProjects = [] } = useLinearProjects(linkTeamId);
  const linkedProject = linkProjects.find((p) => p.id === linkedProjectId);

  const showTokenWarning = agentMode === 'mcp' || agentMode === 'both';

  return (
    <div className="space-y-6">
      <Section label="GitHub">
        {ghStatus?.authed ? (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle className="size-3.5" />
            Logged in as <span className="font-medium">{ghStatus.username}</span>
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5" />
            Not authenticated — run <code className="font-mono text-[11px]">gh auth login</code> in your terminal.
          </p>
        )}
      </Section>

      {!status?.connected ? (
        <p className="text-xs text-muted-foreground">
          Connect your Linear account in{' '}
          <span className="font-medium">Settings → Linear</span> to configure Linear integrations.
        </p>
      ) : (<>
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

      <Section label="Linear project">
        {linkedProjectId && linkedProject ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 rounded-md border border-border px-2.5 py-1.5">
              <span className="truncate text-sm">{linkedProject.name}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearLink}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Unlink project"
              >
                <X className="size-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Issues from this project will appear in the New Workspace picker.
            </p>
            <LinearProjectPicker
              selectedTeamKey={linkTeamKey}
              selectedProjectId={linkedProjectId}
              onSelect={(teamKey, projId) => { setLinkTeam(teamKey); setLinkProject(projId); }}
            />
            <p className="text-[10px] text-muted-foreground">Change project</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <LinearProjectPicker
              selectedTeamKey={linkTeamKey}
              selectedProjectId={linkedProjectId}
              onSelect={(teamKey, projId) => { setLinkTeam(teamKey); setLinkProject(projId); }}
            />
            <p className="text-[10px] text-muted-foreground">
              Link a Linear project to enable issue picker in New Workspace.
            </p>
          </div>
        )}
      </Section>

      {linearProjects.length > 0 && (
        <Section label="Available projects">
          <p className="text-xs text-muted-foreground">
            {linearProjects.length} project{linearProjects.length !== 1 ? 's' : ''} in{' '}
            {activeTeam?.name ?? 'selected team'}.
          </p>
        </Section>
      )}
      </>)}
    </div>
  );
}
