import { Injectable, NotFoundException, BadRequestException, OnModuleDestroy } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';
import { ReadyDetectorService } from './ready-detector.service';
import { PixlerJsonService } from '../projects/pixler-json.service';
import type { RunStatus, RunState } from '@pixler/shared-types';

const MAX_LOG_LINES = 500;

interface RunEntry {
  workspaceId: string;
  state: RunState;
  pid: number | null;
  port: number | null;
  startedAt: number | null;
  readyAt: number | null;
  exitCode: number | null;
  logs: string[];
  process: ChildProcess | null;
  lineEmitter: EventEmitter;
  cleanupDetector: (() => void) | null;
}

type DbWorkspace = {
  id: string;
  port: number | null;
  worktree_path: string | null;
  project_id: string;
};

type DbProject = {
  id: string;
  path: string;
};

@Injectable()
export class RunService implements OnModuleDestroy {
  private readonly runs = new Map<string, RunEntry>();

  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
    private readonly readyDetector: ReadyDetectorService,
    private readonly pixlerJson: PixlerJsonService,
  ) {}

  getStatus(workspaceId: string): RunStatus {
    const entry = this.runs.get(workspaceId);
    if (!entry) {
      return { workspaceId, state: 'stopped', pid: null, port: null, startedAt: null, readyAt: null, exitCode: null, logs: [] };
    }
    return this.toStatus(entry);
  }

  async start(workspaceId: string, readyPattern?: string): Promise<RunStatus> {
    const ws = this.db.connection.prepare('SELECT id, port, worktree_path, project_id FROM workspaces WHERE id = ?').get(workspaceId) as DbWorkspace | undefined;
    if (!ws) throw new NotFoundException(`Workspace ${workspaceId} not found`);

    const existing = this.runs.get(workspaceId);
    if (existing && (existing.state === 'starting' || existing.state === 'running' || existing.state === 'ready')) {
      throw new BadRequestException('Process already running');
    }

    const project = this.db.connection.prepare('SELECT id, path FROM projects WHERE id = ?').get(ws.project_id) as DbProject | undefined;
    if (!project) throw new NotFoundException('Project not found');

    const pixlerJson = this.pixlerJson.load(project.path);
    const runScript = pixlerJson?.scripts?.run;
    if (!runScript) throw new BadRequestException('No run script defined in pixler.json');

    const worktreePath = ws.worktree_path ?? project.path;
    const port = ws.port;

    const entry: RunEntry = {
      workspaceId,
      state: 'starting',
      pid: null,
      port,
      startedAt: Date.now(),
      readyAt: null,
      exitCode: null,
      logs: [],
      process: null,
      lineEmitter: new EventEmitter(),
      cleanupDetector: null,
    };
    this.runs.set(workspaceId, entry);
    this.emitStatus(entry);

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PIXLER_WORKSPACE_ID: workspaceId,
      ...(port ? { PIXLER_PORT: String(port), PORT: String(port) } : {}),
    };

    const child = spawn(runScript, [], {
      cwd: worktreePath,
      env,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    entry.process = child;
    entry.pid = child.pid ?? null;
    entry.state = 'running';
    this.emitStatus(entry);

    const appendLog = (line: string) => {
      entry.logs.push(line);
      if (entry.logs.length > MAX_LOG_LINES) entry.logs.shift();
      entry.lineEmitter.emit('line', line);
      this.events.emitWorkspaceEvent(workspaceId, { type: 'run.log', line });
    };

    const handleStream = (stream: NodeJS.ReadableStream) => {
      let buf = '';
      stream.on('data', (chunk: Buffer) => {
        buf += chunk.toString();
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) appendLog(line);
      });
      stream.on('end', () => { if (buf) appendLog(buf); });
    };

    if (child.stdout) handleStream(child.stdout);
    if (child.stderr) handleStream(child.stderr);

    entry.cleanupDetector = this.readyDetector.attach(
      entry.lineEmitter,
      port,
      readyPattern,
      () => {
        entry.state = 'ready';
        entry.readyAt = Date.now();
        this.emitStatus(entry);
      },
    );

    child.on('exit', (code) => {
      entry.cleanupDetector?.();
      entry.state = 'stopped';
      entry.exitCode = code;
      entry.process = null;
      this.emitStatus(entry);
    });

    return this.toStatus(entry);
  }

  async stop(workspaceId: string): Promise<RunStatus> {
    const entry = this.runs.get(workspaceId);
    if (!entry?.process) throw new BadRequestException('No running process');

    entry.state = 'stopping';
    this.emitStatus(entry);

    const pid = entry.process.pid;
    entry.process.kill('SIGTERM');

    if (pid) {
      setTimeout(() => {
        try { process.kill(pid, 'SIGKILL'); } catch { /* already gone */ }
      }, 5000);
    }

    return this.toStatus(entry);
  }

  onModuleDestroy() {
    for (const entry of this.runs.values()) {
      entry.process?.kill('SIGTERM');
    }
  }

  private toStatus(entry: RunEntry): RunStatus {
    return {
      workspaceId: entry.workspaceId,
      state: entry.state,
      pid: entry.pid,
      port: entry.port,
      startedAt: entry.startedAt,
      readyAt: entry.readyAt,
      exitCode: entry.exitCode,
      logs: [...entry.logs],
    };
  }

  private emitStatus(entry: RunEntry) {
    this.events.emitWorkspaceEvent(entry.workspaceId, {
      type: 'run.status',
      ...this.toStatus(entry),
    });
  }
}
