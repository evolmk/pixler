import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { Send, Square, Brain, Shield } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { FileMentionPicker } from './FileMentionPicker';
import { SlashCommandPicker } from './SlashCommandPicker';
import type { SlashCommand } from './SlashCommandPicker';

interface Props {
  workspaceId: string;
  onSend: (text: string, opts?: { thinkingMode?: boolean; planMode?: boolean }) => void;
  onStop?: () => void;
  isRunning?: boolean;
  disabled?: boolean;
}

export function Composer({ workspaceId, onSend, onStop, isRunning, disabled }: Props) {
  const [value, setValue] = useState('');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [fileQuery, setFileQuery] = useState('');
  const [showSlashPicker, setShowSlashPicker] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);

    const cursor = e.target.selectionStart ?? v.length;
    const upToCursor = v.slice(0, cursor);

    const atMatch = upToCursor.match(/@([^\s]*)$/);
    if (atMatch) {
      setFileQuery(atMatch[1] ?? '');
      setShowFilePicker(true);
      setShowSlashPicker(false);
    } else {
      setShowFilePicker(false);
    }

    const slashMatch = upToCursor.match(/(?:^|\s)(\/[^\s]*)$/);
    if (slashMatch && upToCursor.trimStart().startsWith('/')) {
      setSlashQuery(slashMatch[1] ?? '/');
      setShowSlashPicker(true);
      setShowFilePicker(false);
    } else if (!upToCursor.trimStart().startsWith('/')) {
      setShowSlashPicker(false);
    }

    // auto-grow
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
    }
  }, []);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text, { thinkingMode, planMode });
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, disabled, onSend, thinkingMode, planMode]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showFilePicker || showSlashPicker) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }, [showFilePicker, showSlashPicker, submit]);

  const handleFileSelect = useCallback((path: string) => {
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? value.length;
    const before = value.slice(0, cursor).replace(/@[^\s]*$/, `@${path} `);
    const after = value.slice(cursor);
    setValue(before + after);
    setShowFilePicker(false);
    ta?.focus();
  }, [value]);

  const handleSlashSelect = useCallback((cmd: SlashCommand) => {
    setValue(cmd.id + ' ');
    setShowSlashPicker(false);
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="relative border-t border-border px-3 py-2">
      {showFilePicker && (
        <FileMentionPicker
          workspaceId={workspaceId}
          query={fileQuery}
          onSelect={handleFileSelect}
          onClose={() => setShowFilePicker(false)}
        />
      )}
      {showSlashPicker && (
        <SlashCommandPicker
          query={slashQuery}
          onSelect={handleSlashSelect}
          onClose={() => setShowSlashPicker(false)}
        />
      )}

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message, /command, or @file…"
          disabled={disabled && !isRunning}
          className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[36px] max-h-32 disabled:opacity-50"
        />
        <div className="flex shrink-0 flex-col gap-1">
          {isRunning ? (
            <Button variant="destructive" size="icon-xs" onClick={onStop} title="Stop agent">
              <Square className="size-3.5" />
            </Button>
          ) : (
            <Button size="icon-xs" onClick={submit} disabled={!value.trim() || disabled} title="Send (Enter)">
              <Send className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mode toggles */}
      <div className="mt-1.5 flex items-center gap-2">
        <button
          onClick={() => setThinkingMode((v) => !v)}
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] transition-colors ${thinkingMode ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          title="Toggle extended thinking mode (--thinking)"
        >
          <Brain className="size-2.5" />
          Thinking
        </button>
        <button
          onClick={() => setPlanMode((v) => !v)}
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] transition-colors ${planMode ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          title="Toggle plan mode (--permission-mode plan)"
        >
          <Shield className="size-2.5" />
          Plan mode
        </button>
      </div>
    </div>
  );
}
