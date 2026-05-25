import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  ThreadPrimitive,
  MessagePrimitive,
  type ExternalStoreAdapter,
  type ThreadMessageLike,
  type AppendMessage,
} from '@assistant-ui/react';
import { ThumbsUp, ThumbsDown, Search, X } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useMessages, useSendMessage, useClearMessages } from '../hooks/useMessages';
import {
  useOrchestratorState,
  useOrchestratorApprove,
  useOrchestratorReject,
  useOrchestratorInterrupt,
  ACTIVE_PHASES,
  GATE_PHASES,
} from '../hooks/useOrchestrator';
import { Composer } from './Composer';
import type { Message } from '@pixler/shared-types';

function toThreadMessage(msg: Message): ThreadMessageLike {
  return {
    id: msg.id,
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: [{ type: 'text', text: msg.content }],
    status: msg.is_streaming ? { type: 'running' } : { type: 'complete', reason: 'stop' },
  };
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children }) {
          const lang = (className ?? '').replace('language-', '');
          const isBlock = lang.length > 0;
          if (isBlock) {
            return (
              <pre className="my-1.5 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
                <code className={className}>{children}</code>
              </pre>
            );
          }
          return (
            <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{children}</code>
          );
        },
        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-1 list-disc pl-4">{children}</ul>,
        ol: ({ children }) => <ol className="my-1 list-decimal pl-4">{children}</ol>,
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
        h1: ({ children }) => <h1 className="mb-1 mt-2 text-base font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-1 mt-2 text-sm font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-0.5 mt-1.5 text-sm font-semibold">{children}</h3>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

interface ChatPaneProps {
  workspaceId: string;
}

function ChatPaneInner({ workspaceId }: ChatPaneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [unread, setUnread] = useState(0);
  const isAtBottom = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { data: page } = useMessages(workspaceId);
  const { data: orchState } = useOrchestratorState(workspaceId);
  const sendMsg = useSendMessage(workspaceId);
  const clearMsg = useClearMessages(workspaceId);
  const approve = useOrchestratorApprove(workspaceId);
  const reject = useOrchestratorReject(workspaceId);
  const interrupt = useOrchestratorInterrupt(workspaceId);

  const allMessages = page?.messages ?? [];
  const messages = searchQuery
    ? allMessages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : allMessages;

  const isRunning = ACTIVE_PHASES.has(orchState?.phase ?? 'idle');
  const isGate = GATE_PHASES.has(orchState?.phase ?? 'idle');

  const adapter: ExternalStoreAdapter<Message> = {
    messages,
    isRunning,
    convertMessage: toThreadMessage,
    onNew: async (msg: AppendMessage) => {
      const text = msg.content
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('');
      if (text) await sendMsg.mutateAsync(text);
    },
  };

  const runtime = useExternalStoreRuntime(adapter);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isAtBottom.current) {
      el.scrollTop = el.scrollHeight;
    } else {
      setUnread((n) => n + 1);
    }
  }, [messages.length]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setUnread(0);
    isAtBottom.current = true;
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    isAtBottom.current = scrollHeight - scrollTop - clientHeight < 40;
    if (isAtBottom.current) setUnread(0);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    await sendMsg.mutateAsync(text);
  }, [sendMsg]);

  const handleStop = useCallback(() => {
    interrupt.mutate();
  }, [interrupt]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-col">
        {/* Search bar */}
        {showSearch && (
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              placeholder="Search messages…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3 text-sm"
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {searchQuery ? 'No messages match your search.' : 'No messages yet. Start the agent or type a message below.'}
            </div>
          ) : (
            <ThreadPrimitive.Messages
              components={{
                UserMessage: () => (
                  <div className="ml-auto max-w-[85%] rounded-lg bg-primary/10 px-3 py-2 text-sm">
                    <MessagePrimitive.Content components={{ Text: ({ text }) => <span>{text}</span> }} />
                  </div>
                ),
                AssistantMessage: () => (
                  <div className="max-w-full text-sm text-foreground">
                    <MessagePrimitive.Content
                      components={{ Text: ({ text }) => <MarkdownContent content={text} /> }}
                    />
                  </div>
                ),
              }}
            />
          )}
        </div>

        {/* Unread jump */}
        {unread > 0 && !searchQuery && (
          <button
            onClick={scrollToBottom}
            className="mx-3 mb-1 rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground"
          >
            {unread} new message{unread > 1 ? 's' : ''} ↓
          </button>
        )}

        {/* Gate action bar */}
        {isGate && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-3 py-2 bg-muted/30">
            <span className="flex-1 text-xs text-muted-foreground">
              Waiting for approval
            </span>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => reject.mutate(undefined)} disabled={reject.isPending}>
              <ThumbsDown className="size-3.5" />
              Reject
            </Button>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => approve.mutate()} disabled={approve.isPending}>
              <ThumbsUp className="size-3.5" />
              Approve
            </Button>
          </div>
        )}

        {/* Composer */}
        <Composer
          workspaceId={workspaceId}
          onSend={handleSend}
          onStop={handleStop}
          isRunning={isRunning}
          disabled={false}
        />

        {/* Search toggle */}
        <div className="flex shrink-0 items-center justify-between border-t border-border px-3 py-1">
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <Search className="size-3" />
            Search
          </button>
          <button
            onClick={() => clearMsg.mutate()}
            className="text-[10px] text-muted-foreground hover:text-foreground"
          >
            Clear history
          </button>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}

export function ChatPane({ workspaceId }: ChatPaneProps) {
  return <ChatPaneInner key={workspaceId} workspaceId={workspaceId} />;
}
