import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { TerminalsService } from '../terminals/terminals.service';
import { MessagesService } from './messages.service';

// Strips ANSI escape sequences
const ANSI_RE = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;

function stripAnsi(s: string): string {
  return s.replace(ANSI_RE, '');
}

interface StreamState {
  msgId: string | null;
  buffer: string;
  fenceOpen: boolean;
  fenceLang: string;
}

@Injectable()
export class PtyBridgeService {
  private readonly logger = new Logger(PtyBridgeService.name);
  private readonly watched = new Map<string, () => void>();
  private readonly state = new Map<string, StreamState>();

  constructor(
    private readonly terminals: TerminalsService,
    private readonly messages: MessagesService,
    private readonly events: EventsService,
  ) {}

  watch(workspaceId: string, terminalId: string): void {
    if (this.watched.has(workspaceId)) return;

    const state: StreamState = { msgId: null, buffer: '', fenceOpen: false, fenceLang: '' };
    this.state.set(workspaceId, state);

    const off = this.terminals.onData(terminalId, (raw) => {
      const text = stripAnsi(raw);
      this.handleChunk(workspaceId, text, state);
    });

    const offExit = this.terminals.onExit(terminalId, () => {
      this.flush(workspaceId, state);
      this.watched.delete(workspaceId);
      this.state.delete(workspaceId);
    });

    this.watched.set(workspaceId, () => { off(); offExit(); });
  }

  unwatch(workspaceId: string): void {
    const cleanup = this.watched.get(workspaceId);
    if (cleanup) { cleanup(); this.watched.delete(workspaceId); this.state.delete(workspaceId); }
  }

  private handleChunk(workspaceId: string, text: string, state: StreamState): void {
    state.buffer += text;

    const lines = state.buffer.split('\n');
    state.buffer = lines.pop() ?? '';

    for (const line of lines) {
      this.processLine(workspaceId, line, state);
    }

    if (state.msgId && state.buffer.length > 0) {
      this.persistAndEmit(workspaceId, state, true);
    }
  }

  private processLine(workspaceId: string, line: string, state: StreamState): void {
    const trimmed = line.trimEnd();

    if (trimmed.startsWith('```')) {
      if (!state.fenceOpen) {
        state.fenceOpen = true;
        state.fenceLang = trimmed.slice(3).trim();
      } else {
        state.fenceOpen = false;
        state.fenceLang = '';
      }
    }

    if (!state.msgId) {
      const msg = this.messages.append(workspaceId, 'assistant', trimmed + '\n', 'text', true);
      state.msgId = msg.id;
    } else {
      const current = this.getCurrentContent(workspaceId, state.msgId);
      this.messages.patch(state.msgId, current + trimmed + '\n', true);
    }

    this.emitStreaming(workspaceId, state.msgId!);

    if (this.isEndOfTurn(trimmed)) {
      this.flush(workspaceId, state);
    }
  }

  private flush(workspaceId: string, state: StreamState): void {
    if (!state.msgId) return;
    const content = this.getCurrentContent(workspaceId, state.msgId);
    if (state.buffer.length > 0) {
      this.messages.patch(state.msgId, content + state.buffer, false);
      state.buffer = '';
    } else {
      this.messages.patch(state.msgId, content, false);
    }
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'message.appended',
      workspaceId,
      messageId: state.msgId,
      timestamp: Date.now(),
    });
    state.msgId = null;
    state.fenceOpen = false;
  }

  private persistAndEmit(workspaceId: string, state: StreamState, streaming: boolean): void {
    if (!state.msgId) return;
    this.emitStreaming(workspaceId, state.msgId);
    if (!streaming) this.flush(workspaceId, state);
  }

  private emitStreaming(workspaceId: string, msgId: string): void {
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'message.streaming',
      workspaceId,
      messageId: msgId,
      timestamp: Date.now(),
    });
  }

  private getCurrentContent(workspaceId: string, msgId: string): string {
    const list = this.messages.list(workspaceId);
    const msg = list.messages.find((m) => m.id === msgId);
    return msg?.content ?? '';
  }

  private isEndOfTurn(line: string): boolean {
    const trimmed = line.trim();
    return (
      trimmed === '>' ||
      trimmed.endsWith('> ') ||
      trimmed === '?' ||
      trimmed.endsWith('(Y/n)') ||
      trimmed.endsWith('(y/N)')
    );
  }
}
